import { z } from "zod";

export const createAssignmentSchema = z.object({
  subject: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  deadline: z.string().datetime(),
  maxMarks: z.number().positive(),
});

export const updateAssignmentSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  deadline: z.string().datetime().optional(),
  maxMarks: z.number().positive().optional(),
  status: z.enum(["open", "closed"]).optional(),
});

export const gradeSubmissionSchema = z.object({
  grade: z.number().min(0),
  feedback: z.string().optional(),
});

export const createAttendanceSchema = z.object({
  subject: z.string().min(1),
  date: z.string().datetime(),
  records: z.array(
    z.object({
      studentId: z.string().min(1),
      status: z.enum(["present", "absent", "late"]),
    }),
  ).min(1),
});

export const createMarksSchema = z.object({
  subject: z.string().min(1),
  examType: z.string().min(1),
  marks: z.array(
    z.object({
      studentId: z.string().min(1),
      score: z.number().min(0),
      maxScore: z.number().positive(),
      remark: z.string().optional(),
    }),
  ).min(1),
});

export const updateMarkSchema = z.object({
  score: z.number().min(0).optional(),
  maxScore: z.number().positive().optional(),
  remark: z.string().optional(),
});
