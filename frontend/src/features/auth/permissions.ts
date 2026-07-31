import type { MockIssue } from '@/mock/issues';
import type { MockProject } from '@/mock/projects';
import type { ScreenKey, FeaturePermissionKey } from '@/mock/users';

export type WorkspaceRole =
  | 'Super Admin'
  | 'Admin'
  | 'Project Manager'
  | 'Team Lead'
  | 'Member'
  | 'Viewer'
  | 'Guest'
  | 'super_admin'
  | 'admin'
  | 'member'
  | 'viewer';

export type ProjectRole =
  | 'Project Admin'
  | 'Lead Developer'
  | 'Developer'
  | 'QA Tester'
  | 'Viewer';

export type PermissionKey =
  | 'manage_workspace'
  | 'manage_users'
  | 'invite_users'
  | 'create_user_direct'
  | 'manage_teams'
  | 'manage_projects'
  | 'manage_sprints'
  | 'manage_project_members'
  | 'create_issues'
  | 'edit_all_issues'
  | 'edit_assigned_issues'
  | 'assign_issues'
  | 'change_issue_status'
  | 'delete_issues'
  | 'view_reports'
  | 'view_audit_logs'
  | 'comment_issues'
  | 'upload_attachments';

export const ROLE_PERMISSIONS: Record<string, PermissionKey[]> = {
  'Super Admin': [
    'manage_workspace',
    'manage_users',
    'invite_users',
    'create_user_direct',
    'manage_teams',
    'manage_projects',
    'manage_sprints',
    'manage_project_members',
    'create_issues',
    'edit_all_issues',
    'edit_assigned_issues',
    'assign_issues',
    'change_issue_status',
    'delete_issues',
    'view_reports',
    'view_audit_logs',
    'comment_issues',
    'upload_attachments',
  ],
  super_admin: [
    'manage_workspace',
    'manage_users',
    'invite_users',
    'create_user_direct',
    'manage_teams',
    'manage_projects',
    'manage_sprints',
    'manage_project_members',
    'create_issues',
    'edit_all_issues',
    'edit_assigned_issues',
    'assign_issues',
    'change_issue_status',
    'delete_issues',
    'view_reports',
    'view_audit_logs',
    'comment_issues',
    'upload_attachments',
  ],
  Admin: [
    'invite_users',
    'create_user_direct',
    'manage_teams',
    'manage_projects',
    'manage_sprints',
    'manage_project_members',
    'create_issues',
    'edit_all_issues',
    'edit_assigned_issues',
    'assign_issues',
    'change_issue_status',
    'delete_issues',
    'view_reports',
    'comment_issues',
    'upload_attachments',
  ],
  admin: [
    'invite_users',
    'create_user_direct',
    'manage_teams',
    'manage_projects',
    'manage_sprints',
    'manage_project_members',
    'create_issues',
    'edit_all_issues',
    'edit_assigned_issues',
    'assign_issues',
    'change_issue_status',
    'delete_issues',
    'view_reports',
    'comment_issues',
    'upload_attachments',
  ],
  'Project Manager': [
    'manage_projects',
    'manage_sprints',
    'manage_project_members',
    'create_issues',
    'edit_all_issues',
    'edit_assigned_issues',
    'assign_issues',
    'change_issue_status',
    'view_reports',
    'comment_issues',
    'upload_attachments',
  ],
  'Team Lead': [
    'assign_issues',
    'edit_all_issues',
    'edit_assigned_issues',
    'change_issue_status',
    'comment_issues',
    'upload_attachments',
  ],
  Member: [
    'edit_assigned_issues',
    'change_issue_status',
    'comment_issues',
    'upload_attachments',
  ],
  member: [
    'edit_assigned_issues',
    'change_issue_status',
    'comment_issues',
    'upload_attachments',
  ],
  Viewer: ['view_reports'],
  viewer: ['view_reports'],
  Guest: [],
};

