import mongoose, { Schema, type Document, type Model, type Types } from 'mongoose';

export type WorkspaceMember = {
  userId: Types.ObjectId | string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: Date;
};

export type WorkspaceDocument = Document & {
  name: string;
  slug: string;
  description?: string;
  ownerId: Types.ObjectId | string;
  members: WorkspaceMember[];
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const workspaceSchema = new Schema<WorkspaceDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: '' },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    members: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        role: {
          type: String,
          enum: ['owner', 'admin', 'member', 'viewer'],
          default: 'member',
        },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Workspace: Model<WorkspaceDocument> =
  mongoose.models.Workspace ?? mongoose.model<WorkspaceDocument>('Workspace', workspaceSchema);
export const WorkspaceModel = Workspace;
