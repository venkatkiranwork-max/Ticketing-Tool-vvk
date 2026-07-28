import { Project, type ProjectDocument } from '../models/Project.model.js';

export type ProjectMemberInput = {
  userId: string;
  userName?: string;
  userEmail?: string;
  projectRole?: string;
  role?: string;
  joinedAt?: Date;
};

export const projectRepository = {
  create(data: {
    workspaceId: string;
    name: string;
    slug: string;
    description?: string;
    team?: string;
    ownerId: string;
    members?: ProjectMemberInput[];
  }): Promise<ProjectDocument> {
    return Project.create(data);
  },

  findById(id: string): Promise<ProjectDocument | null> {
    return Project.findById(id).exec();
  },

  findByWorkspaceId(workspaceId?: string): Promise<ProjectDocument[]> {
    const query = workspaceId ? { workspaceId, isDeleted: false } : { isDeleted: false };
    return Project.find(query).exec();
  },

  updateById(id: string, updates: Partial<ProjectDocument>): Promise<ProjectDocument | null> {
    return Project.findByIdAndUpdate(id, updates, { new: true }).exec();
  },

  remove(id: string): Promise<ProjectDocument | null> {
    return Project.findByIdAndDelete(id).exec();
  },

  addMember(projectId: string, member: ProjectMemberInput) {
    return Project.findByIdAndUpdate(
      projectId,
      { $push: { members: member } },
      { new: true },
    ).exec();
  },

  updateMemberRole(projectId: string, userId: string, role: string) {
    return Project.findOneAndUpdate(
      { _id: projectId, 'members.userId': userId },
      { $set: { 'members.$.role': role } },
      { new: true },
    ).exec();
  },

  removeMember(projectId: string, userId: string) {
    return Project.findByIdAndUpdate(
      projectId,
      { $pull: { members: { userId } } },
      { new: true },
    ).exec();
  },
};
