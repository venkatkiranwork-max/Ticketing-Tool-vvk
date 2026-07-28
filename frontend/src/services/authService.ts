import { apiClient } from '@/api/client';
import { USE_MOCK_DATA } from '@/mock/config';
import { mockUsers } from '@/mock/users';
import type { MockUser } from '@/mock/users';

export interface LoginCredentials {
  email: string;
  passwordHash?: string;
  password?: string;
}

export interface AuthResponse {
  user: MockUser;
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (USE_MOCK_DATA) {
      const user = mockUsers.find((u) => u.email.toLowerCase() === credentials.email.toLowerCase()) || mockUsers[0];
      return {
        user,
        accessToken: 'mock-access-token-jwt',
        refreshToken: 'mock-refresh-token-jwt',
      };
    }
    const res = (await apiClient.post('/auth/login', credentials)) as { data?: AuthResponse } & AuthResponse;
    return res.data || res;
  },

  async getCurrentUser(): Promise<MockUser> {
    if (USE_MOCK_DATA) {
      return mockUsers[0];
    }
    const res = (await apiClient.get('/auth/me')) as { data?: MockUser } & MockUser;
    return res.data || res;
  },

  async logout(): Promise<void> {
    if (USE_MOCK_DATA) {
      return;
    }
    await apiClient.post('/auth/logout');
  },
};
