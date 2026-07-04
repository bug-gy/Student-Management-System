import { Notice } from "../models/Notice.js";
import { ApiError } from "../utils/ApiError.js";
import { parsePagination, getPaginationMeta } from "../utils/pagination.js";

export class NoticeService {
  async listNotices(query: { page?: string; limit?: string; target?: string; status?: string }) {
    const { skip, page, limit } = parsePagination(query);
    const filter: Record<string, unknown> = {};

    if (query.target) {
      filter["targetAudience.type"] = query.target;
    }

    filter.status = query.status ?? "active";
    filter.publishDate = { $lte: new Date() };
    filter.$or = [
      { expiryDate: { $exists: false } },
      { expiryDate: null },
      { expiryDate: { $gte: new Date() } },
    ];

    const [notices, total] = await Promise.all([
      Notice.find(filter)
        .populate("createdBy", "name")
        .sort({ publishDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notice.countDocuments(filter),
    ]);

    return { notices, pagination: getPaginationMeta(total, page, limit) };
  }

  async createNotice(data: {
    title: string;
    description: string;
    targetAudience: { type: string; refId?: string };
    priority?: string;
    publishDate?: string;
    expiryDate?: string;
    createdBy: string;
  }) {
    return Notice.create({
      ...data,
      publishDate: data.publishDate ? new Date(data.publishDate) : new Date(),
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
    });
  }

  async updateNotice(id: string, data: Record<string, unknown>) {
    const notice = await Notice.findByIdAndUpdate(id, data, { new: true });
    if (!notice) throw ApiError.notFound("Notice not found");
    return notice;
  }

  async deleteNotice(id: string) {
    const notice = await Notice.findByIdAndUpdate(id, { status: "archived" }, { new: true });
    if (!notice) throw ApiError.notFound("Notice not found");
    return notice;
  }

  async restoreNotice(id: string) {
    const notice = await Notice.findByIdAndUpdate(id, { status: "active" }, { new: true });
    if (!notice) throw ApiError.notFound("Notice not found");
    return notice;
  }
}
