import mongoose, { Schema, Document } from 'mongoose';

export interface IIssueChecklistItem {
  id: string;
  text: string;
  isCompleted: boolean;
}

export interface IIssueComment {
  id: string;
  userId: string;
  text: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface IIssueAttachment {
  id: string;
  name: string;
  size: number;
  fileType: string;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface IIssueHistory {
  id: string;
  timestamp: Date;
  actorId?: mongoose.Types.ObjectId | string;
  actorName: string;
  action: string;
  details: string;
}

export interface IIssue extends Document {
  key: string;
  title: string;
  description: string;
  type: 'task' | 'bug' | 'story' | 'improvement';
  status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'critical' | 'high' | 'medium' | 'low';
  assigneeId: mongoose.Types.ObjectId | string;
  assigneeName?: string;
  assigneeEmail?: string;
  assigneeAvatar?: string;
  reporterId: mongoose.Types.ObjectId | string;
  reporterName?: string;
  projectId: mongoose.Types.ObjectId | string;
  projectName: string;
  workspaceId: mongoose.Types.ObjectId | string;
  sprint: string;
  dueDate: Date;
  labels: string[];
  storyPoints: number;
  checklist: IIssueChecklistItem[];
  comments: IIssueComment[];
  attachments: IIssueAttachment[];
  history: IIssueHistory[];
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IssueDocument = IIssue;

const IssueSchema: Schema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    type: { type: String, enum: ['task', 'bug', 'story', 'improvement'], default: 'task', index: true },
    status: { type: String, default: 'todo', index: true },
    priority: { type: String, default: 'medium', index: true },
    assigneeId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    assigneeName: { type: String },
    assigneeEmail: { type: String },
    assigneeAvatar: { type: String },
    reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    reporterName: { type: String },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    projectName: { type: String, required: true },
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    sprint: { type: String, default: 'Sprint 1' },
    dueDate: { type: Date, required: true },
    labels: [{ type: String }],
    storyPoints: { type: Number, default: 3 },
    checklist: [
      {
        id: { type: String, required: true },
        text: { type: String, required: true },
        isCompleted: { type: Boolean, default: false },
      },
    ],
    comments: [
      {
        id: { type: String, required: true },
        userId: { type: String, required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date },
      },
    ],
    attachments: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        size: { type: Number, required: true },
        fileType: { type: String, required: true },
        url: { type: String, required: true },
        uploadedBy: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    history: [
      {
        id: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        actorId: { type: Schema.Types.ObjectId, ref: 'User' },
        actorName: { type: String, required: true },
        action: { type: String, required: true },
        details: { type: String, required: true },
      },
    ],
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
    deletedBy: { type: String },
  },
  { timestamps: true }
);

export const IssueModel = mongoose.model<IIssue>('Issue', IssueSchema);
export const Issue = IssueModel;
