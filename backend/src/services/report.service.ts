import mongoose from 'mongoose';
import { IssueModel } from '../models/Issue.model.js';

export type ReportSummary = {
  statusBreakdown: Record<'backlog' | 'todo' | 'in_progress' | 'review' | 'done', number>;
  priorityBreakdown: Record<'low' | 'medium' | 'high' | 'critical', number>;
  statusDistribution: { name: string; value: number; color: string }[];
  priorityDistribution: { name: string; value: number; color: string }[];
  weeklyProgress: { week: string; created: number; completed: number }[];
  completionRate: number;
  totalIssues: number;
};

export const reportService = {
  async getProjectSummary(projectId: string, workspaceId?: string): Promise<ReportSummary> {
    const match: Record<string, unknown> = { isDeleted: false };
    if (projectId && projectId !== 'all' && mongoose.Types.ObjectId.isValid(projectId)) {
      match.projectId = new mongoose.Types.ObjectId(projectId);
    } else if (workspaceId && mongoose.Types.ObjectId.isValid(workspaceId)) {
      match.workspaceId = new mongoose.Types.ObjectId(workspaceId);
    }

    // 1. Status distribution aggregation
    const statusAgg = await IssueModel.aggregate([
      { $match: match },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // 2. Priority distribution aggregation
    const priorityAgg = await IssueModel.aggregate([
      { $match: match },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    // 3. Weekly progress trend aggregation
    const weeklyAgg = await IssueModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            year: { $isoWeekYear: '$createdAt' },
            week: { $isoWeek: '$createdAt' },
          },
          created: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'done'] }, 1, 0] },
          },
        },
      },
      { $sort: { '_id.year': 1, '_id.week': 1 } },
      { $limit: 8 },
    ]);

    // Format status distribution
    const statusMap: Record<'backlog' | 'todo' | 'in_progress' | 'review' | 'done', number> = {
      backlog: 0,
      todo: 0,
      in_progress: 0,
      review: 0,
      done: 0,
    };
    statusAgg.forEach((item) => {
      if (item._id && statusMap[item._id as keyof typeof statusMap] !== undefined) {
        statusMap[item._id as keyof typeof statusMap] = item.count;
      }
    });

    const statusDistribution = [
      { name: 'Backlog', value: statusMap.backlog, color: '#64748b' },
      { name: 'To Do', value: statusMap.todo, color: '#3b82f6' },
      { name: 'In Progress', value: statusMap.in_progress, color: '#f59e0b' },
      { name: 'In Review', value: statusMap.review, color: '#8b5cf6' },
      { name: 'Done', value: statusMap.done, color: '#10b981' },
    ];

    // Format priority distribution
    const priorityMap: Record<'low' | 'medium' | 'high' | 'critical', number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };
    priorityAgg.forEach((item) => {
      if (item._id && priorityMap[item._id as keyof typeof priorityMap] !== undefined) {
        priorityMap[item._id as keyof typeof priorityMap] = item.count;
      }
    });

    const priorityDistribution = [
      { name: 'Critical', value: priorityMap.critical, color: '#ef4444' },
      { name: 'High', value: priorityMap.high, color: '#f97316' },
      { name: 'Medium', value: priorityMap.medium, color: '#ca8a04' },
      { name: 'Low', value: priorityMap.low, color: '#0891b2' },
    ];

    // Format weekly progress
    const weeklyProgress = weeklyAgg.map((item) => ({
      week: `W${item._id.week}`,
      created: item.created,
      completed: item.completed,
    }));

    if (weeklyProgress.length === 0) {
      weeklyProgress.push(
        { week: 'W1', created: 0, completed: 0 },
        { week: 'W2', created: 0, completed: 0 },
        { week: 'W3', created: 0, completed: 0 },
        { week: 'W4', created: 0, completed: 0 }
      );
    }

    const totalIssues = Object.values(statusMap).reduce((a, b) => a + b, 0);
    const completionRate = totalIssues > 0 ? Number(((statusMap.done / totalIssues) * 100).toFixed(1)) : 0;

    return {
      statusBreakdown: statusMap,
      priorityBreakdown: priorityMap,
      statusDistribution,
      priorityDistribution,
      weeklyProgress,
      totalIssues,
      completionRate,
    };
  },
};
