import { mockUsers, type MockUser } from './users';

export interface MockComment {
  id: string;
  issueId: string;
  user: MockUser;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export const mockComments: Record<string, MockComment[]> = {
  'iss-101': [
    {
      id: 'cmt-1',
      issueId: 'iss-101',
      user: mockUsers[4], // David Kim
      content: 'Configured Redis Sentinel primary-replica topology with automatic quorum elections.',
      createdAt: '2026-07-22T10:15:00.000Z',
    },
    {
      id: 'cmt-2',
      issueId: 'iss-101',
      user: mockUsers[0], // Alex Rivera
      content: 'Great progress. Please ensure connection pool retries are set to exponential backoff.',
      createdAt: '2026-07-22T11:00:00.000Z',
    },
  ],
  'iss-102': [
    {
      id: 'cmt-3',
      issueId: 'iss-102',
      user: mockUsers[3], // Elena Rostova
      content: 'Updated Tailwind CSS color variables to HSL format for seamless MUI theme sync.',
      createdAt: '2026-07-22T14:20:00.000Z',
    },
  ],
};
