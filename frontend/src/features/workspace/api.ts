import { apiClient } from '@/api/client';
import type { ApiSuccessResponse } from '@/types/api';

export type Workspace = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  ownerId: string;
  members: Array<{ userId: string; role: string; joinedAt?: string }>;
  isArchived?: boolean;
  createdAt?: string;
};

export async function fetchWorkspaces(): Promise<Workspace[]> {
  const { data } = await apiClient.get<ApiSuccessResponse<Workspace[]>>('/workspaces');
  return data.data;
}

export async function createWorkspaceRequest(input: { name: string; slug: string; description?: string }) {
  const { data } = await apiClient.post<ApiSuccessResponse<Workspace>>('/workspaces', input);
  return data.data;
}

export async function updateWorkspaceRequest(id: string, input: Partial<Workspace>) {
  const { data } = await apiClient.patch<ApiSuccessResponse<Workspace>>(`/workspaces/${id}`, input);
  return data.data;
}
