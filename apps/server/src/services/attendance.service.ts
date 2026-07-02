import mongoose from "mongoose";
import { Attendance } from "../models/Attendance.js";
import { ApiError } from "../utils/ApiError.js";

export class AttendanceService {
  async getAttendance(query: { subject?: string; date?: string; studentId?: string }) {
    const filter: Record<string, unknown> = {};
    if (query.subject) filter.subject = query.subject;
    if (query.date) filter.date = new Date(query.date);
    if (query.studentId) filter.student = query.studentId;

    return Attendance.find(filter)
      .populate("student", "name email rollNumber")
      .sort({ date: -1 })
      .lean();
  }

  async markAttendance(data: {
    subject: string;
    date: string;
    takenBy: string;
    records: { studentId: string; status: "present" | "absent" | "late" }[];
  }) {
    const date = new Date(data.date);
    const operations = data.records.map((record) => ({
      updateOne: {
        filter: { subject: data.subject, date, student: record.studentId },
        update: { subject: data.subject, date, student: record.studentId, status: record.status, takenBy: data.takenBy },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(operations);
    return { message: "Attendance recorded", count: data.records.length };
  }

  async getAttendanceReport(subjectId: string, studentId?: string) {
    const match: Record<string, unknown> = { subject: subjectId };
    if (studentId) match.student = studentId;

    const records = await Attendance.find(match).populate("student", "name email").sort({ date: -1 }).lean();

    const total = records.length;
    const present = records.filter((r) => r.status === "present").length;
    const absent = records.filter((r) => r.status === "absent").length;
    const late = records.filter((r) => r.status === "late").length;
    const percentage = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

    return { records, summary: { total, present, absent, late, percentage } };
  }

  async getLowAttendance(subjectId: string, threshold: number) {
    const students = await Attendance.aggregate([
      { $match: { subject: new mongoose.Types.ObjectId(subjectId) } },
      {
        $group: {
          _id: "$student",
          total: { $sum: 1 },
          present: { $sum: { $cond: [{ $in: ["$status", ["present", "late"]] }, 1, 0] } },
        },
      },
      {
        $addFields: {
          percentage: { $multiply: [{ $divide: ["$present", "$total"] }, 100] },
        },
      },
      { $match: { percentage: { $lt: threshold } } },
      {
        $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "student" },
      },
      { $unwind: "$student" },
      { $project: { "student.password": 0 } },
    ]);

    return students;
  }
}
