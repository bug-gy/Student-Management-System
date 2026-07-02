import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { CourseService } from "../services/course.service.js";

const courseService = new CourseService();

export const listCourses = asyncHandler(async (req: Request, res: Response) => {
  const result = await courseService.listCourses(req.query as Record<string, string>);
  res.json(ApiResponse.paginated(result.courses, result.pagination, "Courses fetched"));
});

export const createCourse = asyncHandler(async (req: Request, res: Response) => {
  const course = await courseService.createCourse(req.body);
  res.status(201).json(ApiResponse.created(course, "Course created"));
});

export const updateCourse = asyncHandler(async (req: Request, res: Response) => {
  const course = await courseService.updateCourse(req.params.id!, req.body);
  res.json(ApiResponse.success(course, "Course updated"));
});

export const archiveCourse = asyncHandler(async (req: Request, res: Response) => {
  const course = await courseService.archiveCourse(req.params.id!);
  res.json(ApiResponse.success(course, "Course archived"));
});
