import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { rbac } from "../middlewares/rbac.js";
import { validate } from "../middlewares/validate.js";
import { upload } from "../middlewares/upload.js";
import { ApiError } from "../utils/ApiError.js";
import {
  getAssignedSubjects,
  getStudentsBySubject,
  listMaterials,
  uploadMaterial,
  updateMaterial,
  deleteMaterial,
  restoreMaterial,
  listAssignments,
  createAssignment,
  updateAssignment,
  getSubmissions,
  gradeSubmission,
  getAttendance,
  markAttendance,
  getAttendanceReport,
  getLowAttendance,
} from "../controllers/teacher.controller.js";
import { getGrades, createMarks, getGradeSummary, updateMark } from "../controllers/grade.controller.js";
import {
  createAssignmentSchema,
  gradeSubmissionSchema,
  createAttendanceSchema,
  createMarksSchema,
} from "../validators/assignment.validator.js";

const router = Router();

router.use(auth, rbac("teacher"));

router.get("/subjects", getAssignedSubjects);
router.get("/subjects/:subjectId/students", getStudentsBySubject);

router.get("/materials", listMaterials);
router.post("/materials", upload.single("file"), (req, _res, next) => {
  if (!req.body.subject) return next(ApiError.badRequest("Subject is required"));
  if (!req.body.title) return next(ApiError.badRequest("Title is required"));
  next();
}, uploadMaterial);
router.put("/materials/:id", updateMaterial);
router.delete("/materials/:id", deleteMaterial);
router.put("/materials/:id/restore", restoreMaterial);

router.get("/assignments", listAssignments);
router.post("/assignments", validate(createAssignmentSchema), createAssignment);
router.put("/assignments/:id", updateAssignment);
router.get("/assignments/:id/submissions", getSubmissions);
router.put("/assignments/:id/submissions/:submissionId/grade", validate(gradeSubmissionSchema), gradeSubmission);

router.get("/attendance", getAttendance);
router.post("/attendance", validate(createAttendanceSchema), markAttendance);
router.get("/attendance/report", getAttendanceReport);
router.get("/attendance/low-attendance", getLowAttendance);

router.get("/marks", getGrades);
router.post("/marks/bulk", validate(createMarksSchema), createMarks);
router.get("/marks/summary", getGradeSummary);
router.put("/marks/:id", updateMark);

export default router;
