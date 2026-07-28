import { mockUsers, type MockUser } from './users';

export interface ProjectMember {
  user: MockUser;
  projectRole: 'Project Admin' | 'Lead Developer' | 'Developer' | 'QA Tester' | 'Viewer';
}

export interface MockProject {
  _id: string;
  id: string;
  name: string;
  slug: string;
  description: string;
  team: string;
  workspaceId?: string;
  sprint: string;
  progress: number;
  completionRate: number;
  openIssuesCount: number;
  completedIssueCount: number;
  issueCount: number;
  members: ProjectMember[];
  status: 'active' | 'planning' | 'paused' | 'completed';
  lastUpdated: string;
}

export const mockProjects: MockProject[] = [
  {
    _id: 'prj-1',
    id: 'prj-1',
    name: 'Enterprise Platform Core',
    slug: 'enterprise-platform-core',
    description: 'Next-generation ticket management platform, real-time board updates, and RBAC governance engine.',
    team: 'Engineering',
    sprint: 'Sprint 24',
    progress: 85,
    completionRate: 85,
    openIssuesCount: 4,
    completedIssueCount: 20,
    issueCount: 24,
    members: [
      { user: mockUsers[0], projectRole: 'Project Admin' },
      { user: mockUsers[1], projectRole: 'Lead Developer' },
      { user: mockUsers[2], projectRole: 'Developer' },
    ],
    status: 'active',
    lastUpdated: '10 mins ago',
  },
];
