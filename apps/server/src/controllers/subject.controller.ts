import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { SubjectService } from "../services/subject.service.js";

const subjectService = new SubjectService();

export const listSubjects = asyncHandler(async (req: Request, res: Response) => {
  const result = await subjectService.listSubjects(req.query as Record<string, string>);
  res.json(ApiResponse.paginated(result.subjects, result.pagination, "Subjects fetched"));
});

export const createSubject = asyncHandler(async (req: Request, res: Response) => {
  const subject = await subjectService.createSubject(req.body);
  res.status(201).json(ApiResponse.created(subject, "Subject created"));
});

export const updateSubject = asyncHandler(async (req: Request, res: Response) => {
  const subject = await subjectService.updateSubject(req.params.id!, req.body);
  res.json(ApiResponse.success(subject, "Subject updated"));
});

export const archiveSubject = asyncHandler(async (req: Request, res: Response) => {
  const subject = await subjectService.archiveSubject(req.params.id!);
  res.json(ApiResponse.success(subject, "Subject archived"));
});

export const restoreSubject = asyncHandler(async (req: Request, res: Response) => {
  const subject = await subjectService.restoreSubject(req.params.id!);
  res.json(ApiResponse.success(subject, "Subject restored"));
});

export const assignTeachers = asyncHandler(async (req: Request, res: Response) => {
  const subject = await subjectService.assignTeachers(req.params.id!, req.body.teacherIds!);
  res.json(ApiResponse.success(subject, "Teachers assigned"));
});

export const removeTeacher = asyncHandler(async (req: Request, res: Response) => {
  const subject = await subjectService.removeTeacher(req.params.id!, req.params.teacherId!);
  res.json(ApiResponse.success(subject, "Teacher removed"));
});

export const getTeachers = asyncHandler(async (req: Request, res: Response) => {
  const teachers = await subjectService.getTeachers(req.params.id!);
  res.json(ApiResponse.success(teachers, "Teachers fetched"));
});
