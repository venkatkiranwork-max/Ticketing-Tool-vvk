import { describe, expect, it, vi } from 'vitest';
import { authService } from './auth.service.js';

vi.mock('../repositories/user.repository.js', () => ({
  userRepository: {
    findByEmail: vi.fn(async () => null),
    create: vi.fn(async (data) => ({
      _id: 'user-1',
      ...data,
      role: 'member',
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    })),
    save: vi.fn(async (user) => user),
    countDocuments: vi.fn(async () => 1),
    findById: vi.fn(async () => null),
  },
}));

vi.mock('../repositories/refreshToken.repository.js', () => ({
  refreshTokenRepository: {
    create: vi.fn(async () => ({ _id: 'token-1' })),
    findValidByHash: vi.fn(async () => null),
    revokeByHash: vi.fn(async () => undefined),
    revokeAllForUser: vi.fn(async () => undefined),
  },
}));

describe('authService.register', () => {
  it('creates a user with a default member role when no admin exists', async () => {
    const result = await authService.register({
      email: 'new.user@example.com',
      password: 'Password123',
      firstName: 'New',
      lastName: 'User',
    });

    expect(result.accessToken).toBeTruthy();
    expect(result.refreshToken).toBeTruthy();
    expect(result.user.email).toBe('new.user@example.com');
  });
});
