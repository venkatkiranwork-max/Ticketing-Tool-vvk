export interface MockTeam {
  id: string;
  name: string;
  description: string;
  teamLeadId: string;
  teamLeadName: string;
  teamLeadAvatar: string;
  memberCount: number;
  projectCount: number;
  openIssuesCount: number;
  velocity: number;
  currentSprint: string;
  color: string;
  createdAt: string;
}

export const mockTeams: MockTeam[] = [
  {
    id: 'team-1',
    name: 'IT',
    description: 'IT infrastructure, server management, distributed cloud, and corporate network security.',
    teamLeadId: 'usr-1',
    teamLeadName: 'Suresh Kumar',
    teamLeadAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    memberCount: 8,
    projectCount: 4,
    openIssuesCount: 18,
    velocity: 42,
    currentSprint: 'Sprint 24 (Q3 Platform)',
    color: '#6366f1',
    createdAt: '2025-01-15T08:00:00.000Z',
  },
  {
    id: 'team-2',
    name: 'UI/UX',
    description: 'Design system primitives, accessibility token guidelines, user interface research, and Figma tokens.',
    teamLeadId: 'usr-2',
    teamLeadName: 'Ravi Sharma',
    teamLeadAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    memberCount: 5,
    projectCount: 2,
    openIssuesCount: 12,
    velocity: 35,
    currentSprint: 'Sprint 18',
    color: '#ec4899',
    createdAt: '2025-02-20T11:30:00.000Z',
  },
  {
    id: 'team-3',
    name: 'Testing',
    description: 'End-to-end integration testing, manual QA suites, performance regression, and Playwright automation.',
    teamLeadId: 'usr-3',
    teamLeadName: 'Mani Verma',
    teamLeadAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    memberCount: 4,
    projectCount: 3,
    openIssuesCount: 9,
    velocity: 28,
    currentSprint: 'Sprint 18',
    color: '#10b981',
    createdAt: '2025-02-10T10:00:00.000Z',
  },
];
