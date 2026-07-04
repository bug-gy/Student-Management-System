import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Subject } from "../models/Subject.js";
import { Student } from "../models/Student.js";
import { Teacher } from "../models/Teacher.js";
import { NotificationService } from "../services/notification.service.js";
import { MaterialService } from "../services/material.service.js";
import { AssignmentService } from "../services/assignment.service.js";
import { AttendanceService } from "../services/attendance.service.js";

const materialService = new MaterialService();
const assignmentService = new AssignmentService();
const attendanceService = new AttendanceService();
const notificationService = new NotificationService();
export const getAssignedSubjects = asyncHandler(async (req: Request, res: Response) => {
  const teacher = await Teacher.findById(req.user!.userId)
    .populate({
      path: "assignedSubjects",
      populate: { path: "course", select: "name code" },
    })
    .lean();
  res.json(ApiResponse.success(teacher?.assignedSubjects ?? [], "Assigned subjects fetched"));
});

export const getStudentsBySubject = asyncHandler(async (req: Request, res: Response) => {
  const subject = await Subject.findById(req.params.subjectId).lean();
  if (!subject) {
    res.status(404).json(ApiResponse.success(null, "Subject not found"));
    return;
  }
  const students = await Student.find({ course: subject.course })
    .select("name email rollNumber")
    .lean();
  res.json(ApiResponse.success(students, "Students fetched"));
});

export const listMaterials = asyncHandler(async (req: Request, res: Response) => {
  const result = await materialService.listMaterials(req.query as Record<string, string>);
  res.json(ApiResponse.paginated(result.materials, result.pagination));
});

export const uploadMaterial = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json(ApiResponse.success(null, "No file provided"));
    return;
  }
  const material = await materialService.createMaterial({
    subject: req.body.subject,
    uploadedBy: req.user!.userId,
    title: req.body.title,
    topic: req.body.topic,
    week: req.body.week ? Number(req.body.week) : undefined,
    filePath: req.file.path,
    fileType: req.file.mimetype,
    fileSize: req.file.size,
  });

  const subject = await Subject.findById(req.body.subject).lean();
  if (subject) {
    const students = await Student.find({ course: subject.course }).select("_id").lean();
    const studentIds = students.map((s) => s._id.toString());
    notificationService.createBulk({
      recipients: studentIds,
      type: "material",
      title: "New Study Material",
      message: `${material.title} has been uploaded`,
      link: "/student/materials",
    }).catch(() => {});
  }

  res.status(201).json(ApiResponse.created(material));
});

export const updateMaterial = asyncHandler(async (req: Request, res: Response) => {
  const material = await materialService.updateMaterial(req.params.id!, req.body);
  res.json(ApiResponse.success(material));
});

export const deleteMaterial = asyncHandler(async (req: Request, res: Response) => {
  await materialService.deleteMaterial(req.params.id!);
  res.json(ApiResponse.success(null, "Material archived"));
});

export const restoreMaterial = asyncHandler(async (req: Request, res: Response) => {
  const material = await materialService.restoreMaterial(req.params.id!);
  res.json(ApiResponse.success(material, "Material restored"));
});

export const listAssignments = asyncHandler(async (req: Request, res: Response) => {
  const result = await assignmentService.listAssignments(req.query as Record<string, string>);
  res.json(ApiResponse.paginated(result.assignments, result.pagination));
});

export const createAssignment = asyncHandler(async (req: Request, res: Response) => {
  const assignment = await assignmentService.createAssignment({
    ...req.body,
    createdBy: req.user!.userId,
  });

  const subject = await Subject.findById(req.body.subject).lean();
  if (subject) {
    const students = await Student.find({ course: subject.course }).select("_id").lean();
    const studentIds = students.map((s) => s._id.toString());
    notificationService.createBulk({
      recipients: studentIds,
      type: "assignment",
      title: "New Assignment",
      message: `${assignment.title} has been posted`,
      link: "/student/assignments",
    }).catch(() => {});
  }

  res.status(201).json(ApiResponse.created(assignment));
});

export const updateAssignment = asyncHandler(async (req: Request, res: Response) => {
  const assignment = await assignmentService.updateAssignment(req.params.id!, req.body);
  res.json(ApiResponse.success(assignment));
});

export const getSubmissions = asyncHandler(async (req: Request, res: Response) => {
  const result = await assignmentService.getSubmissions(req.params.id!);
  res.json(ApiResponse.success(result));
});

export const gradeSubmission = asyncHandler(async (req: Request, res: Response) => {
  const submission = await assignmentService.gradeSubmission(
    req.params.submissionId!,
    req.body.grade!,
    req.body.feedback!,
  );
  res.json(ApiResponse.success(submission));
});

export const getAttendance = asyncHandler(async (req: Request, res: Response) => {
  const records = await attendanceService.getAttendance(req.query as Record<string, string>);
  res.json(ApiResponse.success(records));
});

export const markAttendance = asyncHandler(async (req: Request, res: Response) => {
  const result = await attendanceService.markAttendance({
    ...req.body,
    takenBy: req.user!.userId,
  });
  res.json(ApiResponse.success(result));
});

export const getAttendanceReport = asyncHandler(async (req: Request, res: Response) => {
  const report = await attendanceService.getAttendanceReport(
    req.query.subject as string,
    req.query.studentId as string,
  );
  res.json(ApiResponse.success(report));
});

export const getLowAttendance = asyncHandler(async (req: Request, res: Response) => {
  const students = await attendanceService.getLowAttendance(
    req.query.subject as string,
    Number(req.query.threshold) || 75,
  );
  res.json(ApiResponse.success(students));
});
