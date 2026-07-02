import { Router } from "express";
import authRoutes from "./auth.routes.js";
import adminRoutes from "./admin.routes.js";
import courseRoutes from "./course.routes.js";
import subjectRoutes from "./subject.routes.js";
import teacherRoutes from "./teacher.routes.js";
import studentRoutes from "./student.routes.js";
import noticeRoutes from "./notice.routes.js";
import feedbackRoutes from "./feedback.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import reportRoutes from "./report.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/courses", courseRoutes);
router.use("/subjects", subjectRoutes);
router.use("/teacher", teacherRoutes);
router.use("/student", studentRoutes);
router.use("/notices", noticeRoutes);
router.use("/feedback", feedbackRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/reports", reportRoutes);

export { router as routes };
