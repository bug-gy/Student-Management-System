import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { rbac } from "../middlewares/rbac.js";
import { listNotices, createNotice, updateNotice, deleteNotice } from "../controllers/notice.controller.js";

const router = Router();

router.get("/", listNotices);
router.post("/", auth, rbac("admin"), createNotice);
router.put("/:id", auth, rbac("admin"), updateNotice);
router.delete("/:id", auth, rbac("admin"), deleteNotice);

export default router;
