import { Router } from 'express';
import { getProjectReports } from '../controllers/report.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get(['/projects/:projectId', '/projects/:projectId/'], getProjectReports);
router.get(['/', ''], getProjectReports);

export default router;
