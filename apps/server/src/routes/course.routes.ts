import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { rbac } from "../middlewares/rbac.js";
import { validate } from "../middlewares/validate.js";
import { listCourses, createCourse, updateCourse, archiveCourse, restoreCourse } from "../controllers/course.controller.js";
import { createCourseSchema, updateCourseSchema } from "../validators/course.validator.js";

const router = Router();

router.get("/", listCourses);
router.post("/", auth, rbac("admin"), validate(createCourseSchema), createCourse);
router.put("/:id", auth, rbac("admin"), validate(updateCourseSchema), updateCourse);
router.delete("/:id", auth, rbac("admin"), archiveCourse);
router.put("/:id/restore", auth, rbac("admin"), restoreCourse);

export default router;
