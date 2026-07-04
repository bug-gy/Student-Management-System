import { Attendance } from "../models/Attendance.js";
import { Grade } from "../models/Grade.js";
import { Course } from "../models/Course.js";
import { Subject } from "../models/Subject.js";
import { Student } from "../models/Student.js";
import { Teacher } from "../models/Teacher.js";
import { User } from "../models/User.js";

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

  async getEnrollmentStats() {
    const totalStudents = await Student.countDocuments({ status: "active" });
    const totalTeachers = await Teacher.countDocuments({ status: "active" });
    const totalCourses = await Course.countDocuments({ status: "active" });
    const totalSubjects = await Subject.countDocuments({ status: "active" });

    const courseEnrollment = await Student.aggregate([
      { $match: { status: "active" } },
      { $group: { _id: "$course", count: { $sum: 1 } } },
      { $lookup: { from: "courses", localField: "_id", foreignField: "_id", as: "course" } },
      { $unwind: { path: "$course", preserveNullAndEmptyArrays: true } },
      { $project: { courseName: "$course.name", count: 1 } },
      { $sort: { count: -1 } },
    ]);

    const roleDistribution = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
      { $project: { role: "$_id", count: 1, _id: 0 } },
    ]);

    return { totalStudents, totalTeachers, totalCourses, totalSubjects, courseEnrollment, roleDistribution };
  }

  async getTeacherWorkload() {
    return Teacher.aggregate([
      { $match: { status: "active" } },
      {
        $lookup: {
          from: "subjects",
          localField: "assignedSubjects",
          foreignField: "_id",
          as: "subjects",
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          subjectCount: { $size: "$subjects" },
          subjects: "$subjects.name",
        },
      },
      { $sort: { subjectCount: -1 } },
    ]);
  }
}
