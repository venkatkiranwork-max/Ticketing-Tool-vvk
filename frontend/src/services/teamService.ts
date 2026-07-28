import { apiClient } from '@/api/client';
import { USE_MOCK_DATA } from '@/mock/config';
import { mockTeams } from '@/mock/teams';
import type { MockTeam } from '@/mock/teams';

export const teamService = {
  async getTeams(): Promise<MockTeam[]> {
    if (USE_MOCK_DATA) {
      return [...mockTeams];
    }
    const res = (await apiClient.get('/teams')) as any;
    const items = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
    return items;
  },

  async createTeam(data: Partial<MockTeam>): Promise<MockTeam> {
    if (USE_MOCK_DATA) {
      const newTeam: MockTeam = {
        id: `team-${Date.now()}`,
        name: data.name || 'New Team',
        description: data.description || 'Description',
        memberCount: 1,
        teamLeadId: 'usr-1',
        teamLeadName: 'Alex Rivera',
        teamLeadAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        projectCount: 1,
        openIssuesCount: 0,
        velocity: 30,
        currentSprint: 'Sprint 1',
        color: '#6366f1',
        createdAt: new Date().toISOString(),
      };
      mockTeams.unshift(newTeam);
      return newTeam;
    }
    const res = (await apiClient.post('/teams', data)) as { data?: MockTeam } & MockTeam;
    return res.data || res;
  },
};
