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

export function hasScreenAccess(user: UserLike | null | undefined, screenKey: ScreenKey): boolean {
  if (!user) return false;
  
  const normalizedRole = user.role === 'super_admin' ? 'Super Admin' : user.role;
  
  if (normalizedRole === 'Super Admin' && user.screens?.[screenKey] !== false) {
    return true;
  }

  if (screenKey === 'administration') {
    return normalizedRole === 'Super Admin';
  }

  if (user.screens && user.screens[screenKey] !== undefined) {
    return !!user.screens[screenKey];
  }

  switch (normalizedRole) {
    case 'Admin':
      return (screenKey as string) !== 'administration';
    case 'Project Manager':
    case 'Team Lead':
    case 'Member':
      return !['administration', 'auditLogs'].includes(screenKey as string);
    case 'Viewer':
    case 'Guest':
      return ['dashboard', 'projects', 'issues', 'board', 'notifications', 'profile'].includes(screenKey as string);
    default:
      return screenKey === 'dashboard';
  }
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

  const normalizedRole = user.role === 'super_admin' ? 'Super Admin' : user.role;

  const candidateNavItems: NavItemDef[] = [
    { label: 'Dashboard', route: '/dashboard', screenKey: 'dashboard', iconName: 'Dashboard' },
    { label: 'Projects', route: '/projects', screenKey: 'projects', iconName: 'Projects' },
    { label: 'Issues', route: '/issues', screenKey: 'issues', iconName: 'Issues' },
    { label: 'Board', route: '/kanban', screenKey: 'board', iconName: 'Board' },
    { label: 'Teams', route: '/teams', screenKey: 'teams', iconName: 'Teams' },
    { label: 'Users', route: '/users', screenKey: 'users', iconName: 'Users' },
    { label: 'Reports', route: '/reports', screenKey: 'reports', iconName: 'Reports' },
    { label: 'Notifications', route: '/notifications', screenKey: 'notifications', iconName: 'Notifications' },
  ];

  const visibleItems = candidateNavItems.filter((item) => hasScreenAccess(user, item.screenKey));

  if (normalizedRole === 'Super Admin' && hasScreenAccess(user, 'administration')) {
    visibleItems.push({
      label: 'Administration 🔒',
      route: '/administration',
      screenKey: 'administration',
      iconName: 'Administration',
    });
  }

  if (hasScreenAccess(user, 'settings')) {
    visibleItems.push({
      label: 'Settings',
      route: '/settings',
      screenKey: 'settings',
      iconName: 'Settings',
    });
  }

  return visibleItems;
}

export function getNavigationForRole(role: string): NavItemDef[] {
  return getNavigationForUser({ role });
}
