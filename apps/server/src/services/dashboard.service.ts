import { Course } from "../models/Course.js";
import { Subject } from "../models/Subject.js";
import { Student } from "../models/Student.js";
import { Teacher } from "../models/Teacher.js";

export class DashboardService {
  async getAdminStats() {
    const [totalStudents, totalTeachers, totalCourses, totalSubjects] = await Promise.all([
      Student.countDocuments({ status: "active" }),
      Teacher.countDocuments({ status: "active" }),
      Course.countDocuments({ status: "active" }),
      Subject.countDocuments({ status: "active" }),
    ]);

    return { totalStudents, totalTeachers, totalCourses, totalSubjects };
  }

  async getTeacherStats(teacherId: string) {
    const teacher = await Teacher.findById(teacherId).populate("assignedSubjects");
    if (!teacher) return null;

    return {
      assignedSubjects: teacher.assignedSubjects?.length ?? 0,
    };
  }

  async getStudentStats(studentId: string) {
    const student = await Student.findById(studentId).populate("course").populate("batch");
    return student;
  }
}
