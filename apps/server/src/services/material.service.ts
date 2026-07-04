import { StudyMaterial } from "../models/StudyMaterial.js";
import { ApiError } from "../utils/ApiError.js";
import { parsePagination, getPaginationMeta } from "../utils/pagination.js";

export class MaterialService {
  async listMaterials(query: { subject?: string; topic?: string; page?: string; limit?: string; status?: string }) {
    const { skip, page, limit } = parsePagination(query);
    const filter: Record<string, unknown> = {};
    if (query.subject) filter.subject = query.subject;
    if (query.topic) filter.topic = query.topic;
    filter.status = query.status ?? "active";

    const [materials, total] = await Promise.all([
      StudyMaterial.find(filter)
        .populate("uploadedBy", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      StudyMaterial.countDocuments(filter),
    ]);

    return { materials, pagination: getPaginationMeta(total, page, limit) };
  }

  async createMaterial(data: {
    subject: string;
    uploadedBy: string;
    title: string;
    topic?: string;
    week?: number;
    filePath: string;
    fileType: string;
    fileSize: number;
  }) {
    return StudyMaterial.create(data);
  }

  async updateMaterial(id: string, data: Record<string, unknown>) {
    const material = await StudyMaterial.findByIdAndUpdate(id, data, { new: true });
    if (!material) throw ApiError.notFound("Material not found");
    return material;
  }

  async deleteMaterial(id: string) {
    const material = await StudyMaterial.findByIdAndUpdate(id, { status: "archived" }, { new: true });
    if (!material) throw ApiError.notFound("Material not found");
    return material;
  }

  async restoreMaterial(id: string) {
    const material = await StudyMaterial.findByIdAndUpdate(id, { status: "active" }, { new: true });
    if (!material) throw ApiError.notFound("Material not found");
    return material;
  }
}
