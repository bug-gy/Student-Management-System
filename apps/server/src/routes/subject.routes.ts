import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { rbac } from "../middlewares/rbac.js";
import { validate } from "../middlewares/validate.js";
import {
  listSubjects,
  createSubject,
  updateSubject,
  archiveSubject,
  assignTeachers,
  removeTeacher,
  getTeachers,
} from "../controllers/subject.controller.js";
import { createSubjectSchema, updateSubjectSchema, assignTeacherSchema } from "../validators/subject.validator.js";

const router = Router();

router.get("/", listSubjects);
router.post("/", auth, rbac("admin"), validate(createSubjectSchema), createSubject);
router.put("/:id", auth, rbac("admin"), validate(updateSubjectSchema), updateSubject);
router.delete("/:id", auth, rbac("admin"), archiveSubject);

router.post("/:id/teachers", auth, rbac("admin"), validate(assignTeacherSchema), assignTeachers);
router.delete("/:id/teachers/:teacherId", auth, rbac("admin"), removeTeacher);
router.get("/:id/teachers", auth, getTeachers);

export default router;
