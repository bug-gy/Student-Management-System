import { Attendance } from "../models/Attendance.js";
import { Grade } from "../models/Grade.js";

export class ReportService {
  async getAttendanceSummary(courseId?: string, subjectId?: string) {
    const match: Record<string, unknown> = {};
    if (subjectId) match.subject = subjectId;

    const summary = await Attendance.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$subject",
          total: { $sum: 1 },
          present: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
          absent: { $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] } },
          late: { $sum: { $cond: [{ $eq: ["$status", "late"] }, 1, 0] } },
        },
      },
      {
        $lookup: { from: "subjects", localField: "_id", foreignField: "_id", as: "subject" },
      },
      { $unwind: "$subject" },
      { $project: { "subject.assignedTeachers": 0 } },
    ]);

    return summary;
  }

  async getGradeReport(subjectId?: string) {
    const match: Record<string, unknown> = {};
    if (subjectId) match.subject = subjectId;

    const report = await Grade.aggregate([
      { $match: match },
      {
        $group: {
          _id: { subject: "$subject", examType: "$examType" },
          average: { $avg: "$score" },
          highest: { $max: "$score" },
          lowest: { $min: "$score" },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: { from: "subjects", localField: "_id.subject", foreignField: "_id", as: "subject" },
      },
      { $unwind: "$subject" },
      { $project: { "subject.assignedTeachers": 0 } },
      { $sort: { "_id.examType": 1 } },
    ]);

    return report;
  }
}
