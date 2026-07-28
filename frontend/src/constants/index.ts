export const APP_NAME = 'TicketFlow';
export const APP_TAGLINE = 'Ship work with clarity';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  WORKSPACES: '/workspaces',
  PROJECTS: '/projects',
  TEAMS: '/teams',
  USERS: '/users',
  BOARD: '/board',
  ISSUES: '/issues',
  KANBAN: '/kanban',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  ADMINISTRATION: '/administration',
} as const;

export const QUERY_KEYS = {
  HEALTH: ['health'] as const,
  ME: ['auth', 'me'] as const,
} as const;
