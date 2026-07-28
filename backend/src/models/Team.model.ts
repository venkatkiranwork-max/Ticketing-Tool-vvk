import mongoose, { Schema, Document } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  description: string;
  teamLeadId: string;
  teamLeadName: string;
  teamLeadAvatar?: string;
  memberCount: number;
  projectCount: number;
  openIssuesCount: number;
  velocity: number;
  currentSprint: string;
  color: string;
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    teamLeadId: { type: String, required: true },
    teamLeadName: { type: String, required: true },
    teamLeadAvatar: { type: String },
    memberCount: { type: Number, default: 1 },
    projectCount: { type: Number, default: 1 },
    openIssuesCount: { type: Number, default: 0 },
    velocity: { type: Number, default: 30 },
    currentSprint: { type: String, default: 'Sprint 1' },
    color: { type: String, default: '#6366f1' },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date },
    deletedBy: { type: String },
  },
  { timestamps: true }
);

export const TeamModel = mongoose.model<ITeam>('Team', TeamSchema);
