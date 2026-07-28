import { Workspace, type WorkspaceDocument } from '../models/Workspace.model.js';

type WorkspaceMemberInput = {
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt?: Date;
};

export const workspaceRepository = {
  create(data: {
    name: string;
    slug: string;
    description?: string;
    ownerId: string;
    members?: WorkspaceMemberInput[];
  }): Promise<WorkspaceDocument> {
    return Workspace.create(data);
  },

  findById(id: string): Promise<WorkspaceDocument | null> {
    return Workspace.findById(id).exec();
  },

  findByUserId(userId: string): Promise<WorkspaceDocument[]> {
    return Workspace.find({ 'members.userId': userId }).exec();
  },

  updateById(id: string, updates: Partial<WorkspaceDocument>): Promise<WorkspaceDocument | null> {
    return Workspace.findByIdAndUpdate(id, updates, { new: true }).exec();
  },

  addMember(workspaceId: string, member: WorkspaceMemberInput) {
    return Workspace.findByIdAndUpdate(
      workspaceId,
      { $push: { members: member } },
      { new: true },
    ).exec();
  },

  updateMemberRole(workspaceId: string, userId: string, role: string) {
    return Workspace.findOneAndUpdate(
      { _id: workspaceId, 'members.userId': userId },
      { $set: { 'members.$.role': role } },
      { new: true },
    ).exec();
  },

  removeMember(workspaceId: string, userId: string) {
    return Workspace.findByIdAndUpdate(
      workspaceId,
      { $pull: { members: { userId } } },
      { new: true },
    ).exec();
  },
};