export interface UserLike {
  id?: string;
  role: string;
  team?: string;
  department?: string;
  status?: string;
  screens?: Partial<Record<ScreenKey, boolean>>;
  permissions?: Partial<Record<FeaturePermissionKey, boolean>>;
}

export function hasPermission(user: UserLike | null | undefined, permission: PermissionKey): boolean {
  if (!user) return false;
  const userPermissions = ROLE_PERMISSIONS[user.role] || [];
  return userPermissions.includes(permission);
}

// Per-role default allowed screens (used when user.screens is not customized)
const ROLE_DEFAULT_SCREENS: Record<string, ScreenKey[]> = {
  'Super Admin': ['dashboard', 'projects', 'issues', 'board', 'teams', 'users', 'reports', 'auditLogs', 'administration', 'notifications', 'profile', 'settings'],
  super_admin:   ['dashboard', 'projects', 'issues', 'board', 'teams', 'users', 'reports', 'auditLogs', 'administration', 'notifications', 'profile', 'settings'],
  Admin:         ['dashboard', 'projects', 'issues', 'board', 'teams', 'users', 'reports', 'auditLogs', 'administration', 'notifications', 'profile', 'settings'],
  admin:         ['dashboard', 'projects', 'issues', 'board', 'teams', 'users', 'reports', 'auditLogs', 'administration', 'notifications', 'profile', 'settings'],
  'Project Manager': ['dashboard', 'projects', 'issues', 'board', 'teams', 'reports', 'notifications', 'profile', 'settings'],
  'Team Lead':   ['dashboard', 'projects', 'issues', 'board', 'teams', 'notifications', 'profile', 'settings'],
  Member:        ['dashboard', 'projects', 'issues', 'board', 'notifications', 'profile', 'settings'],
  member:        ['dashboard', 'projects', 'issues', 'board', 'notifications', 'profile', 'settings'],
  Viewer:        ['dashboard', 'projects', 'reports', 'notifications', 'profile'],
  viewer:        ['dashboard', 'projects', 'reports', 'notifications', 'profile'],
  Guest:         ['dashboard', 'notifications', 'profile'],
};

export function hasScreenAccess(user: UserLike | null | undefined, screenKey: ScreenKey): boolean {
  if (!user) return false;

  const normalizedRole =
    user.role === 'super_admin' ? 'Super Admin'
    : user.role === 'admin' ? 'Admin'
    : user.role === 'member' ? 'Member'
    : user.role === 'viewer' ? 'Viewer'
    : user.role;

  // Per-user custom screen overrides (set in Administration > Screen Access)
  if (user.screens && user.screens[screenKey] !== undefined) {
    return !!user.screens[screenKey];
  }

  // Fall back to role default
  const allowed = ROLE_DEFAULT_SCREENS[normalizedRole] || ['dashboard'];
  return allowed.includes(screenKey);
}

export function hasFeaturePermission(user: UserLike | null | undefined, featureKey: FeaturePermissionKey): boolean {
  if (!user) return false;
  const normalizedRole = user.role === 'super_admin' ? 'Super Admin' : user.role;
  
  if (normalizedRole === 'Super Admin') return true;

  if (user.permissions && user.permissions[featureKey] !== undefined) {
    return !!user.permissions[featureKey];
  }

  return true;
}

// Data Filtering Evaluators
export function filterProjectsForUser(projects: MockProject[], user: UserLike | null | undefined): MockProject[] {
  if (!user) return [];
  if (!Array.isArray(projects)) return [];
  const normalizedRole = user.role === 'super_admin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : user.role === 'member' ? 'Member' : user.role === 'viewer' ? 'Viewer' : user.role;

  if (normalizedRole === 'Super Admin' || normalizedRole === 'Admin' || normalizedRole === 'Viewer') {
    return projects;
  }

  const userId = user.id;

  if (normalizedRole === 'Project Manager') {
    return projects.filter((p) =>
      p.members?.some((m: any) => (m?.user?.id === userId || m?.userId === userId) && (m?.projectRole === 'Project Admin' || m?.role === 'owner')) || p.team === user.team
    );
  }

  if (normalizedRole === 'Team Lead') {
    return projects.filter((p) =>
      p.team === user.team || p.members?.some((m: any) => (m?.user?.id === userId || m?.userId === userId))
    );
  }

  if (normalizedRole === 'Member' || normalizedRole === 'Guest') {
    return projects.filter((p) =>
      p.members?.some((m: any) => (m?.user?.id === userId || m?.userId === userId))
    );
  }

  return projects;
}

