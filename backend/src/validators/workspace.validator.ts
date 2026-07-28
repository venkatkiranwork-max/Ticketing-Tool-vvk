import { body, param } from 'express-validator';

export const createWorkspaceValidator = [
  body('name').trim().notEmpty().withMessage('Workspace name is required'),
  body('slug').trim().notEmpty().withMessage('Workspace slug is required'),
];

export const updateWorkspaceValidator = [
  body('name').optional().trim().notEmpty().withMessage('Workspace name is required'),
  body('slug').optional().trim().notEmpty().withMessage('Workspace slug is required'),
];

export const workspaceIdValidator = [param('id').notEmpty().withMessage('Workspace id is required')];

export const inviteMemberValidator = [
  body('userId').notEmpty().withMessage('User id is required'),
  body('role').optional().isIn(['owner', 'admin', 'member', 'viewer']).withMessage('Invalid role'),
];
