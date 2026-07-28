import { mockIssues } from './issues';

export interface DashboardSummary {
  totalIssues: number;
  openIssues: number;
  completedIssues: number;
  overdueIssues: number;
  totalIssuesChange: string;
  openIssuesChange: string;
  completedIssuesChange: string;
  overdueIssuesChange: string;
}

export const mockDashboardSummary: DashboardSummary = {
  totalIssues: 148,
  openIssues: 54,
  completedIssues: 82,
  overdueIssues: 12,
  totalIssuesChange: '+12% from last sprint',
  openIssuesChange: '-8% from last week',
  completedIssuesChange: '+24% overall progress',
  overdueIssuesChange: '-4% resolved today',
};

export const mockStatusDistribution = [
  { name: 'Backlog', value: 24, color: '#94a3b8' },
  { name: 'To Do', value: 30, color: '#3b82f6' },
  { name: 'In Progress', value: 42, color: '#f59e0b' },
  { name: 'In Review', value: 18, color: '#8b5cf6' },
  { name: 'Done', value: 82, color: '#10b981' },
];

export const mockPriorityDistribution = [
  { name: 'Critical', value: 14, color: '#ef4444' },
  { name: 'High', value: 38, color: '#f97316' },
  { name: 'Medium', value: 64, color: '#eab308' },
  { name: 'Low', value: 32, color: '#06b6d4' },
];

export const mockIssuesByProject = [
  { project: 'Auth SSO', completed: 25, open: 7, total: 32 },
  { project: 'Design System', completed: 34, open: 6, total: 40 },
  { project: 'GraphQL API', completed: 16, open: 10, total: 26 },
  { project: 'iOS Application', completed: 19, open: 16, total: 35 },
  { project: 'Telemetry AI', completed: 18, open: 2, total: 20 },
  { project: 'K8s Autoscaling', completed: 10, open: 14, total: 24 },
];

export const mockWeeklyProgress = [
  { week: 'Wk 27', created: 18, completed: 14, inProgress: 22 },
  { week: 'Wk 28', created: 24, completed: 20, inProgress: 26 },
  { week: 'Wk 29', created: 20, completed: 28, inProgress: 18 },
  { week: 'Wk 30', created: 32, completed: 35, inProgress: 24 },
  { week: 'Wk 31', created: 28, completed: 42, inProgress: 20 },
  { week: 'Wk 32', created: 15, completed: 38, inProgress: 16 },
];

export const mockAssignedToMe = mockIssues.slice(0, 5);

export const mockUpcomingDeadlines = mockIssues
  .filter((iss) => iss.status !== 'done')
  .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
  .slice(0, 5);
