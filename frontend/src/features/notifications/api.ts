import { apiClient } from '@/api/client';
import type { ApiSuccessResponse } from '@/types/api';

export type Notification = {
  _id: string;
  userId: string;
  type: 'issue_assigned' | 'issue_updated' | 'comment_added' | 'workspace_invite' | 'project_updated';
  title: string;
  message: string;
  relatedEntityId?: string;
  relatedEntityType?: 'issue' | 'project' | 'workspace';
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function fetchNotifications(): Promise<Notification[]> {
  const { data } = await apiClient.get<ApiSuccessResponse<Notification[]>>('/notifications');
  return data.data;
}

export async function fetchUnreadCount(): Promise<number> {
  const { data } = await apiClient.get<ApiSuccessResponse<{ unreadCount: number }>>('/notifications/unread/count');
  return data.data.unreadCount;
}

export async function markNotificationAsRead(id: string): Promise<Notification> {
  const { data } = await apiClient.patch<ApiSuccessResponse<Notification>>(`/notifications/${id}/read`);
  return data.data;
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await apiClient.patch('/notifications/mark-all-read');
}

export async function deleteNotification(id: string): Promise<void> {
  await apiClient.delete(`/notifications/${id}`);
}
