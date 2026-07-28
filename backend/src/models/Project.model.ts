import mongoose, { Schema, Document } from 'mongoose';

export interface IProjectMember {
  userId: mongoose.Types.ObjectId | string;
  userName?: string;
  userEmail?: string;
  projectRole?: string;
  role?: string;
  joinedAt?: Date;
}

export interface IProject extends Document {
  name: string;
  slug: string;
  description: string;
  team: string;
  sprint: string;
  members: IProjectMember[];
  status: 'active' | 'planning' | 'paused' | 'completed';
  workspaceId?: mongoose.Types.ObjectId | string;
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectDocument = IProject;

const ProjectSchema: Schema = new Schema(
  {
    name: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    team: { type: String, default: 'Engineering' },
    sprint: { type: String, default: 'Sprint 1' },
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', index: true },
    members: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        userName: { type: String, default: '' },
        userEmail: { type: String, default: '' },
        projectRole: { type: String, default: 'Project Admin' },
        role: { type: String, default: 'owner' },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    status: { type: String, default: 'active', index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
    deletedBy: { type: String },
  },
  { timestamps: true }
);

export const ProjectModel = mongoose.model<IProject>('Project', ProjectSchema);
export const Project = ProjectModel;
