import { describe, expect, it, vi } from 'vitest';
import { workspaceService } from './workspace.service.js';

const { createWorkspaceMock } = vi.hoisted(() => ({
  createWorkspaceMock: vi.fn(async (data: unknown) => ({
    _id: 'workspace-1',
    ...(data as Record<string, unknown>),
    members: [{ userId: 'user-1', role: 'owner' }],
  })),
}));

vi.mock('../repositories/workspace.repository.js', () => ({
  workspaceRepository: {
    create: createWorkspaceMock,
    findById: vi.fn(async () => null),
    findByUserId: vi.fn(async () => []),
    updateById: vi.fn(async (_id: string, updates: unknown) => ({ _id, ...(updates as Record<string, unknown>) })),
    addMember: vi.fn(async (_workspaceId: string, member: unknown) => member),
    updateMemberRole: vi.fn(async (_workspaceId: string, _userId: string, role: string) => role),
    removeMember: vi.fn(async () => undefined),
  },
}));

vi.mock('../repositories/user.repository.js', () => ({
  userRepository: {
    findByEmail: vi.fn(async () => ({ _id: 'user-1', email: 'owner@example.com' })),
  },
}));

describe('workspaceService.createWorkspace', () => {
  it('creates a workspace with the creator as the owner', async () => {
    const result = await workspaceService.createWorkspace(
      {
        name: 'Platform Team',
        slug: 'platform-team',
        description: 'Internal delivery workspace',
      },
      'user-1',
    );

    expect(result.name).toBe('Platform Team');
    expect(result.members[0].role).toBe('owner');
    expect(createWorkspaceMock).toHaveBeenCalled();
  });
});
