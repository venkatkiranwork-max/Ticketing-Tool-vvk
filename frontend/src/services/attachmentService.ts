import { apiClient } from '@/api/client';
import { USE_MOCK_DATA } from '@/mock/config';

export interface IssueAttachment {
  id: string;
  name: string;
  sizeBytes: number;
  fileType: string;
  uploadedAt: string;
  url: string;
}

export const attachmentService = {
  async uploadAttachment(issueId: string, file: File): Promise<IssueAttachment> {
    if (USE_MOCK_DATA) {
      return {
        id: `att-${Date.now()}`,
        name: file.name,
        sizeBytes: file.size,
        fileType: file.type || 'application/octet-stream',
        uploadedAt: new Date().toISOString(),
        url: '#',
      };
    }
    const formData = new FormData();
    formData.append('file', file);
    const res = (await apiClient.post(`/issues/${issueId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })) as { data?: IssueAttachment } & IssueAttachment;
    return res.data || res;
  },

  async deleteAttachment(issueId: string, attachmentId: string): Promise<void> {
    if (USE_MOCK_DATA) return;
    await apiClient.delete(`/issues/${issueId}/attachments/${attachmentId}`);
  },
};
