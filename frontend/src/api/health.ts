import { apiClient } from './client';
import type { ApiSuccessResponse } from '@/types/api';

export type HealthData = {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
};

export async function fetchHealth(): Promise<HealthData> {
  const { data } = await apiClient.get<ApiSuccessResponse<HealthData>>('/health');
  return data.data;
}
