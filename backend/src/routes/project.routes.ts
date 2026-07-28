import { Router } from 'express';
import * as projectController from '../controllers/project.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  addProjectMemberValidator,
  createProjectValidator,
  projectIdValidator,
  updateProjectValidator,
} from '../validators/project.validator.js';

const router = Router();

router.use(authenticate);

router.get(['/', ''], projectController.listProjects);
router.get('/workspace/:workspaceId', projectController.listProjects);
router.post(['/', ''], createProjectValidator, validateRequest, projectController.createProject);
router.get('/:id', projectIdValidator, validateRequest, projectController.getProject);
router.patch('/:id', projectIdValidator, updateProjectValidator, validateRequest, projectController.updateProject);
router.delete('/:id', projectIdValidator, validateRequest, projectController.deleteProject);
router.post('/:id/members', projectIdValidator, addProjectMemberValidator, validateRequest, projectController.addMember);
router.patch('/:id/members/:userId', projectIdValidator, projectController.updateMemberRole);
router.delete('/:id/members/:userId', projectIdValidator, projectController.removeMember);

export default router;
