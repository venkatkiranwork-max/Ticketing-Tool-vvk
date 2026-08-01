import { mockUsers, type MockUser } from './users';

export interface MockNotification {
  _id: string;
  id: string;
  type: 'issue_assigned' | 'issue_updated' | 'comment_added' | 'workspace_invite' | 'project_updated' | 'sprint_started' | 'project_archived' | 'issue_completed';
  title: string;
  message: string;
  sender: MockUser;
  targetKey?: string;
  isRead: boolean;
  createdAt: string;
  timeAgo: string;
}

const STORAGE_KEY = 'mock_notifications_db';

const INITIAL_MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    _id: 'notif-1',
    id: 'notif-1',
    type: 'issue_assigned',
    title: 'New issue assigned to you',
    message: 'Sarah Chen assigned ENG-101 "Migrate Session Store from Memory to Distributed Redis Sentinel Cluster" to you.',
    sender: mockUsers[1] || mockUsers[0],
    targetKey: 'ENG-101',
    isRead: false,
    createdAt: '2026-07-22T21:45:00.000Z',
    timeAgo: '15 mins ago',
  },
];

export let mockNotifications: MockNotification[] = [];

export const loadNotifications = (): MockNotification[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_MOCK_NOTIFICATIONS;
  } catch {
    return INITIAL_MOCK_NOTIFICATIONS;
  }
};

// Populate the array initially
mockNotifications.push(...loadNotifications());

export const saveNotifications = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockNotifications));
};

export const addMockNotification = (notif: Omit<MockNotification, '_id' | 'id' | 'createdAt' | 'timeAgo' | 'isRead'>) => {
  const newNotif: MockNotification = {
    ...notif,
    _id: `notif-${Date.now()}`,
    id: `notif-${Date.now()}`,
    isRead: false,
    createdAt: new Date().toISOString(),
    timeAgo: 'Just now',
  };
  mockNotifications.unshift(newNotif);
  saveNotifications();
  return newNotif;
};
