import { mockUsers, type MockUser } from './users';

export type IssueType = 'task' | 'bug' | 'story' | 'improvement';
export type IssueStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
export type IssuePriority = 'critical' | 'high' | 'medium' | 'low';

export interface IssueChecklistItem {
  id: string;
  text: string;
  isCompleted: boolean;
}

export interface IssueCommentItem {
  id: string;
  user: MockUser;
  text: string;
  createdAt: string;
  updatedAt?: string;
}

export interface IssueAttachmentItem {
  id: string;
  name: string;
  size: number;
  fileType: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface IssueActivityEntry {
  id: string;
  timestamp: string;
  timeAgo: string;
  actor: MockUser;
  action: string;
  details: string;
}

export interface MockIssue {
  _id: string;
  id: string;
  key: string;
  title: string;
  description: string;
  type: IssueType;
  status: IssueStatus;
  priority: IssuePriority;
  assignee: MockUser;
  reporter?: MockUser;
  projectId: string;
  projectName: string;
  workspaceId: string;
  sprint: string;
  dueDate: string;
  labels: string[];
  storyPoints: number;
  checklist?: IssueChecklistItem[];
  comments?: IssueCommentItem[];
  attachments?: IssueAttachmentItem[];
  history?: IssueActivityEntry[];
  createdAt: string;
  updatedAt: string;
}

export const mockIssues: MockIssue[] = [
  {
    _id: 'iss-1',
    id: 'iss-1',
    key: 'ENG-101',
    title: 'Migrate Session Store from Memory to Distributed Redis Sentinel Cluster',
    description: 'Refactor session middleware to use Redis Sentinel with failover support and TLS encryption.',
    type: 'task',
    status: 'in_progress',
    priority: 'critical',
    assignee: mockUsers[0], // Alex Rivera
    reporter: mockUsers[1], // Sarah Chen
    projectId: 'prj-1',
    projectName: 'Authentication Service',
    workspaceId: 'ws-1',
    sprint: 'Sprint 24 (Q3 Platform)',
    dueDate: '2026-07-28',
    labels: ['Backend', 'Security', 'Infra'],
    storyPoints: 8,
    checklist: [
      { id: 'ck-1', text: 'Set up Redis Sentinel Docker compose', isCompleted: true },
      { id: 'ck-2', text: 'Write failover connection logic with retry', isCompleted: true },
      { id: 'ck-3', text: 'Run integration test suite under simulated cluster failover', isCompleted: false },
      { id: 'ck-4', text: 'Update system architecture diagrams', isCompleted: false },
    ],
    comments: [
      {
        id: 'c-1',
        user: mockUsers[0],
        text: 'I updated the Redis Sentinel configuration file with failover node IP addresses.',
        createdAt: '2026-07-22T14:00:00Z',
      },
      {
        id: 'c-2',
        user: mockUsers[4],
        text: 'Tested integration unit tests on local docker compose environment cleanly.',
        createdAt: '2026-07-22T15:30:00Z',
      },
    ],
    attachments: [
      {
        id: 'att-1',
        name: 'redis-cluster-architecture.pdf',
        size: 1048576,
        fileType: 'application/pdf',
        url: '#',
        uploadedBy: 'Alex Rivera',
        uploadedAt: '2026-07-21T10:00:00Z',
      },
    ],
    history: [
      { id: 'h-1', timestamp: '2026-07-20T09:10:00Z', timeAgo: '2 days ago', actor: mockUsers[1], action: 'ISSUE_CREATED', details: 'Created issue ENG-101' },
      { id: 'h-2', timestamp: '2026-07-20T10:30:00Z', timeAgo: '2 days ago', actor: mockUsers[1], action: 'USER_ASSIGNED', details: 'Assigned to Alex Rivera' },
      { id: 'h-3', timestamp: '2026-07-21T11:15:00Z', timeAgo: 'Yesterday', actor: mockUsers[0], action: 'STATUS_CHANGED', details: 'Moved to In Progress' },
    ],
    createdAt: '2026-07-20T09:10:00.000Z',
    updatedAt: '2026-07-22T14:30:00.000Z',
  },
  {
    _id: 'iss-2',
    id: 'iss-2',
    key: 'ENG-102',
    title: 'Fix High-Contrast Color Token Ratios in Dark Mode Theme',
    description: 'Ensure all MUI components pass WCAG AAA color contrast ratios (7:1 for body text).',
    type: 'bug',
    status: 'review',
    priority: 'high',
    assignee: mockUsers[3], // Elena Rostova
    reporter: mockUsers[0], // Alex Rivera
    projectId: 'prj-2',
    projectName: 'CRM Portal',
    workspaceId: 'ws-1',
    sprint: 'Sprint 18',
    dueDate: '2026-07-25',
    labels: ['UI/UX', 'Accessibility'],
    storyPoints: 5,
    checklist: [
      { id: 'ck-5', text: 'Audit text contrast across all dark mode cards', isCompleted: true },
      { id: 'ck-6', text: 'Fix button hover states in high contrast mode', isCompleted: true },
    ],
    comments: [
      {
        id: 'c-3',
        user: mockUsers[3],
        text: 'Adjusted primary and secondary text tokens to match WCAG AAA specifications.',
        createdAt: '2026-07-22T16:15:00Z',
      },
    ],
    attachments: [],
    history: [
      { id: 'h-4', timestamp: '2026-07-21T08:00:00Z', timeAgo: 'Yesterday', actor: mockUsers[3], action: 'ISSUE_CREATED', details: 'Created issue ENG-102' },
      { id: 'h-5', timestamp: '2026-07-22T16:00:00Z', timeAgo: '6 hours ago', actor: mockUsers[3], action: 'STATUS_CHANGED', details: 'Moved to In Review' },
    ],
    createdAt: '2026-07-21T08:00:00.000Z',
    updatedAt: '2026-07-22T16:00:00.000Z',
  },
  {
    _id: 'iss-3',
    id: 'iss-3',
    key: 'ENG-103',
    title: 'Warehouse Allocation Auto-Reorder Algorithm Optimization',
    description: 'Implement vectorized stock calculation to reduce inventory calculation time under 50ms.',
    type: 'improvement',
    status: 'in_progress',
    priority: 'medium',
    assignee: mockUsers[4], // David Kim
    reporter: mockUsers[2], // Marcus Vance
    projectId: 'prj-3',
    projectName: 'Inventory System',
    workspaceId: 'ws-1',
    sprint: 'Sprint 24 (Q3 Platform)',
    dueDate: '2026-07-30',
    labels: ['Algorithm', 'Performance'],
    storyPoints: 13,
    checklist: [
      { id: 'ck-7', text: 'Benchmark baseline query execution time', isCompleted: true },
      { id: 'ck-8', text: 'Vectorize stock calculation query', isCompleted: false },
    ],
    comments: [],
    attachments: [],
    history: [
      { id: 'h-6', timestamp: '2026-07-19T10:00:00Z', timeAgo: '3 days ago', actor: mockUsers[2], action: 'ISSUE_CREATED', details: 'Created issue ENG-103' },
      { id: 'h-7', timestamp: '2026-07-20T09:00:00Z', timeAgo: '2 days ago', actor: mockUsers[4], action: 'STATUS_CHANGED', details: 'Moved to In Progress' },
    ],
    createdAt: '2026-07-19T10:00:00.000Z',
    updatedAt: '2026-07-22T11:00:00.000Z',
  },
  {
    _id: 'iss-4',
    id: 'iss-4',
    key: 'ENG-104',
    title: 'Audit Web Application Vulnerabilities & Fix CORS Security Headers',
    description: 'Enforce strict Content-Security-Policy headers and disable unapproved cross-origin requests.',
    type: 'story',
    status: 'done',
    priority: 'critical',
    assignee: mockUsers[4], // David Kim
    reporter: mockUsers[0],
    projectId: 'prj-1',
    projectName: 'Authentication Service',
    workspaceId: 'ws-1',
    sprint: 'Sprint 24 (Q3 Platform)',
    dueDate: '2026-07-22',
    labels: ['Security', 'Audit'],
    storyPoints: 3,
    checklist: [
      { id: 'ck-9', text: 'Run OWASP ZAP security scanner', isCompleted: true },
      { id: 'ck-10', text: 'Configure strict CORS origin headers', isCompleted: true },
    ],
    comments: [],
    attachments: [],
    history: [
      { id: 'h-8', timestamp: '2026-07-18T09:00:00Z', timeAgo: '4 days ago', actor: mockUsers[0], action: 'ISSUE_CREATED', details: 'Created issue ENG-104' },
      { id: 'h-9', timestamp: '2026-07-22T17:30:00Z', timeAgo: '5 hours ago', actor: mockUsers[4], action: 'STATUS_CHANGED', details: 'Marked as Done' },
    ],
    createdAt: '2026-07-18T09:00:00.000Z',
    updatedAt: '2026-07-22T17:30:00.000Z',
  },
  {
    _id: 'iss-5',
    id: 'iss-5',
    key: 'ENG-105',
    title: 'Employee Onboarding Approval Workflow Email Triggers',
    description: 'Configure SendGrid email webhooks for HR manager approval requests and onboarding checklists.',
    type: 'task',
    status: 'todo',
    priority: 'low',
    assignee: mockUsers[4], // David Kim
    reporter: mockUsers[3],
    projectId: 'prj-4',
    projectName: 'HR Portal',
    workspaceId: 'ws-1',
    sprint: 'Sprint 12',
    dueDate: '2026-08-05',
    labels: ['HR', 'Workflow'],
    storyPoints: 5,
    checklist: [],
    comments: [],
    attachments: [],
    history: [
      { id: 'h-10', timestamp: '2026-07-22T14:00:00Z', timeAgo: '8 hours ago', actor: mockUsers[3], action: 'ISSUE_CREATED', details: 'Created issue ENG-105' },
    ],
    createdAt: '2026-07-22T14:00:00.000Z',
    updatedAt: '2026-07-22T14:00:00.000Z',
  },
  {
    _id: 'iss-6',
    id: 'iss-6',
    key: 'ENG-106',
    title: 'PCI-DSS Payment Webhooks Stripe Retry Mechanism',
    description: 'Implement exponential backoff retry loop for Stripe billing webhooks with dead-letter queueing.',
    type: 'story',
    status: 'in_progress',
    priority: 'high',
    assignee: mockUsers[6], // James Wilson
    reporter: mockUsers[6],
    projectId: 'prj-5',
    projectName: 'Payment Gateway',
    workspaceId: 'ws-1',
    sprint: 'Sprint 15',
    dueDate: '2026-07-27',
    labels: ['Payments', 'Stripe'],
    storyPoints: 8,
    checklist: [],
    comments: [],
    attachments: [],
    history: [
      { id: 'h-11', timestamp: '2026-07-21T11:00:00Z', timeAgo: 'Yesterday', actor: mockUsers[6], action: 'ISSUE_CREATED', details: 'Created issue ENG-106' },
      { id: 'h-12', timestamp: '2026-07-22T10:00:00Z', timeAgo: '12 hours ago', actor: mockUsers[6], action: 'STATUS_CHANGED', details: 'Moved to In Progress' },
    ],
    createdAt: '2026-07-21T11:00:00.000Z',
    updatedAt: '2026-07-22T10:00:00.000Z',
  },
];
