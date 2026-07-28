import { projectRepository } from '../repositories/project.repository.js';
import { BadRequestError, NotFoundError } from '../utils/AppError.js';

export type ProjectCreateInput = {
  workspaceId: string;
  name: string;
  slug: string;
  description?: string;
  team?: string;
};

export const projectService = {
  async createProject(input: ProjectCreateInput, ownerId?: string) {
    const rawSlug = input.slug || input.name || '';
    const slug = rawSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');

    if (!slug) {
      throw new BadRequestError('Project name or slug is required');
    }

    let workspaceId = input.workspaceId;
    if (!workspaceId) {
      const { WorkspaceModel } = await import('../models/Workspace.model.js');
      const ws = await WorkspaceModel.findOne({ isDeleted: false });
      if (ws) {
        workspaceId = ws._id.toString();
      }
    }

    let validOwnerId = ownerId;
    let userName = 'Project Owner';
    let userEmail = 'owner@abctech.io';

    const { UserModel } = await import('../models/User.model.js');
    if (validOwnerId) {
      const u = await UserModel.findById(validOwnerId);
      if (u) {
        userName = `${u.firstName} ${u.lastName}`.trim();
        userEmail = u.email;
      }
    } else {
      const u = await UserModel.findOne({ isDeleted: false });
      if (u) {
        validOwnerId = u._id.toString();
        userName = `${u.firstName} ${u.lastName}`.trim();
        userEmail = u.email;
      }
    }

    const project = await projectRepository.create({
      workspaceId: workspaceId!,
      name: input.name.trim(),
      slug,
      description: input.description?.trim() || '',
      team: (input as any).team || 'Engineering',
      ownerId: validOwnerId!,
      members: validOwnerId
        ? [
            {
              userId: validOwnerId,
              userName,
              userEmail,
              projectRole: 'Project Admin',
              role: 'owner',
              joinedAt: new Date(),
            },
          ]
        : [],
    });

    return project;
  },

  async listProjects(workspaceId: string) {
    return projectRepository.findByWorkspaceId(workspaceId);
  },

  async listProjectsWithStats(workspaceId?: string) {
    const projects = await projectRepository.findByWorkspaceId(workspaceId || '');
    const { IssueModel } = await import('../models/Issue.model.js');

    const statsAgg = await IssueModel.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: '$projectId',
          issueCount: { $sum: 1 },
          completedIssueCount: {
            $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] },
          },
          openIssuesCount: {
            $sum: { $cond: [{ $ne: ['$status', 'done'] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 1,
          issueCount: 1,
          completedIssueCount: 1,
          openIssuesCount: 1,
          completionRate: {
            $cond: [
              { $gt: ['$issueCount', 0] },
              { $multiply: [{ $divide: ['$completedIssueCount', '$issueCount'] }, 100] },
              0,
            ],
          },
          progress: {
            $cond: [
              { $gt: ['$issueCount', 0] },
              { $multiply: [{ $divide: ['$completedIssueCount', '$issueCount'] }, 100] },
              0,
            ],
          },
        },
      },
    ]);

    const statsMap = new Map<string, any>();
    statsAgg.forEach((stat) => {
      if (stat._id) {
        statsMap.set(stat._id.toString(), stat);
      }
    });

    return projects.map((p) => {
      const pObj = typeof p.toObject === 'function' ? p.toObject() : p;
      const idStr = pObj._id.toString();
      const liveStats = statsMap.get(idStr) || {
        issueCount: 0,
        completedIssueCount: 0,
        openIssuesCount: 0,
        completionRate: 0,
        progress: 0,
      };

      return {
        ...pObj,
        issueCount: liveStats.issueCount,
        completedIssueCount: liveStats.completedIssueCount,
        openIssuesCount: liveStats.openIssuesCount,
        completionRate: Math.round(liveStats.completionRate),
        progress: Math.round(liveStats.progress),
      };
    });
  },

  async getProject(id: string) {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new NotFoundError('Project not found');
    }
    return project;
  },

  async updateProject(id: string, updates: Partial<ProjectCreateInput> & { isArchived?: boolean }) {
    const project = await projectRepository.updateById(id, updates);
    if (!project) {
      throw new NotFoundError('Project not found');
    }
    return project;
  },

  async deleteProject(id: string) {
    const deleted = await projectRepository.remove(id);
    if (!deleted) {
      throw new NotFoundError('Project not found');
    }
    return { deleted: true };
  },

  async addMember(projectId: string, userId: string, role: 'owner' | 'admin' | 'member' | 'viewer' = 'member') {
    return projectRepository.addMember(projectId, { userId, role, joinedAt: new Date() });
  },

  async updateMemberRole(projectId: string, userId: string, role: string) {
    return projectRepository.updateMemberRole(projectId, userId, role);
  },

  async removeMember(projectId: string, userId: string) {
    return projectRepository.removeMember(projectId, userId);
  },

  async getProjectStats(projectId: string) {
    const { IssueModel } = await import('../models/Issue.model.js');
    const mongoose = (await import('mongoose')).default;

    const stats = await IssueModel.aggregate([
      {
        $match: {
          projectId: new mongoose.Types.ObjectId(projectId),
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: '$projectId',
          issueCount: { $sum: 1 },
          completedIssueCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'done'] }, 1, 0],
            },
          },
          openIssuesCount: {
            $sum: {
              $cond: [{ $ne: ['$status', 'done'] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          issueCount: 1,
          completedIssueCount: 1,
          openIssuesCount: 1,
          completionRate: {
            $cond: [
              { $gt: ['$issueCount', 0] },
              { $multiply: [{ $divide: ['$completedIssueCount', '$issueCount'] }, 100] },
              0,
            ],
          },
          progress: {
            $cond: [
              { $gt: ['$issueCount', 0] },
              { $multiply: [{ $divide: ['$completedIssueCount', '$issueCount'] }, 100] },
              0,
            ],
          },
        },
      },
    ]);

    return stats[0] || {
      issueCount: 0,
      completedIssueCount: 0,
      openIssuesCount: 0,
      completionRate: 0,
      progress: 0,
    };
  },
};
