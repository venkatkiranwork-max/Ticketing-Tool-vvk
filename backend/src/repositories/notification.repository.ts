import { Notification, type NotificationDocument } from '../models/Notification.model.js';

export const notificationRepository = {
  create(data: {
    userId: string;
    type: 'issue_assigned' | 'issue_updated' | 'comment_added' | 'workspace_invite' | 'project_updated';
    title: string;
    message: string;
    relatedEntityId?: string;
    relatedEntityType?: 'issue' | 'project' | 'workspace';
  }): Promise<NotificationDocument> {
    return Notification.create(data);
  },

  findByUserId(userId: string, limit = 50): Promise<NotificationDocument[]> {
    return Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  },

  findUnreadCountByUserId(userId: string): Promise<number> {
    return Notification.countDocuments({ userId, isRead: false }).exec();
  },

  markAsRead(id: string): Promise<NotificationDocument | null> {
    return Notification.findByIdAndUpdate(id, { isRead: true }, { new: true }).exec();
  },

  markAllAsReadByUserId(userId: string): Promise<void> {
    return Notification.updateMany({ userId, isRead: false }, { isRead: true }).then(() => undefined);
  },

  deleteById(id: string): Promise<NotificationDocument | null> {
    return Notification.findByIdAndDelete(id).exec();
  },
};
