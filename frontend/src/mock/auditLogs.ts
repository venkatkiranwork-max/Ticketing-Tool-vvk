export interface MockAuditLog {
  id: string;
  timestamp: string;
  user: string;
  userName: string;
  role: string;
  userRole: string;
  action: string;
  module: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  details: string;
}

export type AuditLogEntry = MockAuditLog;

export const mockAuditLogs: MockAuditLog[] = [
  {
    id: 'log-101',
    timestamp: '2026-07-22 17:42:10',
    user: 'Alex Rivera',
    userName: 'Alex Rivera',
    role: 'Super Admin',
    userRole: 'Super Admin',
    action: 'CREATE_USER_DIRECT',
    module: 'User Management',
    ipAddress: '192.168.1.104',
    status: 'SUCCESS',
    details: 'Directly created employee account for marcus.vance@abctech.io',
  },
  {
    id: 'log-102',
    timestamp: '2026-07-22 16:15:33',
    user: 'Sarah Chen',
    userName: 'Sarah Chen',
    role: 'Admin',
    userRole: 'Admin',
    action: 'INVITE_USER',
    module: 'User Management',
    ipAddress: '192.168.1.112',
    status: 'SUCCESS',
    details: 'Sent workspace invitation email to elena.rostova@abctech.io',
  },
  {
    id: 'log-103',
    timestamp: '2026-07-22 14:02:00',
    user: 'Marcus Vance',
    userName: 'Marcus Vance',
    role: 'Project Manager',
    userRole: 'Project Manager',
    action: 'ARCHIVE_PROJECT',
    module: 'Projects Directory',
    ipAddress: '192.168.1.150',
    status: 'SUCCESS',
    details: 'Archived project HR Portal (prj-4)',
  },
];
