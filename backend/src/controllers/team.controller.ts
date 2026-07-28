import type { Request, Response } from 'express';
import { TeamModel as Team } from '../models/Team.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, sendCreated } from '../utils/apiResponse.js';

export const listTeams = asyncHandler(async (_req: Request, res: Response) => {
  const teams = await Team.find({ isDeleted: false }).sort({ createdAt: -1 });
  return sendSuccess(res, teams, 'Teams loaded successfully');
});

export const createTeam = asyncHandler(async (req: Request, res: Response) => {
  const team = await Team.create({
    ...req.body,
    color: req.body.color || '#6366f1',
    memberCount: req.body.memberCount || 1,
    projectCount: req.body.projectCount || 1,
    velocity: req.body.velocity || 30,
  });
  return sendCreated(res, team, 'Team created successfully');
});
