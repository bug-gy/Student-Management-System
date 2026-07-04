import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { rbac } from "../middlewares/rbac.js";
import { validate } from "../middlewares/validate.js";
import { listForms, createForm, updateForm, archiveForm, restoreForm, getResults, exportResults } from "../controllers/feedback.controller.js";
import { createFeedbackSchema, updateFeedbackSchema } from "../validators/feedback.validator.js";

const router = Router();

router.get("/", listForms);
router.post("/", auth, rbac("admin"), validate(createFeedbackSchema), createForm);
router.put("/:id", auth, rbac("admin"), validate(updateFeedbackSchema), updateForm);
router.delete("/:id", auth, rbac("admin"), archiveForm);
router.put("/:id/restore", auth, rbac("admin"), restoreForm);
router.get("/:id/results", auth, rbac("admin"), getResults);
router.get("/:id/export", auth, rbac("admin"), exportResults);

export default router;
