import { z } from "zod";

export const createCourseSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  code: z.string().min(1, "Code is required").max(20),
  duration: z.number().int().positive("Duration must be positive"),
  description: z.string().max(500).optional(),
});

export const updateCourseSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  code: z.string().min(1).max(20).optional(),
  duration: z.number().int().positive().optional(),
  description: z.string().max(500).optional(),
  status: z.enum(["active", "archived"]).optional(),
});
