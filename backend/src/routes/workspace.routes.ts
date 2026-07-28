import { Router } from 'express';
import * as workspaceController from '../controllers/workspace.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createWorkspaceValidator,
  inviteMemberValidator,
  updateWorkspaceValidator,
  workspaceIdValidator,
} from '../validators/workspace.validator.js';

const router = Router();

router.use(authenticate);

router.get(['/', ''], workspaceController.listWorkspaces);
router.post(['/', ''], createWorkspaceValidator, validateRequest, workspaceController.createWorkspace);
router.get('/:id', workspaceIdValidator, validateRequest, workspaceController.getWorkspace);
router.patch('/:id', workspaceIdValidator, updateWorkspaceValidator, validateRequest, workspaceController.updateWorkspace);
router.post('/:id/invite', workspaceIdValidator, inviteMemberValidator, validateRequest, workspaceController.inviteMember);
router.patch('/:id/members/:userId', workspaceIdValidator, workspaceController.updateMemberRole);
router.delete('/:id/members/:userId', workspaceIdValidator, workspaceController.removeMember);

export default router;
