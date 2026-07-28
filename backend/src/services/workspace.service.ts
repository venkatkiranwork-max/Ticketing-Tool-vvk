import { workspaceRepository } from '../repositories/workspace.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { BadRequestError, NotFoundError } from '../utils/AppError.js';

export type WorkspaceCreateInput = {
  name: string;
  slug: string;
  description?: string;
};

export type WorkspaceMemberInput = {
  userId: string;
  role?: 'owner' | 'admin' | 'member' | 'viewer';
};

export const workspaceService = {
  async createWorkspace(input: WorkspaceCreateInput, ownerId: string) {
    const slug = input.slug.trim().toLowerCase();

    if (!slug) {
      throw new BadRequestError('Workspace slug is required');
    }

    const workspace = await workspaceRepository.create({
      name: input.name.trim(),
      slug,
      description: input.description?.trim(),
      ownerId,
      members: [{ userId: ownerId, role: 'owner', joinedAt: new Date() }],
    });

    return workspace;
  },

  async listWorkspaces(userId: string) {
    return workspaceRepository.findByUserId(userId);
  },

  async getWorkspace(id: string) {
    const workspace = await workspaceRepository.findById(id);
    if (!workspace) {
      throw new NotFoundError('Workspace not found');
    }
    return workspace;
  },

  async inviteMember(workspaceId: string, input: WorkspaceMemberInput) {
    const workspace = await workspaceRepository.findById(workspaceId);
    if (!workspace) {
      throw new NotFoundError('Workspace not found');
    }

    const user = await userRepository.findByEmail(input.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return workspaceRepository.addMember(workspaceId, {
      userId: user._id.toString(),
      role: input.role ?? 'member',
      joinedAt: new Date(),
    });
  },

  async updateMemberRole(workspaceId: string, userId: string, role: string) {
    return workspaceRepository.updateMemberRole(workspaceId, userId, role);
  },

  async removeMember(workspaceId: string, userId: string) {
    return workspaceRepository.removeMember(workspaceId, userId);
  },

  async updateWorkspace(id: string, updates: Partial<WorkspaceCreateInput> & { isArchived?: boolean }) {
    const workspace = await workspaceRepository.updateById(id, updates);
    if (!workspace) {
      throw new NotFoundError('Workspace not found');
    }
    return workspace;
  },
};
