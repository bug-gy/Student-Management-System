import { Assignment } from "../models/Assignment.js";
import { Submission } from "../models/Submission.js";
import { ApiError } from "../utils/ApiError.js";
import { parsePagination, getPaginationMeta } from "../utils/pagination.js";

export class AssignmentService {
  async listAssignments(query: { subject?: string; status?: string; page?: string; limit?: string }) {
    const { skip, page, limit } = parsePagination(query);
    const filter: Record<string, unknown> = {};
    if (query.subject) filter.subject = query.subject;
    if (query.status) filter.status = query.status;

    const [assignments, total] = await Promise.all([
      Assignment.find(filter)
        .populate("createdBy", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Assignment.countDocuments(filter),
    ]);

    return { assignments, pagination: getPaginationMeta(total, page, limit) };
  }

  async createAssignment(data: {
    subject: string;
    createdBy: string;
    title: string;
    description?: string;
    deadline: string;
    maxMarks: number;
  }) {
    return Assignment.create({ ...data, deadline: new Date(data.deadline) });
  }

  async updateAssignment(id: string, data: Record<string, unknown>) {
    if (data.deadline) {
      data.deadline = new Date(data.deadline as string) as unknown as string;
    }
    const assignment = await Assignment.findByIdAndUpdate(id, data, { new: true });
    if (!assignment) throw ApiError.notFound("Assignment not found");
    return assignment;
  }

  async getSubmissions(assignmentId: string) {
    const submissions = await Submission.find({ assignment: assignmentId })
      .populate("student", "name email rollNumber")
      .sort({ submittedAt: -1 })
      .lean();

    const allStudents = await import("../models/Student.js").then((m: typeof import("../models/Student.js")) =>
      m.Student.find({}).select("_id name email").lean(),
    );

    const submittedIds = submissions.map((s) => s.student._id.toString());
    const notSubmitted = allStudents.filter(
      (s: { _id: { toString: () => string } }) => !submittedIds.includes(s._id.toString()),
    );

    return { submissions, notSubmitted };
  }

  async gradeSubmission(submissionId: string, grade: number, feedback?: string) {
    const submission = await Submission.findByIdAndUpdate(
      submissionId,
      { grade, feedback, status: "graded" },
      { new: true },
    );
    if (!submission) throw ApiError.notFound("Submission not found");
    return submission;
  }
}
