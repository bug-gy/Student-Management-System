import { Course } from "../models/Course.js";
import { Student } from "../models/Student.js";
import { ApiError } from "../utils/ApiError.js";
import { parsePagination, getPaginationMeta } from "../utils/pagination.js";

export class CourseService {
  async listCourses(query: { status?: string; page?: string; limit?: string }): Promise<{
    courses: unknown[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const { skip, page, limit } = parsePagination(query);
    const filter: Record<string, unknown> = {};
    if (query.status) filter.status = query.status;

    const [courses, total] = await Promise.all([
      Course.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Course.countDocuments(filter),
    ]);

    const coursesWithCount = await Promise.all(
      courses.map(async (course) => {
        const count = await Student.countDocuments({ course: course._id });
        return { ...course, enrolledStudentCount: count };
      }),
    );

    return {
      courses: coursesWithCount,
      pagination: getPaginationMeta(total, page, limit),
    };
  }

  async createCourse(data: { name: string; code: string; duration: number; description?: string }) {
    const existing = await Course.findOne({
      $or: [{ name: data.name }, { code: data.code.toUpperCase() }],
    });
    if (existing) {
      throw ApiError.conflict("Course with this name or code already exists");
    }
    return Course.create(data);
  }

  async updateCourse(id: string, data: Record<string, unknown>) {
    const course = await Course.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!course) {
      throw ApiError.notFound("Course not found");
    }
    return course;
  }

  async archiveCourse(id: string) {
    const course = await Course.findByIdAndUpdate(id, { status: "archived" }, { new: true });
    if (!course) {
      throw ApiError.notFound("Course not found");
    }
    return course;
  }

  async restoreCourse(id: string) {
    const course = await Course.findByIdAndUpdate(id, { status: "active" }, { new: true });
    if (!course) {
      throw ApiError.notFound("Course not found");
    }
    return course;
  }
}
