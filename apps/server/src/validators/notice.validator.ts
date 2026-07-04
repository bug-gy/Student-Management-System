import { z } from "zod";

export const createNoticeSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required").max(5000),
  priority: z.enum(["normal", "urgent"]).default("normal"),
  targetAudience: z.object({
    type: z.enum(["all", "students", "teachers", "course", "batch"]),
    refId: z.string().optional(),
  }),
  expiryDate: z.string().datetime().optional(),
});

export const updateNoticeSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(5000).optional(),
  priority: z.enum(["normal", "urgent"]).optional(),
  targetAudience: z.object({
    type: z.enum(["all", "students", "teachers", "course", "batch"]),
    refId: z.string().optional(),
  }).optional(),
  expiryDate: z.string().datetime().optional(),
});
