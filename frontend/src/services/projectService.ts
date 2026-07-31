import { apiClient } from '@/api/client';
import { USE_MOCK_DATA } from '@/mock/config';
import { mockProjects, saveProjectsToStorage } from '@/mock/projects';
import type { MockProject } from '@/mock/projects';

export const projectService = {
  async getProjects(): Promise<MockProject[]> {
    if (USE_MOCK_DATA) {
      return [...mockProjects];
    }
    const res = (await apiClient.get('/projects')) as any;
    const items = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
    return items;
  },

  async createProject(data: Partial<MockProject>): Promise<MockProject> {
    if (USE_MOCK_DATA) {
      const newProj: MockProject = {
        _id: `prj-${Date.now()}`,
        id: `prj-${Date.now()}`,
        name: data.name || 'New Project',
        slug: (data.name || 'new').toLowerCase().replace(/\s+/g, '-'),
        description: data.description || '',
        team: data.team || 'Engineering',
        sprint: 'Sprint 1',
        progress: 0,
        completionRate: 0,
        openIssuesCount: 0,
        completedIssueCount: 0,
        issueCount: 0,
        members: [],
        status: 'active',
        lastUpdated: 'Just now',
      };
      mockProjects.unshift(newProj);
      saveProjectsToStorage(mockProjects);
      return newProj;
    }
    const res = (await apiClient.post('/projects', data)) as { data?: MockProject } & MockProject;
    return res.data || res;
  },

  async archiveProject(id: string): Promise<MockProject> {
    if (USE_MOCK_DATA) {
      const p = mockProjects.find((proj) => proj.id === id || proj._id === id);
      if (p) {
        p.status = 'completed';
        saveProjectsToStorage(mockProjects);
      }
      return p || mockProjects[0];
    }
    const res = (await apiClient.patch(`/projects/${id}/archive`)) as { data?: MockProject } & MockProject;
    return res.data || res;
  },

  async updateProject(id: string, updates: Partial<MockProject>): Promise<MockProject> {
    if (USE_MOCK_DATA) {
      const p = mockProjects.find((proj) => proj.id === id || proj._id === id);
      if (p) {
        Object.assign(p, updates);
        saveProjectsToStorage(mockProjects);
      }
      return p || mockProjects[0];
    }
    const res = (await apiClient.patch(`/projects/${id}`, updates)) as { data?: MockProject } & MockProject;
    return res.data || res;
  },
};
