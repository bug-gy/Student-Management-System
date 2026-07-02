import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { rbac } from "../middlewares/rbac.js";
import { upload } from "../middlewares/upload.js";
import {
  getEnrolledSubjects,
  listMaterials,
  listAssignments,
  submitAssignment,
  viewAssignment,
  getMyMarks,
  getMyAttendance,
  getNotices,
  getFeedbackForms,
  submitFeedback,
} from "../controllers/student.controller.js";

const router = Router();

router.use(auth, rbac("student"));

router.get("/subjects", getEnrolledSubjects);
router.get("/materials", listMaterials);
router.get("/assignments", listAssignments);
router.post("/assignments/:assignmentId/submit", upload.single("file"), submitAssignment);
router.get("/assignments/:id", viewAssignment);
router.get("/marks", getMyMarks);
router.get("/attendance", getMyAttendance);
router.get("/notices", getNotices);
router.get("/feedback", getFeedbackForms);
router.post("/feedback/:formId/submit", submitFeedback);

export default router;
