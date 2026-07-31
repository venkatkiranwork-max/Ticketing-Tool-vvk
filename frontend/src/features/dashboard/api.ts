import { apiClient } from '@/api/client';
import type { ApiSuccessResponse } from '@/types/api';
import { USE_MOCK_DATA } from '@/mock/config';
import { mockUsers } from '@/mock/users';
import { mockProjects } from '@/mock/projects';
import { mockIssues } from '@/mock/issues';
import { mockActivityItems } from '@/mock/activity';

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
    const totalUsers = mockUsers.length;
    const totalProjects = mockProjects.length;
    const totalIssues = mockIssues.length;
    const completedIssues = mockIssues.filter((i) => i.status === 'done').length;
    const inProgressIssues = mockIssues.filter((i) => i.status === 'in_progress' || i.status === 'review').length;
    const todoIssues = mockIssues.filter((i) => i.status === 'todo').length;
    const backlogIssues = mockIssues.filter((i) => i.status === 'backlog').length;

    // overdue issues: active issues with dueDate before today
    const todayStr = new Date().toISOString().split('T')[0];
    const overdueIssues = mockIssues.filter(
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
    mockIssues.forEach((i) => {
      const statusLabel = i.status.replace('_', ' ').toUpperCase();
      issueDistribution[statusLabel] = (issueDistribution[statusLabel] || 0) + 1;
    });

    const priorityBreakdown: Record<string, number> = {};
    mockIssues.forEach((i) => {
      const priorityLabel = i.priority.toUpperCase();
      priorityBreakdown[priorityLabel] = (priorityBreakdown[priorityLabel] || 0) + 1;
    });

    const recentIssues = mockIssues.slice(0, 5).map((i) => ({
      _id: i._id || i.id,
      key: i.key,
      title: i.title,
      status: i.status,
      priority: i.priority,
      assigneeName: i.assignee ? `${i.assignee.firstName} ${i.assignee.lastName}` : 'Unassigned',
      assigneeAvatar: i.assignee?.avatarUrl,
      dueDate: i.dueDate,
    }));

    const upcomingDeadlines = mockIssues
      .filter((i) => i.status !== 'done' && i.dueDate)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5)
      .map((i) => ({
        _id: i._id || i.id,
        key: i.key,
        title: i.title,
        dueDate: i.dueDate,
      }));

    const recentActivity = mockActivityItems.map((act, index) => ({
      _id: act.id || `act-${index}`,
      action: act.action,
      module: act.type === 'workspace' ? 'Workspace' : act.type === 'sprint' ? 'Sprint' : 'Issues',
      userName: act.user ? `${act.user.firstName} ${act.user.lastName}` : 'System',
      details: act.target,
      createdAt: new Date().toISOString(),
    }));

    const projectStats = mockProjects.map((p) => {
      const pIssues = mockIssues.filter(
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

  const { data } = await apiClient.get<ApiSuccessResponse<DashboardSummary>>('/dashboard');
  return data.data;
}
