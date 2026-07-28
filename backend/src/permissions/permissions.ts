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

export function hasPermission(role: string, permission: PermissionKey): boolean {
  const userPermissions = ROLE_PERMISSIONS[role] || [];
  return userPermissions.includes(permission);
}
