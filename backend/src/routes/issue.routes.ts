import { Router } from 'express';
import * as issueController from '../controllers/issue.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createIssueValidator, issueIdValidator, updateIssueValidator } from '../validators/issue.validator.js';

const router = Router();

router.use(authenticate);

router.get(['/', ''], issueController.listIssues);
router.get('/project/:projectId', issueController.listIssues);
router.post(['/', ''], createIssueValidator, validateRequest, issueController.createIssue);
router.get('/:id', issueIdValidator, validateRequest, issueController.getIssue);
router.patch('/:id', issueIdValidator, updateIssueValidator, validateRequest, issueController.updateIssue);
router.delete('/:id', issueIdValidator, validateRequest, issueController.deleteIssue);

export default router;
