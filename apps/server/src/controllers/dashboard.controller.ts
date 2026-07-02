import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { DashboardService } from "../services/dashboard.service.js";

const dashboardService = new DashboardService();

export const getAdminDashboard = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await dashboardService.getAdminStats();
  res.json(ApiResponse.success(stats));
});

export const getTeacherDashboard = asyncHandler(async (req: Request, res: Response) => {
  const stats = await dashboardService.getTeacherStats(req.user!.userId);
  res.json(ApiResponse.success(stats));
});

export const getStudentDashboard = asyncHandler(async (req: Request, res: Response) => {
  const stats = await dashboardService.getStudentStats(req.user!.userId);
  res.json(ApiResponse.success(stats));
});
