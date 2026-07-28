import { mockUsers, type MockUser } from './users';

export interface MockActivityItem {
  id: string;
  user: MockUser;
  action: string;
  target: string;
  targetKey?: string;
  timestamp: string;
  type: 'create' | 'assign' | 'comment' | 'close' | 'sprint' | 'workspace';
}

export const mockActivityItems: MockActivityItem[] = [
  {
    id: 'act-1',
    user: mockUsers[0], // Alex Rivera
    action: 'created issue',
    target: 'ENG-101: Migrate Session Store from Memory to Distributed Redis Sentinel',
    targetKey: 'ENG-101',
    timestamp: '15 minutes ago',
    type: 'create',
  },
  {
    id: 'act-2',
    user: mockUsers[4], // David Kim
    action: 'assigned issue',
    target: 'ENG-103: GraphQL Subscription Protocol to Marcus Vance',
    targetKey: 'ENG-103',
    timestamp: '1 hour ago',
    type: 'assign',
  },
  {
    id: 'act-3',
    user: mockUsers[3], // Elena Rostova
    action: 'added comment to',
    target: 'ENG-102: Implement Dark Mode Glassmorphism Theme Token Hierarchy',
    targetKey: 'ENG-102',
    timestamp: '2 hours ago',
    type: 'comment',
  },
  {
    id: 'act-4',
    user: mockUsers[10], // Tariq Al-Mansoor
    action: 'closed issue',
    target: 'ENG-104: Audit Web Application Vulnerabilities & Fix CORS Security Headers',
    targetKey: 'ENG-104',
    timestamp: '4 hours ago',
    type: 'close',
  },
  {
    id: 'act-5',
    user: mockUsers[1], // Sarah Chen
    action: 'started sprint',
    target: 'Sprint 24 (Q3 Platform) in Core Platform Engineering workspace',
    timestamp: '5 hours ago',
    type: 'sprint',
  },
  {
    id: 'act-6',
    user: mockUsers[7], // Amara Okafor
    action: 'created workspace',
    target: 'Data Analytics & AI',
    targetKey: 'ws-4',
    timestamp: '1 day ago',
    type: 'workspace',
  },
  {
    id: 'act-7',
    user: mockUsers[2], // Marcus Vance
    action: 'moved issue to In Review',
    target: 'ENG-108: Design Reusable DataGrid Table Component',
    targetKey: 'ENG-108',
    timestamp: '1 day ago',
    type: 'assign',
  },
  {
    id: 'act-8',
    user: mockUsers[6], // James Wilson
    action: 'closed issue',
    target: 'ENG-115: Prometheus Alertmanager Rule Definitions for High Memory Usage',
    targetKey: 'ENG-115',
    timestamp: '2 days ago',
    type: 'close',
  },
];
