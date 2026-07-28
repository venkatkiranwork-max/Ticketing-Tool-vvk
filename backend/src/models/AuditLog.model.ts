import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  userName: string;
  userRole: string;
  action: string;
  module: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  details: string;
  createdAt: Date;
}

export type AuditLogDocument = IAuditLog;

const AuditLogSchema: Schema = new Schema(
  {
    userName: { type: String, required: true },
    userRole: { type: String, required: true },
    action: { type: String, required: true, index: true },
    module: { type: String, required: true },
    ipAddress: { type: String, required: true },
    status: { type: String, required: true, default: 'SUCCESS' },
    details: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AuditLogModel = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
export const AuditLog = AuditLogModel;
