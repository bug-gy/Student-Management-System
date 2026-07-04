import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a digit")
    .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
  role: z.enum(["admin", "teacher", "student"]),
  course: z.string().optional(),
  batch: z.string().optional(),
}).refine(
  (data) => data.role !== "student" || (data.course && data.course.length > 0),
  { message: "Course is required for students", path: ["course"] },
);

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
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a digit")
    .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
});
