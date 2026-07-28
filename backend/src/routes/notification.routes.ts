import { Router } from 'express';
import {
  deleteNotification,
  getUnreadCount,
  getUserNotifications,
  markAllAsRead,
  markAsRead,
} from '../controllers/notification.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.get('/', authenticate, getUserNotifications);
router.get('/unread/count', authenticate, getUnreadCount);
router.patch('/:id/read', authenticate, markAsRead);
router.patch('/mark-all-read', authenticate, markAllAsRead);
router.delete('/:id', authenticate, deleteNotification);

export default router;
