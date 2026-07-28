import type { Request, Response } from 'express';
import { reportService } from '../services/report.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getProjectReports = asyncHandler(async (req: Request, res: Response) => {
  const projectId = Array.isArray(req.params.projectId) ? req.params.projectId[0] : req.params.projectId;
  const workspaceId = req.user?.workspaceId;
  const summary = await reportService.getProjectSummary(String(projectId || 'all'), workspaceId);
  return sendSuccess(res, summary, 'Project report generated');
});
