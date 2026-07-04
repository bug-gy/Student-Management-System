import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { rbac } from "../middlewares/rbac.js";
import { getAttendanceSummary, getGradeReport, getAuditLog, getEnrollmentStats, getTeacherWorkload } from "../controllers/report.controller.js";

const router = Router();

router.use(auth, rbac("admin"));

router.get("/attendance", getAttendanceSummary);
router.get("/grades", getGradeReport);
router.get("/enrollment", getEnrollmentStats);
router.get("/teacher-workload", getTeacherWorkload);
router.get("/audit-log", getAuditLog);

export default router;
