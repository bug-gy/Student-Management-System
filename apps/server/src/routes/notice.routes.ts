import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { rbac } from "../middlewares/rbac.js";
import { validate } from "../middlewares/validate.js";
import { listNotices, createNotice, updateNotice, deleteNotice, restoreNotice } from "../controllers/notice.controller.js";
import { createNoticeSchema, updateNoticeSchema } from "../validators/notice.validator.js";

const router = Router();

router.get("/", listNotices);
router.post("/", auth, rbac("admin"), validate(createNoticeSchema), createNotice);
router.put("/:id", auth, rbac("admin"), validate(updateNoticeSchema), updateNotice);
router.delete("/:id", auth, rbac("admin"), deleteNotice);
router.put("/:id/restore", auth, rbac("admin"), restoreNotice);

export default router;
