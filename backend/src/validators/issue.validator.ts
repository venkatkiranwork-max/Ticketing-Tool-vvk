import { body, param } from 'express-validator';

export const createIssueValidator = [
  body('projectId').notEmpty().withMessage('Project id is required'),
  body('workspaceId').optional(),
  body('title').trim().notEmpty().withMessage('Issue title is required'),
  body('status').optional().isIn(['backlog', 'todo', 'in_progress', 'review', 'done']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority'),
];

export const updateIssueValidator = [
  body('title').optional().trim().notEmpty().withMessage('Issue title is required'),
  body('description').optional().trim(),
  body('status').optional().isIn(['backlog', 'todo', 'in_progress', 'review', 'done']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority'),
  body('dueDate').optional(),
  body('assigneeId').optional(),
];

export const issueIdValidator = [param('id').notEmpty().withMessage('Issue id is required')];