export function filterIssuesForUser(issues: MockIssue[], user: UserLike | null | undefined): MockIssue[] {
  if (!user) return [];
  if (!Array.isArray(issues)) return [];
  const normalizedRole = user.role === 'super_admin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : user.role === 'member' ? 'Member' : user.role === 'viewer' ? 'Viewer' : user.role;

  if (normalizedRole === 'Super Admin' || normalizedRole === 'Admin' || normalizedRole === 'Viewer') {
    return issues;
  }

  const userId = user.id;

  if (normalizedRole === 'Project Manager') {
    return issues;
  }

  if (normalizedRole === 'Team Lead') {
    return issues.filter((i: any) => i?.assignee?.team === user.team || i?.assignee?.id === userId || i?.assigneeId === userId);
  }

  if (normalizedRole === 'Member' || normalizedRole === 'Guest') {
    return issues.filter((i: any) => i?.assignee?.id === userId || i?.assigneeId === userId);
  }

  return issues;
}

export function filterBoardCardsForUser(issues: MockIssue[], user: UserLike | null | undefined): MockIssue[] {
  return filterIssuesForUser(issues, user);
}

export interface NavItemDef {
  label: string;
  route: string;
  screenKey: ScreenKey;
  iconName: 'Dashboard' | 'Projects' | 'Board' | 'Issues' | 'Teams' | 'Users' | 'Reports' | 'AuditLogs' | 'Administration' | 'Settings' | 'Notifications';
}

export function getNavigationForUser(user: UserLike | null | undefined): NavItemDef[] {
  if (!user) return [];

  const normalizedRole =
    user.role === 'super_admin' ? 'Super Admin'
    : user.role === 'admin' ? 'Admin'
    : user.role === 'member' ? 'Member'
    : user.role === 'viewer' ? 'Viewer'
    : user.role;

  const allNavItems: (NavItemDef & { screenKey: ScreenKey })[] = [
    { label: 'Dashboard',       route: '/dashboard',      screenKey: 'dashboard',       iconName: 'Dashboard' },
    { label: 'Projects',        route: '/projects',       screenKey: 'projects',        iconName: 'Projects' },
    { label: 'Issues',          route: '/issues',         screenKey: 'issues',          iconName: 'Issues' },
    { label: 'Board',           route: '/kanban',         screenKey: 'board',           iconName: 'Board' },
    { label: 'Teams',           route: '/teams',          screenKey: 'teams',           iconName: 'Teams' },
    { label: 'Users',           route: '/users',          screenKey: 'users',           iconName: 'Users' },
    { label: 'Reports',         route: '/reports',        screenKey: 'reports',         iconName: 'Reports' },
    { label: 'Notifications',   route: '/notifications',  screenKey: 'notifications',   iconName: 'Notifications' },
    {
      label: normalizedRole === 'Super Admin' ? 'Administration 🔒' : 'Administration',
      route: '/administration',
      screenKey: 'administration',
      iconName: 'Administration',
    },
    { label: 'Settings',        route: '/settings',       screenKey: 'settings',        iconName: 'Settings' },
  ];

  return allNavItems.filter((item) => hasScreenAccess(user, item.screenKey));
}

export function getNavigationForRole(role: string): NavItemDef[] {
  return getNavigationForUser({ role });
}
