import { mockIssues, type MockIssue } from './issues';

export interface BoardColumn {
  id: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
  title: string;
  color: string;
  badgeBg: string;
  issues: MockIssue[];
}

export const getMockBoardColumns = (): BoardColumn[] => [
  {
    id: 'backlog',
    title: 'Backlog',
    color: '#94a3b8',
    badgeBg: 'rgba(148, 163, 184, 0.15)',
    issues: mockIssues.filter((i) => i.status === 'backlog'),
  },
  {
    id: 'todo',
    title: 'To Do',
    color: '#3b82f6',
    badgeBg: 'rgba(59, 130, 246, 0.15)',
    issues: mockIssues.filter((i) => i.status === 'todo'),
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    color: '#f59e0b',
    badgeBg: 'rgba(245, 158, 11, 0.15)',
    issues: mockIssues.filter((i) => i.status === 'in_progress'),
  },
  {
    id: 'review',
    title: 'In Review',
    color: '#8b5cf6',
    badgeBg: 'rgba(139, 92, 246, 0.15)',
    issues: mockIssues.filter((i) => i.status === 'review'),
  },
  {
    id: 'done',
    title: 'Done',
    color: '#10b981',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
    issues: mockIssues.filter((i) => i.status === 'done'),
  },
];
