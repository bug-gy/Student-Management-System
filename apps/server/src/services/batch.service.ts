import { Batch } from "../models/Batch.js";
import { ApiError } from "../utils/ApiError.js";
import { parsePagination, getPaginationMeta } from "../utils/pagination.js";

export class BatchService {
  async listBatches(query: { course?: string; page?: string; limit?: string; status?: string }) {
    const { skip, page, limit } = parsePagination(query);
    const filter: Record<string, unknown> = {};
    if (query.course) filter.course = query.course;
    filter.status = query.status ?? "active";

    const [batches, total] = await Promise.all([
      Batch.find(filter)
        .populate("course", "name code")
        .sort({ year: -1, section: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Batch.countDocuments(filter),
    ]);

    return { batches, pagination: getPaginationMeta(total, page, limit) };
  }

  async createBatch(data: { course: string; year: number; section: string }) {
    const existing = await Batch.findOne({ course: data.course, year: data.year, section: data.section, status: "active" });
    if (existing) {
      throw ApiError.conflict("Batch already exists for this course, year, and section");
    }
    return Batch.create(data);
  }

  async updateBatch(id: string, data: Record<string, unknown>) {
    const batch = await Batch.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!batch) throw ApiError.notFound("Batch not found");
    return batch;
  }

  async deleteBatch(id: string) {
    const batch = await Batch.findByIdAndUpdate(id, { status: "archived" }, { new: true });
    if (!batch) throw ApiError.notFound("Batch not found");
    return batch;
  }

  async restoreBatch(id: string) {
    const batch = await Batch.findByIdAndUpdate(id, { status: "active" }, { new: true });
    if (!batch) throw ApiError.notFound("Batch not found");
    return batch;
  }
}
