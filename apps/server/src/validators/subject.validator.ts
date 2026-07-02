import { z } from "zod";

export const createSubjectSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  code: z.string().min(1, "Code is required").max(20),
  course: z.string().min(1, "Course is required"),
  semester: z.number().int().positive("Semester must be positive"),
  creditHours: z.number().int().positive().optional(),
});

export const updateSubjectSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  code: z.string().min(1).max(20).optional(),
  semester: z.number().int().positive().optional(),
  creditHours: z.number().int().positive().optional(),
  status: z.enum(["active", "archived"]).optional(),
});

export const assignTeacherSchema = z.object({
  teacherIds: z.array(z.string().min(1)).min(1, "At least one teacher required"),
});
