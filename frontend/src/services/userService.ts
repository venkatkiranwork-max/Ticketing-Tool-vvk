import { apiClient } from '@/api/client';
import { USE_MOCK_DATA } from '@/mock/config';
import { mockUsers, saveUsersToStorage } from '@/mock/users';
import type { MockUser, WorkspaceRole } from '@/mock/users';
import type { User } from '@/types/api';

export const userService = {
  async getUsers(): Promise<MockUser[]> {
    if (USE_MOCK_DATA) {
      return [...mockUsers];
    }
    try {
      const res = (await apiClient.get('/users')) as any;
      const items = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      // Fall back to mock data if API returns empty (backend not running)
      return items.length > 0 ? items : [...mockUsers];
    } catch {
      return [...mockUsers];
    }
  },

  async getUserById(id: string): Promise<User> {
    if (USE_MOCK_DATA) {
      const found = mockUsers.find((u) => u.id === id);
      return (found || mockUsers[0]) as unknown as User;
    }
    const res = (await apiClient.get(`/users/${id}`)) as { data?: User } & User;
    return res.data || res;
  },

  async updateProfile(id: string, updates: Partial<User>): Promise<User> {
    if (USE_MOCK_DATA) {
      const found = mockUsers.find((u) => u.id === id);
      if (found) {
        if (updates.avatarUrl) found.avatarUrl = updates.avatarUrl;
        if (updates.phone) found.phone = updates.phone;
        saveUsersToStorage(mockUsers);
      }
      return (found || mockUsers[0]) as unknown as User;
    }
    const res = (await apiClient.patch(`/users/${id}/profile`, updates)) as { data?: User } & User;
    return res.data || res;
  },

  async inviteUser(data: { email: string; role: string; team: string; project?: string }): Promise<MockUser> {
    if (USE_MOCK_DATA) {
      const newUser: MockUser = {
        id: `usr-${Date.now()}`,
        employeeId: `EMP-${1000 + mockUsers.length + 1}`,
        firstName: data.email.split('@')[0],
        lastName: 'User',
        email: data.email,
        role: data.role as WorkspaceRole,
        team: data.team,
        status: 'Active',
        avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
        department: data.team,
        lastLogin: 'Never',
        createdDate: 'Today',
        online: true,
        activeProjectsCount: 1,
        completedTasksCount: 0,
      };
      mockUsers.unshift(newUser);
      saveUsersToStorage(mockUsers);
      return newUser;
    }
    const res = (await apiClient.post('/users/invite', data)) as { data?: MockUser } & MockUser;
    return res.data || res;
  },

  async createUserDirect(data: Partial<MockUser>): Promise<MockUser> {
    if (USE_MOCK_DATA) {
      const newUser: MockUser = {
        id: `usr-${Date.now()}`,
        employeeId: data.employeeId || `EMP-${1000 + mockUsers.length + 1}`,
        firstName: data.firstName || 'New',
        lastName: data.lastName || 'User',
        email: data.email || 'user@abctech.io',
        role: data.role || 'Member',
        team: data.team || 'Engineering',
        status: 'Active',
        avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
        department: data.department || 'Engineering',
        lastLogin: 'Never',
        createdDate: 'Today',
        online: true,
        activeProjectsCount: 1,
        completedTasksCount: 0,
      };
      mockUsers.unshift(newUser);
      saveUsersToStorage(mockUsers);
      return newUser;
    }
    const res = (await apiClient.post('/users/direct', data)) as { data?: MockUser } & MockUser;
    return res.data || res;
  },

  async toggleUserStatus(id: string): Promise<MockUser> {
    if (USE_MOCK_DATA) {
      const user = mockUsers.find((u) => u.id === id || (u as any)._id === id);
      if (user) {
        user.status = user.status === 'Active' ? 'Inactive' : 'Active';
        saveUsersToStorage(mockUsers);
      }
      return user || mockUsers[0];
    }
    const res = (await apiClient.patch(`/users/${id}/status`)) as { data?: MockUser } & MockUser;
    return res.data || res;
  },

  async adminUpdateUser(id: string, updates: Partial<MockUser> & { password?: string }): Promise<MockUser> {
    if (USE_MOCK_DATA) {
      const user = mockUsers.find((u) => u.id === id || (u as any)._id === id);
      if (user) {
        Object.assign(user, updates);
        saveUsersToStorage(mockUsers);
      }
      return user || mockUsers[0];
    }
    const res = (await apiClient.patch(`/users/${id}/update`, updates)) as { data?: MockUser } & MockUser;
    return res.data || res;
  },
};
