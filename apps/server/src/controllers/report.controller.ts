import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ReportService } from "../services/report.service.js";
import { AuditLog } from "../models/AuditLog.js";

const reportService = new ReportService();

export const getAttendanceSummary = asyncHandler(async (req: Request, res: Response) => {
  const data = await reportService.getAttendanceSummary(
    req.query.course as string,
    req.query.subject as string,
  );
  res.json(ApiResponse.success(data));
});

export const getGradeReport = asyncHandler(async (req: Request, res: Response) => {
  const data = await reportService.getGradeReport(req.query.subject as string);
  res.json(ApiResponse.success(data));
});

export const getEnrollmentStats = asyncHandler(async (req: Request, res: Response) => {
  const data = await reportService.getEnrollmentStats();
  res.json(ApiResponse.success(data));
});

export const getTeacherWorkload = asyncHandler(async (req: Request, res: Response) => {
  const data = await reportService.getTeacherWorkload();
  res.json(ApiResponse.success(data));
});

export const getAuditLog = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    AuditLog.find()
      .populate("actor", "name email role")
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    AuditLog.countDocuments(),
  ]);

  res.json(
    ApiResponse.paginated(
      logs,
      { page, limit, total, totalPages: Math.ceil(total / limit) },
      "Audit log fetched",
    ),
  );
});
