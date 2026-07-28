import { notificationRepository } from '../repositories/notification.repository.js';
import { NotFoundError } from '../utils/AppError.js';

export const notificationService = {
  async createNotification(input: {
    userId: string;
    type: 'issue_assigned' | 'issue_updated' | 'comment_added' | 'workspace_invite' | 'project_updated';
    title: string;
    message: string;
    relatedEntityId?: string;
    relatedEntityType?: 'issue' | 'project' | 'workspace';
  }) {
    return notificationRepository.create(input);
  },

  async getUserNotifications(userId: string) {
    return notificationRepository.findByUserId(userId);
  },

  async getUnreadCount(userId: string) {
    return notificationRepository.findUnreadCountByUserId(userId);
  },

  async markNotificationAsRead(id: string) {
    const notification = await notificationRepository.markAsRead(id);
    if (!notification) {
      throw new NotFoundError('Notification not found');
    }
    return notification;
  },

  async markAllAsRead(userId: string) {
    await notificationRepository.markAllAsReadByUserId(userId);
    return { marked: true };
  },

  async deleteNotification(id: string) {
    const deleted = await notificationRepository.deleteById(id);
    if (!deleted) {
      throw new NotFoundError('Notification not found');
    }
    return { deleted: true };
  },
};
