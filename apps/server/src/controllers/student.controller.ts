import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Subject } from "../models/Subject.js";
import { Student } from "../models/Student.js";
import { StudyMaterial } from "../models/StudyMaterial.js";
import { Assignment } from "../models/Assignment.js";
import { Submission } from "../models/Submission.js";
import { Attendance } from "../models/Attendance.js";
import { Grade } from "../models/Grade.js";
import { FeedbackForm } from "../models/FeedbackForm.js";
import { FeedbackResponse } from "../models/FeedbackResponse.js";
import { Notice } from "../models/Notice.js";

export const getEnrolledSubjects = asyncHandler(async (req: Request, res: Response) => {
  const student = await Student.findById(req.user!.userId).select("course batch").lean();
  if (!student) {
    res.status(404).json(ApiResponse.success(null, "Student not found"));
    return;
  }

  const subjects = await Subject.find({ course: student.course, status: "active" })
    .populate("assignedTeachers", "name")
    .lean();

  res.json(ApiResponse.success(subjects));
});

export const listMaterials = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, unknown> = {};
  if (req.query.subject) filter.subject = req.query.subject;
  if (req.query.topic) filter.topic = req.query.topic;

  const materials = await StudyMaterial.find(filter)
    .populate("uploadedBy", "name")
    .sort({ createdAt: -1 })
    .lean();

  res.json(ApiResponse.success(materials));
});

export const listAssignments = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, unknown> = {};
  if (req.query.status) filter.status = req.query.status;

  const assignments = await Assignment.find(filter).populate("createdBy", "name").sort({ createdAt: -1 }).lean();

  const studentId = req.user!.userId;
  const assignmentsWithStatus = await Promise.all(
    assignments.map(async (a) => {
      const submission = await Submission.findOne({
        assignment: a._id,
        student: studentId,
      }).lean();

      let studentStatus = "pending";
      if (submission) {
        studentStatus = submission.status;
      }
      if (new Date() > a.deadline && !submission) {
        studentStatus = "overdue";
      }

      return { ...a, studentStatus, submission };
    }),
  );

  res.json(ApiResponse.success(assignmentsWithStatus));
});

export const submitAssignment = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json(ApiResponse.success(null, "No file provided"));
    return;
  }

  const existing = await Submission.findOne({
    assignment: req.params.assignmentId,
    student: req.user!.userId,
  });

  if (existing) {
    existing.filePath = req.file.path;
    existing.submittedAt = new Date();
    existing.status = "submitted";
    await existing.save();
    res.json(ApiResponse.success(existing, "Assignment resubmitted"));
    return;
  }

  const submission = await Submission.create({
    assignment: req.params.assignmentId,
    student: req.user!.userId,
    filePath: req.file.path,
  });

  res.status(201).json(ApiResponse.created(submission));
});

export const viewAssignment = asyncHandler(async (req: Request, res: Response) => {
  const assignment = await Assignment.findById(req.params.id).populate("createdBy", "name").lean();
  if (!assignment) {
    res.status(404).json(ApiResponse.success(null, "Assignment not found"));
    return;
  }

  const submission = await Submission.findOne({
    assignment: req.params.id,
    student: req.user!.userId,
  }).lean();

  res.json(ApiResponse.success({ assignment, submission }));
});

export const getMyMarks = asyncHandler(async (req: Request, res: Response) => {
  const grades = await Grade.find({ student: req.user!.userId })
    .populate("subject", "name code")
    .populate("enteredBy", "name")
    .sort({ createdAt: -1 })
    .lean();

  res.json(ApiResponse.success(grades));
});

export const getMyAttendance = asyncHandler(async (req: Request, res: Response) => {
  const studentId = req.user!.userId;
  const records = await Attendance.find({ student: studentId })
    .populate("subject", "name code")
    .sort({ date: -1 })
    .lean();

  const bySubject = records.reduce(
    (acc, r) => {
      const key = (r.subject as unknown as { _id: string; name: string })._id;
      if (!acc[key]) {
        acc[key] = { subject: r.subject, total: 0, present: 0, absent: 0, late: 0 };
      }
      acc[key].total++;
      if (r.status === "present") acc[key].present++;
      if (r.status === "absent") acc[key].absent++;
      if (r.status === "late") acc[key].late++;
      return acc;
    },
    {} as Record<string, { subject: unknown; total: number; present: number; absent: number; late: number }>,
  );

  const summary = Object.values(bySubject).map((s) => ({
    ...s,
    percentage: Math.round(((s.present + s.late) / s.total) * 100),
  }));

  res.json(ApiResponse.success({ records, summary }));
});

export const getNotices = asyncHandler(async (req: Request, res: Response) => {
  const student = await Student.findById(req.user!.userId).lean();
  const now = new Date();

  const notices = await Notice.find({
    publishDate: { $lte: now },
    $or: [
      { "targetAudience.type": "all" },
      { "targetAudience.type": "students" },
      ...(student?.course ? [{ "targetAudience.type": "course", "targetAudience.refId": student.course }] : []),
      ...(student?.batch ? [{ "targetAudience.type": "batch", "targetAudience.refId": student.batch }] : []),
    ],
  })
    .populate("createdBy", "name")
    .sort({ publishDate: -1 })
    .lean();

  res.json(ApiResponse.success(notices));
});

export const getFeedbackForms = asyncHandler(async (req: Request, res: Response) => {
  const now = new Date();
  const forms = await FeedbackForm.find({
    openDate: { $lte: now },
    closeDate: { $gte: now },
  })
    .populate("subject", "name code")
    .populate("targetTeacher", "name")
    .lean();

  const studentSubmissions = await FeedbackResponse.find({
    form: { $in: forms.map((f) => f._id) },
  }).lean();

  const submittedFormIds = new Set(studentSubmissions.map((s) => s.form.toString()));

  const formsWithStatus = forms.map((f) => ({
    ...f,
    isCompleted: submittedFormIds.has(f._id.toString()),
  }));

  res.json(ApiResponse.success(formsWithStatus));
});

import { FeedbackService } from "../services/feedback.service.js";

const feedbackService = new FeedbackService();

export const submitFeedback = asyncHandler(async (req: Request, res: Response) => {
  const result = await feedbackService.submitFeedback(req.params.formId!, req.body.answers!);

  res.status(201).json(ApiResponse.created(result, "Feedback submitted anonymously"));
});
