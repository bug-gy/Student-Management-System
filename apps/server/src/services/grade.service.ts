import { Grade } from "../models/Grade.js";
import { ApiError } from "../utils/ApiError.js";

export class GradeService {
  async getGrades(query: { subject?: string; examType?: string; studentId?: string }) {
    const filter: Record<string, unknown> = {};
    if (query.subject) filter.subject = query.subject;
    if (query.examType) filter.examType = query.examType;
    if (query.studentId) filter.student = query.studentId;

    return Grade.find(filter)
      .populate("student", "name email rollNumber")
      .populate("enteredBy", "name")
      .sort({ createdAt: -1 })
      .lean();
  }

  async createMarks(data: {
    subject: string;
    examType: string;
    enteredBy: string;
    marks: { studentId: string; score: number; maxScore: number; remark?: string }[];
  }) {
    const operations = data.marks.map((m) => ({
      updateOne: {
        filter: { subject: data.subject, student: m.studentId, examType: data.examType },
        update: {
          subject: data.subject,
          student: m.studentId,
          examType: data.examType,
          score: m.score,
          maxScore: m.maxScore,
          enteredBy: data.enteredBy,
          remark: m.remark,
        },
        upsert: true,
      },
    }));

    await Grade.bulkWrite(operations);
    return { message: "Marks recorded", count: data.marks.length };
  }

  async getSummary(subjectId: string) {
    const grades = await Grade.find({ subject: subjectId }).lean();
    const scores = grades.map((g) => g.score);

    return {
      average: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
      highest: scores.length > 0 ? Math.max(...scores) : 0,
      lowest: scores.length > 0 ? Math.min(...scores) : 0,
      count: scores.length,
    };
  }

  async updateMark(id: string, data: { score?: number; maxScore?: number; remark?: string }) {
    const mark = await Grade.findByIdAndUpdate(id, data, { new: true });
    if (!mark) throw ApiError.notFound("Mark not found");
    return mark;
  }
}
