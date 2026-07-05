import { Response } from 'express';
import { notificationService } from '../services/notification.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthRequest } from '../middlewares/auth.middleware';

export const notificationController = {
  getMyNotifications: asyncHandler(async (req: AuthRequest, res: Response) => {
    const notifications = await notificationService.getMyNotifications(req.user!.id);
    res.json(ApiResponse.ok('Notifications retrieved', notifications));
  }),

  markAsRead: asyncHandler(async (req: AuthRequest, res: Response) => {
    await notificationService.markAsRead(req.params.id as string, req.user!.id);
    res.json(ApiResponse.ok('Notification marked as read'));
  }),

  markAllAsRead: asyncHandler(async (req: AuthRequest, res: Response) => {
    await notificationService.markAllAsRead(req.user!.id);
    res.json(ApiResponse.ok('All notifications marked as read'));
  }),
};
