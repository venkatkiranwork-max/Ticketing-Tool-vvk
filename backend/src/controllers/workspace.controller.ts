import type { Request, Response } from 'express';
import { workspaceService } from '../services/workspace.service.js';
import { WorkspaceModel } from '../models/Workspace.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendCreated, sendSuccess } from '../utils/apiResponse.js';
import { NotFoundError } from '../utils/AppError.js';

export const createWorkspace = asyncHandler(async (req: Request, res: Response) => {
  const workspace = await workspaceService.createWorkspace(req.body, req.user!.userId);
  return sendCreated(res, workspace, 'Workspace created successfully');
});

export const listWorkspaces = asyncHandler(async (req: Request, res: Response) => {
  const workspaces = await workspaceService.listWorkspaces(req.user!.userId);
  return sendSuccess(res, workspaces, 'Workspaces loaded');
});

export const getWorkspace = asyncHandler(async (req: Request, res: Response) => {
  const workspaceId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const currentWorkspaceId = req.user?.workspaceId;

  const query: Record<string, unknown> = { _id: workspaceId, isDeleted: false };
  if (currentWorkspaceId && currentWorkspaceId !== workspaceId) {
    query._id = currentWorkspaceId;
  }

  const workspace = await WorkspaceModel.findOne(query);
  if (!workspace) {
    throw new NotFoundError('Workspace not found');
  }

  return sendSuccess(res, workspace, 'Workspace loaded');
});

export const updateWorkspace = asyncHandler(async (req: Request, res: Response) => {
  const workspaceId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const currentWorkspaceId = req.user?.workspaceId;

  const query: Record<string, unknown> = { _id: workspaceId, isDeleted: false };
  if (currentWorkspaceId && currentWorkspaceId !== workspaceId) {
    query._id = currentWorkspaceId;
  }

  const existing = await WorkspaceModel.findOne(query);
  if (!existing) {
    throw new NotFoundError('Workspace not found');
  }

  const workspace = await workspaceService.updateWorkspace(workspaceId, req.body);
  return sendSuccess(res, workspace, 'Workspace updated');
});

export const inviteMember = asyncHandler(async (req: Request, res: Response) => {
  const workspaceId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const workspace = await workspaceService.inviteMember(workspaceId, req.body);
  return sendSuccess(res, workspace, 'Member invited');
});

export const updateMemberRole = asyncHandler(async (req: Request, res: Response) => {
  const workspaceId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
  const workspace = await workspaceService.updateMemberRole(workspaceId, userId, req.body.role);
  return sendSuccess(res, workspace, 'Member role updated');
});

export const removeMember = asyncHandler(async (req: Request, res: Response) => {
  const workspaceId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
  const workspace = await workspaceService.removeMember(workspaceId, userId);
  return sendSuccess(res, workspace, 'Member removed');
});
