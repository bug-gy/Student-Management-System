import mongoose from "mongoose";
import { Subject } from "../models/Subject.js";
import { Teacher } from "../models/Teacher.js";
import { ApiError } from "../utils/ApiError.js";
import { parsePagination, getPaginationMeta } from "../utils/pagination.js";

export class SubjectService {
  async listSubjects(query: { course?: string; semester?: string; page?: string; limit?: string; status?: string }) {
    const { skip, page, limit } = parsePagination(query);
    const filter: Record<string, unknown> = {};
    if (query.course) filter.course = query.course;
    if (query.semester) filter.semester = parseInt(query.semester);
    filter.status = query.status ?? "active";

    const [subjects, total] = await Promise.all([
      Subject.find(filter)
        .populate("course", "name code")
        .populate("assignedTeachers", "name email")
        .sort({ semester: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Subject.countDocuments(filter),
    ]);

    return {
      subjects,
      pagination: getPaginationMeta(total, page, limit),
    };
  }

  async createSubject(data: {
    name: string;
    code: string;
    course: string;
    semester: number;
    creditHours?: number;
  }) {
    return Subject.create(data);
  }

  async updateSubject(id: string, data: Record<string, unknown>) {
    const subject = await Subject.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!subject) {
      throw ApiError.notFound("Subject not found");
    }
    return subject;
  }

  async archiveSubject(id: string) {
    const subject = await Subject.findByIdAndUpdate(id, { status: "archived" }, { new: true });
    if (!subject) {
      throw ApiError.notFound("Subject not found");
    }
    return subject;
  }

  async restoreSubject(id: string) {
    const subject = await Subject.findByIdAndUpdate(id, { status: "active" }, { new: true });
    if (!subject) {
      throw ApiError.notFound("Subject not found");
    }
    return subject;
  }

  async assignTeachers(subjectId: string, teacherIds: string[]) {
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      throw ApiError.notFound("Subject not found");
    }

    const uniqueIds = [...new Set(teacherIds)];
    subject.assignedTeachers = uniqueIds as unknown as mongoose.Types.ObjectId[];
    await subject.save();

    await Teacher.updateMany(
      { _id: { $in: uniqueIds } },
      { $addToSet: { assignedSubjects: subjectId } },
    );

    return subject.populate("assignedTeachers", "name email");
  }

  async removeTeacher(subjectId: string, teacherId: string) {
    const subject = await Subject.findByIdAndUpdate(
      subjectId,
      { $pull: { assignedTeachers: teacherId } },
      { new: true },
    );
    if (!subject) {
      throw ApiError.notFound("Subject not found");
    }

    await Teacher.findByIdAndUpdate(teacherId, {
      $pull: { assignedSubjects: subjectId },
    });

    return subject.populate("assignedTeachers", "name email");
  }

  async getTeachers(subjectId: string) {
    const subject = await Subject.findById(subjectId).populate("assignedTeachers", "name email");
    if (!subject) {
      throw ApiError.notFound("Subject not found");
    }
    return subject.assignedTeachers;
  }
}
