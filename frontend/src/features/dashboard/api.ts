import { apiClient } from '@/api/client';
import type { ApiSuccessResponse } from '@/types/api';
import { USE_MOCK_DATA } from '@/mock/config';
import { mockUsers, toMockUser } from '@/mock/users';
import { mockProjects } from '@/mock/projects';
import { mockIssues } from '@/mock/issues';
import { mockActivityItems } from '@/mock/activity';
import { useAuthStore } from '@/store/authStore';
import { filterProjectsForUser, filterIssuesForUser } from '@/features/auth/permissions';

export type DashboardSummary = {
  stats: {
    totalUsers: number;
    totalProjects: number;
    totalIssues: number;
    completedIssues: number;
    overdueIssues: number;
    inProgressIssues: number;
    completionRate: number;
  };
  sprintProgress: {
    total: number;
    completed: number;
    inProgress: number;
    todo: number;
  };
  issueDistribution: Record<string, number>;
  priorityBreakdown: Record<string, number>;
  recentIssues: Array<{
    _id: string;
    key: string;
    title: string;
    status: string;
    priority: string;
    assigneeName?: string;
    assigneeAvatar?: string;
    dueDate?: string;
  }>;
  upcomingDeadlines: Array<{
    _id: string;
    key: string;
    title: string;
    dueDate: string;
  }>;
  recentActivity: Array<{
    _id: string;
    action: string;
    module: string;
    userName: string;
    details: string;
    createdAt: string;
  }>;
  projectStats: Array<{
    _id: string;
    name: string;
    membersCount: number;
    members: Array<{ userName: string }>;
    totalIssues: number;
    completedIssues: number;
    progress: number;
  }>;
};

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  if (USE_MOCK_DATA) {
    const currentUser = toMockUser(useAuthStore.getState().user);
    
    // Filter projects and issues dynamically by role & assignments
    const filteredProjects = filterProjectsForUser(mockProjects, currentUser);
    const filteredIssues = filterIssuesForUser(mockIssues, currentUser);

    const totalUsers = mockUsers.length;
    const totalProjects = filteredProjects.length;
    const totalIssues = filteredIssues.length;
    const completedIssues = filteredIssues.filter((i) => i.status === 'done').length;
    const inProgressIssues = filteredIssues.filter((i) => i.status === 'in_progress' || i.status === 'review').length;
    const todoIssues = filteredIssues.filter((i) => i.status === 'todo').length;
    const backlogIssues = filteredIssues.filter((i) => i.status === 'backlog').length;

    // overdue issues: active issues with dueDate before today
    const todayStr = new Date().toISOString().split('T')[0];
    const overdueIssues = filteredIssues.filter(
      (i) => i.status !== 'done' && i.dueDate && i.dueDate < todayStr
    ).length;

    const completionRate = totalIssues ? Math.round((completedIssues / totalIssues) * 100) : 0;

    const sprintProgress = {
      total: totalIssues,
      completed: completedIssues,
      inProgress: inProgressIssues,
      todo: todoIssues + backlogIssues,
    };

    const issueDistribution: Record<string, number> = {};
    filteredIssues.forEach((i) => {
      const statusLabel = i.status.replace('_', ' ').toUpperCase();
      issueDistribution[statusLabel] = (issueDistribution[statusLabel] || 0) + 1;
    });

    const priorityBreakdown: Record<string, number> = {};
    filteredIssues.forEach((i) => {
      const priorityLabel = i.priority.toUpperCase();
      priorityBreakdown[priorityLabel] = (priorityBreakdown[priorityLabel] || 0) + 1;
    });

    const recentIssues = filteredIssues.slice(0, 5).map((i) => ({
      _id: i._id || i.id,
      key: i.key,
      title: i.title,
      status: i.status,
      priority: i.priority,
      assigneeName: i.assignee ? `${i.assignee.firstName} ${i.assignee.lastName}` : 'Unassigned',
      assigneeAvatar: i.assignee?.avatarUrl,
      dueDate: i.dueDate,
    }));

    const upcomingDeadlines = filteredIssues
      .filter((i) => i.status !== 'done' && i.dueDate)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5)
      .map((i) => ({
        _id: i._id || i.id,
        key: i.key,
        title: i.title,
        dueDate: i.dueDate,
      }));

    // Filter activities that are relevant to this user's issues/actions
    const filteredActivity = mockActivityItems.filter((act) => {
      if (currentUser.role === 'Super Admin') return true;
      if (act.user?.id === currentUser.id) return true;
      if (act.targetKey && filteredIssues.some((i) => i.key === act.targetKey)) return true;
      return false;
    });

    const recentActivity = filteredActivity.map((act, index) => ({
      _id: act.id || `act-${index}`,
      action: act.action,
      module: act.type === 'workspace' ? 'Workspace' : act.type === 'sprint' ? 'Sprint' : 'Issues',
      userName: act.user ? `${act.user.firstName} ${act.user.lastName}` : 'System',
      details: act.target,
      createdAt: new Date().toISOString(),
    }));

    const projectStats = filteredProjects.map((p) => {
      const pIssues = filteredIssues.filter(
        (i) => i.projectId === p.id || i.projectId === p._id || i.projectName === p.name
      );
      const pCompleted = pIssues.filter((i) => i.status === 'done').length;
      const progress = pIssues.length ? Math.round((pCompleted / pIssues.length) * 100) : 0;
      return {
        _id: p._id || p.id,
        name: p.name,
        membersCount: p.members?.length || 0,
        members: (p.members || []).map((m) => ({ userName: `${m.user.firstName} ${m.user.lastName}` })),
        totalIssues: pIssues.length,
        completedIssues: pCompleted,
        progress,
      };
    });

    return {
      stats: {
        totalUsers,
        totalProjects,
        totalIssues,
        completedIssues,
        overdueIssues,
        inProgressIssues,
        completionRate,
      },
      sprintProgress,
      issueDistribution,
      priorityBreakdown,
      recentIssues,
      upcomingDeadlines,
      recentActivity,
      projectStats,
    };
  }

  try {
    const response = await apiClient.get('/dashboard') as ApiSuccessResponse<DashboardSummary>;
    return response.data;
  } catch (error) {
    console.error('Failed to fetch dashboard summary from API, using local mock fallback.', error);
    return {
      stats: {
        totalUsers: mockUsers.length,
        totalProjects: mockProjects.length,
        totalIssues: mockIssues.length,
        completedIssues: mockIssues.filter((i) => i.status === 'done').length,
        overdueIssues: mockIssues.filter((i) => i.status !== 'done' && i.dueDate && i.dueDate < new Date().toISOString().split('T')[0]).length,
        inProgressIssues: mockIssues.filter((i) => i.status === 'in_progress' || i.status === 'review').length,
        completionRate: mockIssues.length ? Math.round((mockIssues.filter((i) => i.status === 'done').length / mockIssues.length) * 100) : 0,
      },
      sprintProgress: {
        total: mockIssues.length,
        completed: mockIssues.filter((i) => i.status === 'done').length,
        inProgress: mockIssues.filter((i) => i.status === 'in_progress' || i.status === 'review').length,
        todo: mockIssues.filter((i) => i.status === 'todo' || i.status === 'backlog').length,
      },
      issueDistribution: mockIssues.reduce((acc, issue) => {
        const statusLabel = issue.status.replace('_', ' ').toUpperCase();
        acc[statusLabel] = (acc[statusLabel] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      priorityBreakdown: mockIssues.reduce((acc, issue) => {
        const priorityLabel = issue.priority.toUpperCase();
        acc[priorityLabel] = (acc[priorityLabel] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      recentIssues: mockIssues.slice(0, 5).map((i) => ({
        _id: i._id || i.id,
        key: i.key,
        title: i.title,
        status: i.status,
        priority: i.priority,
        assigneeName: i.assignee ? `${i.assignee.firstName} ${i.assignee.lastName}` : 'Unassigned',
        assigneeAvatar: i.assignee?.avatarUrl,
        dueDate: i.dueDate,
      })),
      upcomingDeadlines: mockIssues
        .filter((i) => i.status !== 'done' && i.dueDate)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 5)
        .map((i) => ({
          _id: i._id || i.id,
          key: i.key,
          title: i.title,
          dueDate: i.dueDate,
        })),
      recentActivity: mockActivityItems.slice(0, 5).map((act, index) => ({
        _id: act.id || `act-${index}`,
        action: act.action,
        module: act.type === 'workspace' ? 'Workspace' : act.type === 'sprint' ? 'Sprint' : 'Issues',
        userName: act.user ? `${act.user.firstName} ${act.user.lastName}` : 'System',
        details: act.target,
        createdAt: new Date().toISOString(),
      })),
      projectStats: mockProjects.map((p) => {
        const pIssues = mockIssues.filter((i) => i.projectId === p.id || i.projectId === p._id || i.projectName === p.name);
        const pCompleted = pIssues.filter((i) => i.status === 'done').length;
        return {
          _id: p._id || p.id,
          name: p.name,
          membersCount: p.members?.length || 0,
          members: (p.members || []).map((m) => ({ userName: `${m.user.firstName} ${m.user.lastName}` })),
          totalIssues: pIssues.length,
          completedIssues: pCompleted,
          progress: pIssues.length ? Math.round((pCompleted / pIssues.length) * 100) : 0,
        };
      }),
    };
  }
}
