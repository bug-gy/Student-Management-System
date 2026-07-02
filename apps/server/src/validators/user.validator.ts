import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["admin", "teacher", "student"]),
  course: z.string().optional(),
  batch: z.string().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  course: z.string().optional(),
  batch: z.string().optional(),
});

export const bulkImportSchema = z.object({
  users: z.array(
    z.object({
      name: z.string().min(1),
      email: z.string().email(),
      role: z.enum(["admin", "teacher", "student"]),
    }),
  ),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});
