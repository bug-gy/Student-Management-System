import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { Student } from "../models/Student.js";
import { Teacher } from "../models/Teacher.js";
import { Course } from "../models/Course.js";
import { ApiError } from "../utils/ApiError.js";
import { parsePagination, getPaginationMeta } from "../utils/pagination.js";

export class UserService {
  async listUsers(query: {
    role?: string;
    course?: string;
    batch?: string;
    status?: string;
    search?: string;
    page?: string;
    limit?: string;
  }) {
    const { skip, page, limit } = parsePagination(query);
    const filter: Record<string, unknown> = {};

    if (query.role) filter.role = query.role;
    if (query.status) filter.status = query.status;
    if (query.search) {
      const escaped = query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { name: { $regex: escaped, $options: "i" } },
        { email: { $regex: escaped, $options: "i" } },
      ];
    }

    let baseQuery = User.find(filter);

    if (query.course) {
      baseQuery = baseQuery.where("course").equals(query.course);
    }
    if (query.batch) {
      baseQuery = baseQuery.where("batch").equals(query.batch);
    }

    const [users, total] = await Promise.all([
      baseQuery.sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(filter),
    ]);

    return {
      users,
      pagination: getPaginationMeta(total, page, limit),
    };
  }

  async createUser(data: {
    name: string;
    email: string;
    password: string;
    role: "admin" | "teacher" | "student";
    course?: string;
    batch?: string;
  }) {
    const existing = await User.findOne({ email: data.email.toLowerCase() });
    if (existing) {
      throw ApiError.conflict("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    if (data.role === "student") {
      const course = data.course ? await Course.findById(data.course).lean() : null;
      const courseCode = course?.code ?? "GEN";
      const year = new Date().getFullYear().toString().slice(-2);
      const count = await Student.countDocuments({ course: data.course });
      const rollNumber = `${courseCode}${year}${String(count + 1).padStart(4, "0")}`;

      return Student.create({
        ...data,
        password: hashedPassword,
        course: data.course ?? undefined,
        batch: data.batch ?? undefined,
        enrollmentDate: new Date(),
        rollNumber,
      });
    }

    if (data.role === "teacher") {
      return Teacher.create({ ...data, password: hashedPassword });
    }

    return User.create({ ...data, password: hashedPassword });
  }

  async updateUser(id: string, data: Record<string, unknown>) {
    const user = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!user) {
      throw ApiError.notFound("User not found");
    }
    return user.toJSON();
  }

  async deactivateUser(id: string) {
    const user = await User.findByIdAndUpdate(id, { status: "inactive" }, { new: true });
    if (!user) {
      throw ApiError.notFound("User not found");
    }
    return user.toJSON();
  }

  async resetPassword(id: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const user = await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
    if (!user) {
      throw ApiError.notFound("User not found");
    }
    return { message: "Password reset successful" };
  }

  async bulkCreateUsers(users: { name: string; email: string; password: string; role: "admin" | "teacher" | "student"; course?: string; batch?: string }[]) {
    const results: { created: number; skipped: number; errors: { email: string; error: string }[] } = {
      created: 0, skipped: 0, errors: [],
    };

    for (const userData of users) {
      try {
        const existing = await User.findOne({ email: userData.email.toLowerCase() });
        if (existing) {
          results.skipped++;
          continue;
        }
        const hashedPassword = await bcrypt.hash(userData.password, 12);

        if (userData.role === "student") {
          const course = userData.course ? await Course.findById(userData.course).lean() : null;
          const courseCode = course?.code ?? "GEN";
          const year = new Date().getFullYear().toString().slice(-2);
          const count = await Student.countDocuments({ course: userData.course });
          const rollNumber = `${courseCode}${year}${String(count + 1).padStart(4, "0")}`;
          await Student.create({ ...userData, password: hashedPassword, course: userData.course ?? undefined, batch: userData.batch ?? undefined, enrollmentDate: new Date(), rollNumber });
        } else if (userData.role === "teacher") {
          await Teacher.create({ ...userData, password: hashedPassword });
        } else {
          await User.create({ ...userData, password: hashedPassword });
        }
        results.created++;
      } catch (err) {
        results.errors.push({ email: userData.email, error: (err as Error).message });
      }
    }

    return results;
  }
}
