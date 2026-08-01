import type { Request, Response } from 'express';
import { User } from '../models/User.model.js';
import { Project } from '../models/Project.model.js';
import { Issue } from '../models/Issue.model.js';
import { AuditLog } from '../models/AuditLog.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getDashboardSummary = asyncHandler(async (_req: Request, res: Response) => {
  const [
    totalUsers,
    totalProjects,
    totalIssues,
    completedIssues,
    overdueIssues,
    inProgressIssues,
    issueDistribution,
    priorityBreakdown,
    recentIssues,
    upcomingDeadlines,
    recentActivity,
    allProjects,
  ] = await Promise.all([
    User.countDocuments({ isDeleted: false }),
    Project.countDocuments({ isDeleted: false }),
    Issue.countDocuments({ isDeleted: false }),
    Issue.countDocuments({ isDeleted: false, status: 'done' }),
    Issue.countDocuments({
      isDeleted: false,
      status: { $ne: 'done' },
      dueDate: { $lt: new Date() },
    }),
    Issue.countDocuments({ isDeleted: false, status: 'in_progress' }),
    Issue.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]),
    Issue.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]),
    Issue.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(6)
      .select('key title status priority assigneeName assigneeAvatar dueDate'),
    Issue.find({ isDeleted: false, status: { $ne: 'done' }, dueDate: { $gte: new Date() } })
      .sort({ dueDate: 1 })
      .limit(5)
      .select('key title dueDate'),
    AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(8),
    Project.find({ isDeleted: false })
      .select('name members status')
  ]);

  const completionRate = totalIssues ? Math.round((completedIssues / totalIssues) * 100) : 0;

  // Process project progress
  const projectStats = await Promise.all(
    allProjects.map(async (project) => {
      const projectTotalIssues = await Issue.countDocuments({ isDeleted: false, projectId: project._id });
      const projectCompletedIssues = await Issue.countDocuments({ isDeleted: false, projectId: project._id, status: 'done' });
      return {
        _id: project._id,
        name: project.name,
        membersCount: project.members.length,
        members: project.members.slice(0, 3).map(m => ({ userName: m.userName })), // Just return top 3 for UI
        totalIssues: projectTotalIssues,
        completedIssues: projectCompletedIssues,
        progress: projectTotalIssues ? Math.round((projectCompletedIssues / projectTotalIssues) * 100) : 0,
      };
    })
  );

  return sendSuccess(
    res,
    {
      stats: {
        totalUsers,
        totalProjects,
        totalIssues,
        completedIssues,
        overdueIssues,
        inProgressIssues,
        completionRate,
      },
      sprintProgress: {
        total: totalIssues,
        completed: completedIssues,
        inProgress: inProgressIssues,
        todo: totalIssues - completedIssues - inProgressIssues, // Simplification
      },
      issueDistribution: issueDistribution.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      priorityBreakdown: priorityBreakdown.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      recentIssues,
      upcomingDeadlines,
      recentActivity,
      projectStats,
    },
    'Dashboard summary loaded'
  );
});
