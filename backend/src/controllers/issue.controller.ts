import type { Request, Response } from 'express';
import { issueService } from '../services/issue.service.js';
import { IssueModel } from '../models/Issue.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendCreated, sendSuccess } from '../utils/apiResponse.js';
import { NotFoundError } from '../utils/AppError.js';

export const createIssue = asyncHandler(async (req: Request, res: Response) => {
  const workspaceId = req.body.workspaceId || req.user?.workspaceId;
  const issue = await issueService.createIssue({
    ...req.body,
    workspaceId,
    reporterId: req.body.reporterId || req.user?.userId,
  });
  return sendCreated(res, issue, 'Issue created successfully');
});

export const listIssues = asyncHandler(async (req: Request, res: Response) => {
  const projectId = Array.isArray(req.params.projectId)
    ? req.params.projectId[0]
    : req.params.projectId || (req.query.projectId as string);
  const workspaceId = req.user?.workspaceId || (req.query.workspaceId as string);

  const filter: Record<string, unknown> = { isDeleted: false };
  if (projectId) {
    filter.projectId = projectId;
  }
  if (workspaceId) {
    filter.workspaceId = workspaceId;
  }

  const issues = await IssueModel.find(filter).sort({ createdAt: -1 }).exec();
  return sendSuccess(res, issues, 'Issues loaded');
});

export const getIssue = asyncHandler(async (req: Request, res: Response) => {
  const issueId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const workspaceId = req.user?.workspaceId;

  // Workspace-scoping check: match _id and workspaceId (if user has workspaceId)
  const query: Record<string, unknown> = { _id: issueId, isDeleted: false };
  if (workspaceId) {
    query.workspaceId = workspaceId;
  }

  const issue = await IssueModel.findOne(query);
  if (!issue) {
    throw new NotFoundError('Issue not found');
  }

  return sendSuccess(res, issue, 'Issue loaded');
});

export const updateIssue = asyncHandler(async (req: Request, res: Response) => {
  const issueId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const workspaceId = req.user?.workspaceId;

  const query: Record<string, unknown> = { _id: issueId, isDeleted: false };
  if (workspaceId) {
    query.workspaceId = workspaceId;
  }

  const existing = await IssueModel.findOne(query);
  if (!existing) {
    throw new NotFoundError('Issue not found');
  }

  const issue = await issueService.updateIssue(issueId, req.body);
  return sendSuccess(res, issue, 'Issue updated');
});

export const deleteIssue = asyncHandler(async (req: Request, res: Response) => {
  const issueId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const workspaceId = req.user?.workspaceId;

  const query: Record<string, unknown> = { _id: issueId, isDeleted: false };
  if (workspaceId) {
    query.workspaceId = workspaceId;
  }

  const existing = await IssueModel.findOne(query);
  if (!existing) {
    throw new NotFoundError('Issue not found');
  }

  const result = await issueService.deleteIssue(issueId);
  return sendSuccess(res, result, 'Issue deleted');
});
