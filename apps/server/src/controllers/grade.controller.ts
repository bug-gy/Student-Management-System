import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { GradeService } from "../services/grade.service.js";

const gradeService = new GradeService();

export const getGrades = asyncHandler(async (req: Request, res: Response) => {
  const grades = await gradeService.getGrades(req.query as Record<string, string>);
  res.json(ApiResponse.success(grades));
});

export const createMarks = asyncHandler(async (req: Request, res: Response) => {
  const result = await gradeService.createMarks({
    ...req.body,
    enteredBy: req.user!.userId,
  });
  res.json(ApiResponse.success(result));
});

export const getGradeSummary = asyncHandler(async (req: Request, res: Response) => {
  const summary = await gradeService.getSummary(req.query.subject as string, req.query.examType as string | undefined);
  res.json(ApiResponse.success(summary));
});

export const updateMark = asyncHandler(async (req: Request, res: Response) => {
  const mark = await gradeService.updateMark(req.params.id!, req.body);
  res.json(ApiResponse.success(mark));
});
