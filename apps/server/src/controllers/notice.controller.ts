import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { NoticeService } from "../services/notice.service.js";

const noticeService = new NoticeService();

export const listNotices = asyncHandler(async (req: Request, res: Response) => {
  const result = await noticeService.listNotices(req.query as Record<string, string>);
  res.json(ApiResponse.paginated(result.notices, result.pagination));
});

export const createNotice = asyncHandler(async (req: Request, res: Response) => {
  const notice = await noticeService.createNotice({
    ...req.body,
    createdBy: req.user!.userId,
  });
  res.status(201).json(ApiResponse.created(notice));
});

export const updateNotice = asyncHandler(async (req: Request, res: Response) => {
  const notice = await noticeService.updateNotice(req.params.id!, req.body);
  res.json(ApiResponse.success(notice));
});

export const deleteNotice = asyncHandler(async (req: Request, res: Response) => {
  await noticeService.deleteNotice(req.params.id!);
  res.json(ApiResponse.noContent());
});
