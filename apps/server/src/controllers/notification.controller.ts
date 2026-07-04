import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { NotificationService } from "../services/notification.service.js";

const notificationService = new NotificationService();

export const listNotifications = asyncHandler(async (req: Request, res: Response) => {
  const result = await notificationService.list(req.user!.userId, req.query as Record<string, string>);
  res.json(ApiResponse.paginated(result.notifications, result.pagination));
});

export const getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
  const count = await notificationService.getUnreadCount(req.user!.userId);
  res.json(ApiResponse.success({ count }));
});

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const notification = await notificationService.markAsRead(req.params.id!, req.user!.userId);
  if (!notification) {
    res.status(404).json(ApiResponse.success(null, "Notification not found"));
    return;
  }
  res.json(ApiResponse.success(notification));
});

export const markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
  await notificationService.markAllAsRead(req.user!.userId);
  res.json(ApiResponse.success(null, "All notifications marked as read"));
});
