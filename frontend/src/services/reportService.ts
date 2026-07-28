import { apiClient } from '@/api/client';
import { USE_MOCK_DATA } from '@/mock/config';

export interface ReportSummaryData {
  statusDistribution: { name: string; value: number; color: string }[];
  priorityDistribution: { name: string; value: number; color: string }[];
  weeklyProgress: { week: string; created: number; completed: number }[];
  totalIssues: number;
  completionRate: number;
}

export const reportService = {
  async getProjectReports(projectId: string = 'all'): Promise<ReportSummaryData> {
    if (USE_MOCK_DATA) {
      return {
        statusDistribution: [
          { name: 'Backlog', value: 2, color: '#64748b' },
          { name: 'To Do', value: 5, color: '#3b82f6' },
          { name: 'In Progress', value: 4, color: '#f59e0b' },
          { name: 'In Review', value: 2, color: '#8b5cf6' },
          { name: 'Done', value: 7, color: '#10b981' },
        ],
        priorityDistribution: [
          { name: 'Critical', value: 3, color: '#ef4444' },
          { name: 'High', value: 5, color: '#f97316' },
          { name: 'Medium', value: 8, color: '#ca8a04' },
          { name: 'Low', value: 4, color: '#0891b2' },
        ],
        weeklyProgress: [
          { week: 'W1', created: 3, completed: 2 },
          { week: 'W2', created: 6, completed: 4 },
          { week: 'W3', created: 8, completed: 6 },
          { week: 'W4', created: 5, completed: 7 },
        ],
        totalIssues: 20,
        completionRate: 35,
      };
    }

    const res = (await apiClient.get(`/reports/projects/${projectId}`)) as any;
    const data = res?.data || res;
    return data;
  },
};
