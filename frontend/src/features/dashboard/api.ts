import { apiClient } from '@/api/client';
import type { ApiSuccessResponse } from '@/types/api';

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
  const { data } = await apiClient.get<ApiSuccessResponse<DashboardSummary>>('/dashboard');
  return data.data;
}
