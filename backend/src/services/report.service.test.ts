import { describe, expect, it, vi } from 'vitest';

const aggregateMock = vi.hoisted(() => vi.fn());

vi.mock('../models/Issue.model.js', () => ({
  IssueModel: {
    aggregate: aggregateMock,
  },
  Issue: {
    aggregate: aggregateMock,
  },
}));

import { reportService } from './report.service.js';

describe('reportService.getProjectSummary', () => {
  it('aggregates issue statuses and priorities into a summary payload', async () => {
    aggregateMock
      .mockResolvedValueOnce([
        { _id: 'todo', count: 1 },
        { _id: 'in_progress', count: 1 },
        { _id: 'done', count: 1 },
      ])
      .mockResolvedValueOnce([
        { _id: 'high', count: 2 },
        { _id: 'medium', count: 1 },
      ])
      .mockResolvedValueOnce([
        { _id: { year: 2026, week: 30 }, created: 3, completed: 1 },
      ]);

    const result = await reportService.getProjectSummary('6a664f8afb0f23cde13c9548');

    expect(result.statusBreakdown).toEqual({
      backlog: 0,
      todo: 1,
      in_progress: 1,
      review: 0,
      done: 1,
    });
    expect(result.priorityBreakdown).toEqual({
      low: 0,
      medium: 1,
      high: 2,
      critical: 0,
    });
    expect(result.totalIssues).toBe(3);
    expect(result.completionRate).toBe(33.3);
  });
});
