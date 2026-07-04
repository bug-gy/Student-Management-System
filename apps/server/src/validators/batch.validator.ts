import { z } from "zod";

export const createBatchSchema = z.object({
  course: z.string().min(1, "Course is required"),
  year: z.number().int().min(2000, "Invalid year").max(2100, "Invalid year"),
  section: z.string().min(1, "Section is required").max(10),
});

export const updateBatchSchema = z.object({
  course: z.string().min(1).optional(),
  year: z.number().int().min(2000).max(2100).optional(),
  section: z.string().min(1).max(10).optional(),
});
