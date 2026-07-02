import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { Student } from "../models/Student.js";
import { Teacher } from "../models/Teacher.js";
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
      filter.$or = [
        { name: { $regex: query.search, $options: "i" } },
        { email: { $regex: query.search, $options: "i" } },
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
      return Student.create({
        ...data,
        password: hashedPassword,
        course: data.course ?? undefined,
        batch: data.batch ?? undefined,
        enrollmentDate: new Date(),
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
}
