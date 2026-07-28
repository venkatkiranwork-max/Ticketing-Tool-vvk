import { apiClient } from '@/api/client';
import { USE_MOCK_DATA } from '@/mock/config';
import { mockAuditLogs, type MockAuditLog } from '@/mock/auditLogs';

export const auditService = {
  async getAuditLogs(): Promise<MockAuditLog[]> {
    if (USE_MOCK_DATA) {
      return [...mockAuditLogs];
    }
    const res = (await apiClient.get('/audit-logs')) as { data?: MockAuditLog[] } & MockAuditLog[];
    return res.data || res;
  },
};
