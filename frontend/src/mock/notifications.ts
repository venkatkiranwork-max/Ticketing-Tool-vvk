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

export const mockNotifications: MockNotification[] = [
  {
    _id: 'notif-1',
    id: 'notif-1',
    type: 'issue_assigned',
    title: 'New issue assigned to you',
    message: 'David Kim assigned ENG-101 "Migrate Session Store from Memory to Distributed Redis Sentinel" to you.',
    sender: mockUsers[4], // David Kim
    targetKey: 'ENG-101',
    isRead: false,
    createdAt: '2026-07-22T21:45:00.000Z',
    timeAgo: '15 mins ago',
  },
  {
    _id: 'notif-2',
    id: 'notif-2',
    type: 'comment_added',
    title: 'New comment on ENG-102',
    message: 'Elena Rostova: "I updated the WCAG AAA color token contrast ratios in the pull request."',
    sender: mockUsers[3], // Elena Rostova
    targetKey: 'ENG-102',
    isRead: false,
    createdAt: '2026-07-22T20:30:00.000Z',
    timeAgo: '1 hour ago',
  },
  {
    _id: 'notif-3',
    id: 'notif-3',
    type: 'sprint_started',
    title: 'Sprint 24 Planning Started',
    message: 'Sarah Chen launched Sprint 24 (Q3 Platform) with 32 committed issues and 140 story points.',
    sender: mockUsers[1], // Sarah Chen
    targetKey: 'Sprint-24',
    isRead: false,
    createdAt: '2026-07-22T18:15:00.000Z',
    timeAgo: '3 hours ago',
  },
  {
    _id: 'notif-4',
    id: 'notif-4',
    type: 'issue_completed',
    title: 'Issue marked as Done',
    message: 'Tariq Al-Mansoor completed ENG-104 "Audit Web Application Vulnerabilities & Fix CORS Security Headers".',
    sender: mockUsers[10], // Tariq
    targetKey: 'ENG-104',
    isRead: false,
    createdAt: '2026-07-22T16:00:00.000Z',
    timeAgo: '5 hours ago',
  },
  {
    _id: 'notif-5',
    id: 'notif-5',
    type: 'workspace_invite',
    title: 'Workspace membership updated',
    message: 'Alex Rivera added you to the "Core Platform Engineering" workspace with Admin privileges.',
    sender: mockUsers[0], // Alex
    targetKey: 'ws-1',
    isRead: false,
    createdAt: '2026-07-22T12:00:00.000Z',
    timeAgo: '9 hours ago',
  },
  {
    _id: 'notif-6',
    id: 'notif-6',
    type: 'comment_added',
    title: 'Mentioned in ENG-108',
    message: 'Marcus Vance: "@alex.rivera can you review the DataGrid pagination props API design?"',
    sender: mockUsers[2], // Marcus
    targetKey: 'ENG-108',
    isRead: true,
    createdAt: '2026-07-21T19:40:00.000Z',
    timeAgo: 'Yesterday',
  },
  {
    _id: 'notif-7',
    id: 'notif-7',
    type: 'issue_updated',
    title: 'Priority changed to Critical',
    message: 'Amara Okafor updated priority on ENG-106 "Train Anomaly Classifier Model" to Critical.',
    sender: mockUsers[7], // Amara
    targetKey: 'ENG-106',
    isRead: true,
    createdAt: '2026-07-21T16:20:00.000Z',
    timeAgo: 'Yesterday',
  },
  {
    _id: 'notif-8',
    id: 'notif-8',
    type: 'project_updated',
    title: 'Project Roadmap Milestone',
    message: 'Design System V3 reached 85% completion across active sprint targets.',
    sender: mockUsers[3], // Elena
    targetKey: 'prj-2',
    isRead: true,
    createdAt: '2026-07-21T14:10:00.000Z',
    timeAgo: 'Yesterday',
  },
  {
    _id: 'notif-9',
    id: 'notif-9',
    type: 'project_archived',
    title: 'Legacy REST v1 API Archived',
    message: 'Legacy REST v1 project has been officially archived after full GraphQL gateway deployment.',
    sender: mockUsers[1], // Sarah
    targetKey: 'prj-legacy',
    isRead: true,
    createdAt: '2026-07-20T17:00:00.000Z',
    timeAgo: '2 days ago',
  },
  {
    _id: 'notif-10',
    id: 'notif-10',
    type: 'issue_assigned',
    title: 'New issue assigned to you',
    message: 'James Wilson assigned ENG-115 "Prometheus Alertmanager Rule Definitions" to you.',
    sender: mockUsers[6], // James
    targetKey: 'ENG-115',
    isRead: true,
    createdAt: '2026-07-20T11:30:00.000Z',
    timeAgo: '2 days ago',
  },
  {
    _id: 'notif-11',
    id: 'notif-11',
    type: 'issue_completed',
    title: 'Issue marked as Done',
    message: 'Zoe Kovacs completed ENG-110 "Optimize Recharts Rendering on Heavy Dashboard Datasets".',
    sender: mockUsers[11], // Zoe
    targetKey: 'ENG-110',
    isRead: true,
    createdAt: '2026-07-19T18:00:00.000Z',
    timeAgo: '3 days ago',
  },
  {
    _id: 'notif-12',
    id: 'notif-12',
    type: 'comment_added',
    title: 'New comment on ENG-121',
    message: 'Alex Rivera: "Okta SAML 2.0 metadata XML generation test suites passed with zero errors."',
    sender: mockUsers[0], // Alex
    targetKey: 'ENG-121',
    isRead: true,
    createdAt: '2026-07-19T15:20:00.000Z',
    timeAgo: '3 days ago',
  },
  {
    _id: 'notif-13',
    id: 'notif-13',
    type: 'issue_updated',
    title: 'Status moved to In Review',
    message: 'Sofia Martinez requested code review on ENG-119 "Mobile Push Notifications Payload Encryption".',
    sender: mockUsers[9], // Sofia
    targetKey: 'ENG-119',
    isRead: true,
    createdAt: '2026-07-19T10:00:00.000Z',
    timeAgo: '3 days ago',
  },
  {
    _id: 'notif-14',
    id: 'notif-14',
    type: 'workspace_invite',
    title: 'Workspace added',
    message: 'You were added to the "Mobile Ecosystem" workspace.',
    sender: mockUsers[9], // Sofia
    targetKey: 'ws-3',
    isRead: true,
    createdAt: '2026-07-18T16:00:00.000Z',
    timeAgo: '4 days ago',
  },
  {
    _id: 'notif-15',
    id: 'notif-15',
    type: 'sprint_started',
    title: 'Sprint 18 Started',
    message: 'Design System V3 Sprint 18 was launched.',
    sender: mockUsers[3], // Elena
    targetKey: 'Sprint-18',
    isRead: true,
    createdAt: '2026-07-18T09:00:00.000Z',
    timeAgo: '4 days ago',
  },
  {
    _id: 'notif-16',
    id: 'notif-16',
    type: 'issue_completed',
    title: 'Issue marked as Done',
    message: 'Elena Rostova completed ENG-122 "Refactor Tailwind Utility Typography Styles".',
    sender: mockUsers[3], // Elena
    targetKey: 'ENG-122',
    isRead: true,
    createdAt: '2026-07-17T17:30:00.000Z',
    timeAgo: '5 days ago',
  },
  {
    _id: 'notif-17',
    id: 'notif-17',
    type: 'comment_added',
    title: 'New comment on ENG-106',
    message: 'Amara Okafor attached precision-recall evaluation matrix graphs.',
    sender: mockUsers[7], // Amara
    targetKey: 'ENG-106',
    isRead: true,
    createdAt: '2026-07-17T11:00:00.000Z',
    timeAgo: '5 days ago',
  },
  {
    _id: 'notif-18',
    id: 'notif-18',
    type: 'issue_assigned',
    title: 'New issue assigned to you',
    message: 'Chloe Dupont assigned ENG-124 "Automated Playwright E2E Test Suite" to you.',
    sender: mockUsers[5], // Chloe
    targetKey: 'ENG-124',
    isRead: true,
    createdAt: '2026-07-16T14:15:00.000Z',
    timeAgo: '6 days ago',
  },
  {
    _id: 'notif-19',
    id: 'notif-19',
    type: 'project_updated',
    title: 'Project Settings Updated',
    message: 'Workspace admins enabled GitHub pull request auto-linking integration.',
    sender: mockUsers[1], // Sarah
    targetKey: 'prj-1',
    isRead: true,
    createdAt: '2026-07-15T18:00:00.000Z',
    timeAgo: '1 week ago',
  },
  {
    _id: 'notif-20',
    id: 'notif-20',
    type: 'issue_completed',
    title: 'Issue marked as Done',
    message: 'Zoe Kovacs completed ENG-129 "Web Analytics Dashboard Core Web Vitals".',
    sender: mockUsers[11], // Zoe
    targetKey: 'ENG-129',
    isRead: true,
    createdAt: '2026-07-15T10:00:00.000Z',
    timeAgo: '1 week ago',
  },
];
