import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { rbac } from "../middlewares/rbac.js";
import { listForms, createForm, getResults, exportResults } from "../controllers/feedback.controller.js";

const router = Router();

router.get("/", listForms);
router.post("/", auth, rbac("admin"), createForm);
router.get("/:id/results", auth, rbac("admin"), getResults);
router.get("/:id/export", auth, rbac("admin"), exportResults);

export default router;
