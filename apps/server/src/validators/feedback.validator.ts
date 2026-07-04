import { z } from "zod";

export const createFeedbackSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  subject: z.string().optional(),
  targetTeacher: z.string().optional(),
  openDate: z.string().datetime("Invalid open date"),
  closeDate: z.string().datetime("Invalid close date"),
  questions: z
    .array(
      z.object({
        questionText: z.string().min(1, "Question text is required"),
        type: z.enum(["rating", "text", "multiple_choice"]),
        options: z.array(z.string()).optional(),
      }),
    )
    .min(1, "At least one question is required"),
});

export const updateFeedbackSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  openDate: z.string().datetime().optional(),
  closeDate: z.string().datetime().optional(),
});
