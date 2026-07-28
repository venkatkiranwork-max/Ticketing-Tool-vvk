import type { Request, Response } from 'express';
import { notificationService } from '../services/notification.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getUserNotifications = asyncHandler(async (req: Request, res: Response) => {
  const notifications = await notificationService.getUserNotifications(req.user!.userId);
  return sendSuccess(res, notifications, 'Notifications loaded');
});

export const getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
  const count = await notificationService.getUnreadCount(req.user!.userId);
  return sendSuccess(res, { unreadCount: count }, 'Unread count loaded');
});

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const notification = await notificationService.markNotificationAsRead(String(id));
  return sendSuccess(res, notification, 'Notification marked as read');
});

export const markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
  const result = await notificationService.markAllAsRead(req.user!.userId);
  return sendSuccess(res, result, 'All notifications marked as read');
});

export const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await notificationService.deleteNotification(String(id));
  return sendSuccess(res, result, 'Notification deleted');
});
