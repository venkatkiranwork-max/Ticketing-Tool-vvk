import { apiClient } from '@/api/client';
import type { User } from '@/types/api';
import { USE_MOCK_DATA } from '@/mock/config';
import { mockUsers } from '@/mock/users';

export type AuthPayload = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

type ApiResponsePayload = {
  data?: Record<string, unknown>;
  user?: User;
  accessToken?: string;
  refreshToken?: string;
};

export async function registerRequest(body: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<AuthPayload> {
  if (USE_MOCK_DATA) {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      role: 'Member',
      status: 'Active',
    };
    return {
      user: newUser,
      accessToken: 'mock-access-token-jwt',
      refreshToken: 'mock-refresh-token-jwt',
    };
  }

  const res = (await apiClient.post('/auth/register', body)) as unknown as ApiResponsePayload;
  const payload = (res?.data || res) as Record<string, unknown>;
  return {
    user: (payload.user || payload) as unknown as User,
    accessToken: (payload.accessToken as string) || 'access-token-jwt',
    refreshToken: (payload.refreshToken as string) || 'refresh-token-jwt',
  };
}

export async function loginRequest(body: {
  email: string;
  password: string;
}): Promise<AuthPayload> {
  if (USE_MOCK_DATA) {
    const matchedUser = mockUsers.find((u) => u.email.toLowerCase() === body.email.toLowerCase());
    if (!matchedUser) {
      throw new Error('Invalid email or password');
    }
    const passwordNorm = body.password.trim();
    if (passwordNorm !== 'Password123!' && passwordNorm !== 'PASSWORD123!' && passwordNorm !== 'password123!' && passwordNorm !== 'Temp@1234') {
      throw new Error('Invalid email or password');
    }
    return {
      user: matchedUser as unknown as User,
      accessToken: 'mock-access-token-jwt',
      refreshToken: 'mock-refresh-token-jwt',
    };
  }

  const res = (await apiClient.post('/auth/login', body)) as unknown as ApiResponsePayload;
  const payload = (res?.data || res) as Record<string, unknown>;
  return {
    user: (payload.user || payload) as unknown as User,
    accessToken: (payload.accessToken as string) || 'access-token-jwt',
    refreshToken: (payload.refreshToken as string) || 'refresh-token-jwt',
  };
}

export async function refreshRequest(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  if (USE_MOCK_DATA) {
    return {
      accessToken: 'mock-access-token-jwt',
      refreshToken: 'mock-refresh-token-jwt',
    };
  }

  const res = (await apiClient.post('/auth/refresh', { refreshToken })) as unknown as ApiResponsePayload;
  const payload = (res?.data || res) as Record<string, unknown>;
  return {
    accessToken: (payload.accessToken as string) || 'access-token-jwt',
    refreshToken: (payload.refreshToken as string) || 'refresh-token-jwt',
  };
}

export async function logoutRequest(refreshToken: string): Promise<void> {
  if (!USE_MOCK_DATA) {
    await apiClient.post('/auth/logout', { refreshToken });
  }
}

export async function fetchMe(): Promise<User> {
  if (USE_MOCK_DATA) {
    return mockUsers[0] as unknown as User;
  }
  const res = (await apiClient.get('/auth/me')) as unknown as ApiResponsePayload;
  const payload = (res?.data || res) as Record<string, unknown>;
  return (payload.user || payload) as unknown as User;
}

export async function forgotPasswordRequest(email: string): Promise<void> {
  if (!USE_MOCK_DATA) {
    await apiClient.post('/auth/forgot-password', { email });
  }
}

export async function resetPasswordRequest(token: string, password: string): Promise<void> {
  if (!USE_MOCK_DATA) {
    await apiClient.post('/auth/reset-password', { token, password });
  }
}
