import type { Request, Response } from 'express';
import { projectService } from '../services/project.service.js';
import { ProjectModel } from '../models/Project.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendCreated, sendSuccess } from '../utils/apiResponse.js';
import { NotFoundError } from '../utils/AppError.js';

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const workspaceId = req.body.workspaceId || req.user?.workspaceId;
  const project = await projectService.createProject({ ...req.body, workspaceId }, req.user!.userId);
  return sendCreated(res, project, 'Project created successfully');
});

export const listProjects = asyncHandler(async (req: Request, res: Response) => {
  const workspaceId = Array.isArray(req.params.workspaceId)
    ? req.params.workspaceId[0]
    : req.params.workspaceId || req.user?.workspaceId;
  const projects = await projectService.listProjectsWithStats(workspaceId || '');
  return sendSuccess(res, projects, 'Projects loaded');
});

export const getProject = asyncHandler(async (req: Request, res: Response) => {
  const projectId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const workspaceId = req.user?.workspaceId;

  const query: Record<string, unknown> = { _id: projectId, isDeleted: false };
  if (workspaceId) {
    query.workspaceId = workspaceId;
  }

  const project = await ProjectModel.findOne(query);
  if (!project) {
    throw new NotFoundError('Project not found');
  }

  // Compute live project stats via MongoDB aggregation
  const stats = await projectService.getProjectStats(projectId);
  const responseData = {
    ...project.toObject(),
    ...stats,
  };

  return sendSuccess(res, responseData, 'Project loaded');
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const projectId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const workspaceId = req.user?.workspaceId;

  const query: Record<string, unknown> = { _id: projectId, isDeleted: false };
  if (workspaceId) {
    query.workspaceId = workspaceId;
  }

  const existing = await ProjectModel.findOne(query);
  if (!existing) {
    throw new NotFoundError('Project not found');
  }

  const project = await projectService.updateProject(projectId, req.body);
  return sendSuccess(res, project, 'Project updated');
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const projectId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const workspaceId = req.user?.workspaceId;

  const query: Record<string, unknown> = { _id: projectId, isDeleted: false };
  if (workspaceId) {
    query.workspaceId = workspaceId;
  }

  const existing = await ProjectModel.findOne(query);
  if (!existing) {
    throw new NotFoundError('Project not found');
  }

  const result = await projectService.deleteProject(projectId);
  return sendSuccess(res, result, 'Project deleted');
});

export const addMember = asyncHandler(async (req: Request, res: Response) => {
  const projectId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const project = await projectService.addMember(projectId, req.body.userId, req.body.role);
  return sendSuccess(res, project, 'Member added');
});

export const updateMemberRole = asyncHandler(async (req: Request, res: Response) => {
  const projectId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
  const project = await projectService.updateMemberRole(projectId, userId, req.body.role);
  return sendSuccess(res, project, 'Member role updated');
});

export const removeMember = asyncHandler(async (req: Request, res: Response) => {
  const projectId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
  const project = await projectService.removeMember(projectId, userId);
  return sendSuccess(res, project, 'Member removed');
});
