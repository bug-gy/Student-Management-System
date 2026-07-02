import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { rbac } from "../middlewares/rbac.js";
import {
  getAdminDashboard,
  getTeacherDashboard,
  getStudentDashboard,
} from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/admin", auth, rbac("admin"), getAdminDashboard);
router.get("/teacher", auth, rbac("teacher"), getTeacherDashboard);
router.get("/student", auth, rbac("student"), getStudentDashboard);

export default router;
