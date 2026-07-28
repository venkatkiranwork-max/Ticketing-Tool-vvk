import type { Request, Response } from 'express';
import { User } from '../models/User.model.js';
import { Project } from '../models/Project.model.js';
import { Issue } from '../models/Issue.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getDashboardSummary = asyncHandler(async (_req: Request, res: Response) => {
  const [totalUsers, totalProjects, totalIssues, completedIssues, overdueIssues] = await Promise.all([
    User.countDocuments({ isDeleted: false }),
    Project.countDocuments({ isDeleted: false }),
    Issue.countDocuments({ isDeleted: false }),
    Issue.countDocuments({ isDeleted: false, status: 'done' }),
    Issue.countDocuments({
      isDeleted: false,
      status: { $ne: 'done' },
      dueDate: { $lt: new Date() },
    }),
  ]);

  const completionRate = totalIssues ? Math.round((completedIssues / totalIssues) * 100) : 0;

  return sendSuccess(
    res,
    {
      totalUsers,
      totalProjects,
      totalIssues,
      completedIssues,
      overdueIssues,
      completionRate,
    },
    'Dashboard summary loaded'
  );
});
