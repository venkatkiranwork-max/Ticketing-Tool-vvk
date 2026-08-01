import type { User } from '@/types/api';

export type WorkspaceRole =
  | 'Super Admin'
  | 'Project Manager'
  | 'Team Lead'
  | 'Member'
  | 'Viewer'
  | 'Guest';

export type UserRole = WorkspaceRole;
export type UserStatus = 'Active' | 'Inactive' | 'Suspended' | 'Locked';

export type ScreenKey =
  | 'dashboard'
  | 'projects'
  | 'issues'
  | 'board'
  | 'teams'
  | 'users'
  | 'reports'
  | 'auditLogs'
  | 'administration'
  | 'notifications'
  | 'profile'
  | 'settings';

export type FeaturePermissionKey =
  | 'project_create'
  | 'project_edit'
  | 'project_delete'
  | 'project_view'
  | 'issue_create'
  | 'issue_edit'
  | 'issue_delete'
  | 'issue_comment'
  | 'issue_attach_files'
  | 'user_create'
  | 'user_delete'
  | 'user_view';

export interface MockUser {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: WorkspaceRole;
  team: string;
  status: UserStatus;
  avatarUrl: string;
  department: string;
  phone?: string;
  location?: string;
  lastLogin: string;
  createdDate: string;
  online: boolean;
  activeProjectsCount: number;
  completedTasksCount: number;
  screens?: Partial<Record<ScreenKey, boolean>>;
  permissions?: Partial<Record<FeaturePermissionKey, boolean>>;
}

export const DEFAULT_SUPER_ADMIN_SCREENS: Record<ScreenKey, boolean> = {
  dashboard: true,
  projects: true,
  issues: true,
  board: true,
  teams: true,
  users: true,
  reports: true,
  auditLogs: true,
  administration: true,
  notifications: true,
  profile: true,
  settings: true,
};

export const DEFAULT_MEMBER_SCREENS: Record<ScreenKey, boolean> = {
  dashboard: true,
  projects: true,
  issues: true,
  board: true,
  teams: true,
  users: true,
  reports: true,
  auditLogs: false,
  administration: false,
  notifications: true,
  profile: true,
  settings: true,
};

export const DEFAULT_FEATURE_PERMISSIONS: Record<FeaturePermissionKey, boolean> = {
  project_create: true,
  project_edit: true,
  project_delete: false,
  project_view: true,
  issue_create: true,
  issue_edit: true,
  issue_delete: false,
  issue_comment: true,
  issue_attach_files: true,
  user_create: false,
  user_delete: false,
  user_view: true,
};

export function toMockUser(user: User | null | undefined): MockUser {
  if (!user) {
    return mockUsers[0];
  }
  return {
    id: user.id || user._id || 'usr-1',
    employeeId: user.employeeId || 'EMP-1001',
    firstName: user.firstName || 'Suresh',
    lastName: user.lastName || 'Kumar',
    email: user.email || 'suresh@gmail.com',
    role: (user.role as WorkspaceRole) || 'Super Admin',
    team: user.team || 'IT',
    status: (user.status as UserStatus) || 'Active',
    avatarUrl: user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: user.department || 'IT',
    phone: user.phone || '+91 98765 43210',
    location: user.location || 'Bangalore, IN',
    lastLogin: 'Today',
    createdDate: '2024-01-10',
    online: true,
    activeProjectsCount: 1,
    completedTasksCount: 45,
    screens: (user.screens as any) || DEFAULT_SUPER_ADMIN_SCREENS,
    permissions: (user.permissions as any) || DEFAULT_FEATURE_PERMISSIONS,
  };
}

