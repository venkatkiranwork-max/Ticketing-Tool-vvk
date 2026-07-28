import { apiClient } from '@/api/client';
import { USE_MOCK_DATA } from '@/mock/config';
import { mockIssues, type MockIssue } from '@/mock/issues';
import { mockUsers } from '@/mock/users';

export interface CreateIssueInput {
  title: string;
  description?: string;
  type?: MockIssue['type'];
  status?: MockIssue['status'];
  priority?: MockIssue['priority'];
  assigneeId?: string;
  reporterId?: string;
  projectId: string;
  projectName?: string;
  workspaceId?: string;
  sprint?: string;
  dueDate?: string;
  labels?: string[];
  storyPoints?: number;
}

export const issueService = {
  async getIssues(): Promise<MockIssue[]> {
    if (USE_MOCK_DATA) {
      return [...mockIssues];
    }
    const res = (await apiClient.get('/issues')) as any;
    const items = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
    return items.map((item: any) => ({
      ...item,
      id: item.id || item._id,
      assignee: item.assignee || mockUsers[0],
    }));
  },

  async createIssue(data: CreateIssueInput): Promise<MockIssue> {
    if (USE_MOCK_DATA) {
      const newId = `iss-${Date.now()}`;
      const assigneeUser = mockUsers.find((u) => u.id === data.assigneeId) || mockUsers[0];
      const created: MockIssue = {
        _id: newId,
        id: newId,
        key: `ENG-${mockIssues.length + 101}`,
        title: data.title || 'Untitled',
        description: data.description || '',
        type: data.type || 'task',
        status: data.status || 'todo',
        priority: data.priority || 'medium',
        assignee: assigneeUser,
        reporter: mockUsers[0],
        projectId: data.projectId || '',
        projectName: data.projectName || 'Enterprise Platform Core',
        workspaceId: data.workspaceId || 'ws-1',
        sprint: data.sprint || 'Sprint 24',
        dueDate: data.dueDate || new Date().toISOString(),
        labels: data.labels || [],
        storyPoints: data.storyPoints || 3,
        checklist: [],
        comments: [],
        attachments: [],
        history: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockIssues.unshift(created);
      return created;
    }
    const res = (await apiClient.post('/issues', data)) as any;
    const createdItem = res?.data || res;
    return {
      ...createdItem,
      id: createdItem.id || createdItem._id,
      assignee: createdItem.assignee || mockUsers[0],
    };
  },

  async updateIssueStatus(id: string, newStatus: MockIssue['status']): Promise<MockIssue> {
    if (USE_MOCK_DATA) {
      const issue = mockIssues.find((i) => i.id === id || i._id === id);
      if (issue) issue.status = newStatus;
      return issue || mockIssues[0];
    }
    const res = (await apiClient.patch(`/issues/${id}`, { status: newStatus })) as any;
    const updated = res?.data || res;
    return {
      ...updated,
      id: updated.id || updated._id,
      assignee: updated.assignee || mockUsers[0],
    };
  },

  async deleteIssue(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      const idx = mockIssues.findIndex((i) => i.id === id || i._id === id);
      if (idx !== -1) mockIssues.splice(idx, 1);
      return;
    }
    await apiClient.delete(`/issues/${id}`);
  },
};
