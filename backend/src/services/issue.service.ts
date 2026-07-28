import { issueRepository } from '../repositories/issue.repository.js';
import { BadRequestError, NotFoundError } from '../utils/AppError.js';
import type { IIssueAttachment, IIssueChecklistItem, IIssueComment } from '../models/Issue.model.js';

export type IssueCreateInput = {
  projectId: string;
  workspaceId: string;
  key?: string;
  title: string;
  description?: string;
  type?: 'task' | 'bug' | 'story' | 'improvement';
  status?: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  labels?: string[];
  assigneeId?: string;
  reporterId: string;
  dueDate?: Date;
  attachments?: IIssueAttachment[];
  checklist?: IIssueChecklistItem[];
  comments?: IIssueComment[];
};

export const issueService = {
  async createIssue(input: IssueCreateInput) {
    if (!input.title?.trim()) {
      throw new BadRequestError('Issue title is required');
    }

    let workspaceId = input.workspaceId;
    if (!workspaceId && input.projectId) {
      const { projectRepository } = await import('../repositories/project.repository.js');
      const project = await projectRepository.findById(input.projectId);
      if (project?.workspaceId) {
        workspaceId = project.workspaceId.toString();
      }
    }

    if (!workspaceId) {
      const { WorkspaceModel } = await import('../models/Workspace.model.js');
      const ws = await WorkspaceModel.findOne({ isDeleted: false });
      if (ws) {
        workspaceId = ws._id.toString();
      }
    }

    return issueRepository.create({
      ...input,
      workspaceId: workspaceId!,
      title: input.title.trim(),
      description: input.description?.trim(),
      type: input.type || 'task',
      labels: input.labels ?? [],
      attachments: input.attachments ?? [],
      checklist: input.checklist ?? [],
      comments: input.comments ?? [],
    });
  },

  async listIssues(projectId: string) {
    return issueRepository.findByProjectId(projectId);
  },

  async getIssue(id: string) {
    const issue = await issueRepository.findById(id);
    if (!issue) {
      throw new NotFoundError('Issue not found');
    }
    return issue;
  },

  async updateIssue(id: string, updates: Partial<IssueCreateInput> & { status?: IssueCreateInput['status']; priority?: IssueCreateInput['priority'] }) {
    const issue = await issueRepository.updateById(id, updates);
    if (!issue) {
      throw new NotFoundError('Issue not found');
    }
    return issue;
  },

  async deleteIssue(id: string) {
    const deleted = await issueRepository.remove(id);
    if (!deleted) {
      throw new NotFoundError('Issue not found');
    }
    return { deleted: true };
  },
};