export const INITIAL_MOCK_USERS: MockUser[] = [
  {
    id: 'usr-1',
    employeeId: 'EMP-1001',
    firstName: 'Suresh',
    lastName: 'Kumar',
    email: 'suresh@gmail.com',
    role: 'Super Admin',
    team: 'IT',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'IT',
    phone: '+91 98765 43210',
    location: 'Bangalore, IN',
    lastLogin: 'Today',
    createdDate: '2024-01-10',
    online: true,
    activeProjectsCount: 1,
    completedTasksCount: 142,
    screens: DEFAULT_SUPER_ADMIN_SCREENS,
    permissions: {
      ...DEFAULT_FEATURE_PERMISSIONS,
      project_delete: true,
      issue_delete: true,
      user_create: true,
      user_delete: true,
    },
  },
  {
    id: 'usr-2',
    employeeId: 'EMP-1002',
    firstName: 'Ravi',
    lastName: 'Sharma',
    email: 'ravi@gmail.com',
    role: 'Project Manager',
    team: 'UI/UX',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    department: 'UI/UX Design',
    phone: '+91 98765 43211',
    location: 'Mumbai, IN',
    lastLogin: '1 hr ago',
    createdDate: '2024-02-01',
    online: true,
    activeProjectsCount: 1,
    completedTasksCount: 98,
    screens: {
      ...DEFAULT_MEMBER_SCREENS,
      auditLogs: true,
    },
    permissions: {
      ...DEFAULT_FEATURE_PERMISSIONS,
      user_create: true,
    },
  },
  {
    id: 'usr-3',
    employeeId: 'EMP-1003',
    firstName: 'Mani',
    lastName: 'Verma',
    email: 'mani@gmail.com',
    role: 'Member',
    team: 'Testing',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Testing & QA',
    phone: '+91 98765 43212',
    location: 'Hyderabad, IN',
    lastLogin: '2 hrs ago',
    createdDate: '2024-03-15',
    online: true,
    activeProjectsCount: 1,
    completedTasksCount: 87,
    screens: DEFAULT_MEMBER_SCREENS,
    permissions: DEFAULT_FEATURE_PERMISSIONS,
  },
  {
    id: 'usr-4',
    employeeId: 'EMP-1004',
    firstName: 'v',
    lastName: 'venkatkiran',
    email: 'venkatkiran@gmail.com',
    role: 'Member',
    team: 'Engineering',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    phone: '+91 98765 43213',
    location: 'Hyderabad, IN',
    lastLogin: 'Just now',
    createdDate: '2024-04-01',
    online: true,
    activeProjectsCount: 1,
    completedTasksCount: 12,
    screens: DEFAULT_MEMBER_SCREENS,
    permissions: DEFAULT_FEATURE_PERMISSIONS,
  },
  {
    id: 'usr-5',
    employeeId: 'EMP-1005',
    firstName: 'venkatesh',
    lastName: 'aduri',
    email: 'venkatesh.aduri@gmail.com',
    role: 'Project Manager',
    team: 'Engineering',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    phone: '+91 98765 43214',
    location: 'Bangalore, IN',
    lastLogin: 'Yesterday',
    createdDate: '2024-04-05',
    online: true,
    activeProjectsCount: 2,
    completedTasksCount: 45,
    screens: DEFAULT_MEMBER_SCREENS,
    permissions: DEFAULT_FEATURE_PERMISSIONS,
  },
  {
    id: 'usr-6',
    employeeId: 'EMP-1006',
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah@gmail.com',
    role: 'Member',
    team: 'Engineering',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    phone: '+91 98765 43215',
    location: 'Bangalore, IN',
    lastLogin: '2 days ago',
    createdDate: '2024-04-10',
    online: false,
    activeProjectsCount: 1,
    completedTasksCount: 78,
    screens: DEFAULT_MEMBER_SCREENS,
    permissions: DEFAULT_FEATURE_PERMISSIONS,
  },
  {
    id: 'usr-7',
    employeeId: 'EMP-1007',
    firstName: 'David',
    lastName: 'Kim',
    email: 'david@gmail.com',
    role: 'Member',
    team: 'IT',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=150&auto=format&fit=crop&q=80',
    department: 'IT Support',
    phone: '+91 98765 43216',
    location: 'Seoul, KR',
    lastLogin: '3 days ago',
    createdDate: '2024-04-15',
    online: false,
    activeProjectsCount: 1,
    completedTasksCount: 56,
    screens: DEFAULT_MEMBER_SCREENS,
    permissions: DEFAULT_FEATURE_PERMISSIONS,
  },
  {
    id: 'usr-8',
    employeeId: 'EMP-1008',
    firstName: 'Elena',
    lastName: 'Rostova',
    email: 'elena@gmail.com',
    role: 'Member',
    team: 'UI/UX',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    department: 'UI/UX Design',
    phone: '+91 98765 43217',
    location: 'Prague, CZ',
    lastLogin: '4 days ago',
    createdDate: '2024-04-20',
    online: true,
    activeProjectsCount: 1,
    completedTasksCount: 92,
    screens: DEFAULT_MEMBER_SCREENS,
    permissions: DEFAULT_FEATURE_PERMISSIONS,
  },
  {
    id: 'usr-9',
    employeeId: 'EMP-1009',
    firstName: 'Marcus',
    lastName: 'Vance',
    email: 'marcus@gmail.com',
    role: 'Member',
    team: 'Testing',
    status: 'Active',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    department: 'Testing & QA',
    phone: '+91 98765 43218',
    location: 'Austin, US',
    lastLogin: 'Just now',
    createdDate: '2024-04-25',
    online: true,
    activeProjectsCount: 1,
    completedTasksCount: 64,
    screens: DEFAULT_MEMBER_SCREENS,
    permissions: DEFAULT_FEATURE_PERMISSIONS,
  },
];

const STORAGE_KEY = 'mock_users_db';
const loadUsers = (): MockUser[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_MOCK_USERS;
  } catch {
    return INITIAL_MOCK_USERS;
  }
};

export const saveUsersToStorage = (users: MockUser[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save mock users', e);
  }
};

export const mockUsers: MockUser[] = loadUsers();

