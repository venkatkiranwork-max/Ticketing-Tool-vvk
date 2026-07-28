import { apiClient } from '@/api/client';
import type { ApiSuccessResponse } from '@/types/api';

export type ReportSummary = {
  statusBreakdown: Record<'backlog' | 'todo' | 'in_progress' | 'review' | 'done', number>;
  priorityBreakdown: Record<'low' | 'medium' | 'high' | 'critical', number>;
  completionRate: number;
  totalIssues: number;
};

export async function fetchProjectReport(projectId: string): Promise<ReportSummary> {
  const { data } = await apiClient.get<ApiSuccessResponse<ReportSummary>>(`/reports/projects/${projectId}`);
  return data.data;
}
