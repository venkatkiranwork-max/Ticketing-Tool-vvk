import { mockUsers, type MockUser } from './users';

export interface MockWorkspace {
  _id: string;
  id: string;
  name: string;
  slug: string;
  description: string;
  owner: MockUser;
  members: MockUser[];
  activeProjects: number;
  totalIssues: number;
  completedIssues: number;
  progress: number;
  createdAt: string;
  updatedAt: string;
  color: string;
  logo: string;
}

export const mockWorkspaces: MockWorkspace[] = [
  {
    _id: 'ws-1',
    id: 'ws-1',
    name: 'Core Platform Engineering',
    slug: 'core-platform',
    description: 'Central cloud services, API gateways, database clusters, and system security infrastructure.',
    owner: mockUsers[0], // Alex Rivera
    members: [mockUsers[0], mockUsers[1], mockUsers[4], mockUsers[6], mockUsers[10], mockUsers[13]],
    activeProjects: 6,
    totalIssues: 148,
    completedIssues: 104,
    progress: 70,
    createdAt: '2025-01-10T08:00:00.000Z',
    updatedAt: '2026-07-20T14:30:00.000Z',
    color: '#6366f1',
    logo: '⚡',
  },
  {
    _id: 'ws-2',
    id: 'ws-2',
    name: 'Product & Design Systems',
    slug: 'product-design',
    description: 'Design system components, UI pattern library, design tokens, and user experience research.',
    owner: mockUsers[3], // Elena Rostova
    members: [mockUsers[3], mockUsers[2], mockUsers[15], mockUsers[1]],
    activeProjects: 4,
    totalIssues: 92,
    completedIssues: 75,
    progress: 81,
    createdAt: '2025-02-14T09:15:00.000Z',
    updatedAt: '2026-07-21T11:45:00.000Z',
    color: '#ec4899',
    logo: '🎨',
  },
  {
    _id: 'ws-3',
    id: 'ws-3',
    name: 'Mobile Ecosystem',
    slug: 'mobile-ecosystem',
    description: 'iOS and Android client applications, mobile SDKs, push notifications, and offline sync.',
    owner: mockUsers[9], // Sofia Martinez
    members: [mockUsers[9], mockUsers[2], mockUsers[5], mockUsers[17]],
    activeProjects: 3,
    totalIssues: 84,
    completedIssues: 52,
    progress: 62,
    createdAt: '2025-03-01T10:00:00.000Z',
    updatedAt: '2026-07-19T16:20:00.000Z',
    color: '#10b981',
    logo: '📱',
  },
  {
    _id: 'ws-4',
    id: 'ws-4',
    name: 'Data Analytics & AI',
    slug: 'data-ai',
    description: 'Machine learning pipelines, real-time analytics dashboards, event streaming, and telemetry.',
    owner: mockUsers[7], // Amara Okafor
    members: [mockUsers[7], mockUsers[4], mockUsers[14], mockUsers[19]],
    activeProjects: 5,
    totalIssues: 110,
    completedIssues: 68,
    progress: 61,
    createdAt: '2025-04-18T14:00:00.000Z',
    updatedAt: '2026-07-22T09:10:00.000Z',
    color: '#8b5cf6',
    logo: '🧠',
  },
];
