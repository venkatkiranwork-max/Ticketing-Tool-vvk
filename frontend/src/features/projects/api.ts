import { apiClient } from '@/api/client';
import type { ApiSuccessResponse } from '@/types/api';

export type Project = {
  _id: string;
  workspaceId: string;
  name: string;
  slug: string;
  description?: string;
  ownerId: string;
  members: Array<{ userId: string; role: string; joinedAt?: string }>;
  isArchived?: boolean;
  createdAt?: string;
};

export async function fetchProjects(workspaceId: string): Promise<Project[]> {
  const { data } = await apiClient.get<ApiSuccessResponse<Project[]>>(`/projects/workspace/${workspaceId}`);
  return data.data;
}

export async function createProjectRequest(input: { workspaceId: string; name: string; slug: string; description?: string }) {
  const { data } = await apiClient.post<ApiSuccessResponse<Project>>('/projects', input);
  return data.data;
}

export async function updateProjectRequest(id: string, input: Partial<Project>) {
  const { data } = await apiClient.patch<ApiSuccessResponse<Project>>(`/projects/${id}`, input);
  return data.data;
}

export async function deleteProjectRequest(id: string): Promise<void> {
  await apiClient.delete(`/projects/${id}`);
}
