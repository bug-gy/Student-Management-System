import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { BatchService } from "../services/batch.service.js";

const batchService = new BatchService();

export const listBatches = asyncHandler(async (req: Request, res: Response) => {
  const result = await batchService.listBatches(req.query as Record<string, string>);
  res.json(ApiResponse.paginated(result.batches, result.pagination, "Batches fetched"));
});

export const createBatch = asyncHandler(async (req: Request, res: Response) => {
  const batch = await batchService.createBatch(req.body);
  res.status(201).json(ApiResponse.created(batch, "Batch created"));
});

export const updateBatch = asyncHandler(async (req: Request, res: Response) => {
  const batch = await batchService.updateBatch(req.params.id!, req.body);
  res.json(ApiResponse.success(batch, "Batch updated"));
});

export const deleteBatch = asyncHandler(async (req: Request, res: Response) => {
  await batchService.deleteBatch(req.params.id!);
  res.json(ApiResponse.success(null, "Batch archived"));
});

export const restoreBatch = asyncHandler(async (req: Request, res: Response) => {
  const batch = await batchService.restoreBatch(req.params.id!);
  res.json(ApiResponse.success(batch, "Batch restored"));
});
