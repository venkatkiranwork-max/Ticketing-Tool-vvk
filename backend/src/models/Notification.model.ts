import mongoose, { Schema, type Document, type Model, type Types } from 'mongoose';

export type NotificationDocument = Document & {
  userId: Types.ObjectId | string;
  type: 'issue_assigned' | 'issue_updated' | 'comment_added' | 'workspace_invite' | 'project_updated';
  title: string;
  message: string;
  relatedEntityId?: Types.ObjectId | string;
  relatedEntityType?: 'issue' | 'project' | 'workspace';
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const notificationSchema = new Schema<NotificationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: ['issue_assigned', 'issue_updated', 'comment_added', 'workspace_invite', 'project_updated'],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    relatedEntityId: { type: Schema.Types.ObjectId },
    relatedEntityType: { type: String, enum: ['issue', 'project', 'workspace'] },
    isRead: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

export const Notification: Model<NotificationDocument> =
  mongoose.models.Notification ?? mongoose.model<NotificationDocument>('Notification', notificationSchema);
