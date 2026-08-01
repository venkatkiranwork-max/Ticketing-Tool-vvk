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

const INITIAL_MOCK_PROJECTS: MockProject[] = [
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
  {
    _id: 'prj-2',
    id: 'prj-2',
    name: 'API_Dev',
    slug: 'api-dev',
    description: 'Core API development project, endpoints integration, and swagger specs.',
    team: 'Engineering',
    sprint: 'Sprint 1',
    progress: 50,
    completionRate: 50,
    openIssuesCount: 1,
    completedIssueCount: 1,
    issueCount: 2,
    members: [
      { user: mockUsers[0], projectRole: 'Project Admin' },
      { user: mockUsers[3] || mockUsers[0], projectRole: 'Developer' },
      { user: mockUsers[4] || mockUsers[0], projectRole: 'Project Admin' },
    ],
    status: 'active',
    lastUpdated: 'Just now',
  },
  {
    _id: 'prj-3',
    id: 'prj-3',
    name: 'API_Support',
    slug: 'api-support',
    description: 'API developer support, ticket resolution, and documentation updates.',
    team: 'Support',
    sprint: 'Sprint 1',
    progress: 0,
    completionRate: 0,
    openIssuesCount: 0,
    completedIssueCount: 0,
    issueCount: 0,
    members: [
      { user: mockUsers[0], projectRole: 'Project Admin' },
      { user: mockUsers[2], projectRole: 'Developer' },
    ],
    status: 'active',
    lastUpdated: 'Just now',
  },
];

const STORAGE_KEY = 'mock_projects_db';
const loadProjects = (): MockProject[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_MOCK_PROJECTS;
  } catch {
    return INITIAL_MOCK_PROJECTS;
  }
};

export const saveProjectsToStorage = (projects: MockProject[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed to save mock projects', e);
  }
};

export const mockProjects: MockProject[] = loadProjects();

