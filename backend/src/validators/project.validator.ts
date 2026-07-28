import { body, param } from 'express-validator';

export const createProjectValidator = [
  body('name').trim().notEmpty().withMessage('Project name is required'),
];

export const updateProjectValidator = [
  body('name').optional().trim().notEmpty().withMessage('Project name is required'),
];

export const projectIdValidator = [param('id').notEmpty().withMessage('Project id is required')];

export const addProjectMemberValidator = [
  body('userId').notEmpty().withMessage('User id is required'),
  body('role').optional().isIn(['owner', 'admin', 'member', 'viewer']).withMessage('Invalid role'),
];
