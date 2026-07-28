import { apiClient } from '@/api/client';
import type { ApiSuccessResponse } from '@/types/api';

export type Issue = {
  _id: string;
  projectId: string;
  workspaceId: string;
  title: string;
  description?: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  labels: string[];
  assigneeId?: string;
  reporterId: string;
  dueDate?: string;
  attachments: string[];
  comments?: Array<{ userId: string; text: string; createdAt: string }>;
  activity?: Array<{ text: string; createdAt: string }>;
  createdAt?: string;
};

export async function fetchIssues(projectId: string): Promise<Issue[]> {
  const { data } = await apiClient.get<ApiSuccessResponse<Issue[]>>(`/issues/project/${projectId}`);
  return data.data;
}

export async function createIssueRequest(input: Partial<Issue>) {
  const { data } = await apiClient.post<ApiSuccessResponse<Issue>>('/issues', input);
  return data.data;
}

export async function updateIssueRequest(id: string, input: Partial<Issue>) {
  const { data } = await apiClient.patch<ApiSuccessResponse<Issue>>(`/issues/${id}`, input);
  return data.data;
}

export async function deleteIssueRequest(id: string): Promise<void> {
  await apiClient.delete(`/issues/${id}`);
}
