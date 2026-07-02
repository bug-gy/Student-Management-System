import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { rbac } from "../middlewares/rbac.js";
import { getAttendanceSummary, getGradeReport, getAuditLog } from "../controllers/report.controller.js";

const router = Router();

router.get("/attendance", auth, rbac("admin"), getAttendanceSummary);
router.get("/grades", auth, rbac("admin"), getGradeReport);
router.get("/audit-log", auth, rbac("admin"), getAuditLog);

export default router;
