import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import workspaceRoutes from './workspace.routes.js';
import projectRoutes from './project.routes.js';
import issueRoutes from './issue.routes.js';
import reportRoutes from './report.routes.js';
import notificationRoutes from './notification.routes.js';
import userRoutes from './user.routes.js';
import teamRoutes from './team.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/workspaces', workspaceRoutes);
router.use('/projects', projectRoutes);
router.use('/issues', issueRoutes);
router.use('/reports', reportRoutes);
router.use('/notifications', notificationRoutes);
router.use('/users', userRoutes);
router.use('/teams', teamRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
