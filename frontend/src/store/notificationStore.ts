import { create } from 'zustand';
import type { Notification } from '@/features/notifications/api';

type NewNotificationInput = Omit<Notification, '_id' | 'isRead' | 'createdAt' | 'updatedAt'> & {
  _id?: string;
  isRead?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type NotificationState = {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  setUnreadCount: (count: number) => void;
  addNotification: (notification: NewNotificationInput) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
};

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) => set({ notifications }),
  setUnreadCount: (unreadCount) => set({ unreadCount }),
  addNotification: (input) => {
    const fullNotification: Notification = {
      _id: input._id || `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
      relatedEntityId: input.relatedEntityId,
      relatedEntityType: input.relatedEntityType,
      isRead: input.isRead ?? false,
      createdAt: input.createdAt || new Date().toISOString(),
      updatedAt: input.updatedAt || new Date().toISOString(),
    };

    set((state) => ({
      notifications: [fullNotification, ...state.notifications],
      unreadCount: fullNotification.isRead ? state.unreadCount : state.unreadCount + 1,
    }));
  },
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n._id !== id),
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
}));
