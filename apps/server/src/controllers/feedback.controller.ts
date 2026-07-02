import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { FeedbackService } from "../services/feedback.service.js";

const feedbackService = new FeedbackService();

export const listForms = asyncHandler(async (req: Request, res: Response) => {
  const forms = await feedbackService.listForms(req.query as Record<string, string>);
  res.json(ApiResponse.success(forms));
});

export const createForm = asyncHandler(async (req: Request, res: Response) => {
  const form = await feedbackService.createForm({
    ...req.body,
    createdBy: req.user!.userId,
  });
  res.status(201).json(ApiResponse.created(form));
});

export const getResults = asyncHandler(async (req: Request, res: Response) => {
  const results = await feedbackService.getResults(req.params.id!);
  res.json(ApiResponse.success(results));
});

export const exportResults = asyncHandler(async (req: Request, res: Response) => {
  const results = await feedbackService.exportResults(req.params.id!);
  res.json(ApiResponse.success(results));
});
