import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { rbac } from "../middlewares/rbac.js";
import { validate } from "../middlewares/validate.js";
import { listBatches, createBatch, updateBatch, deleteBatch, restoreBatch } from "../controllers/batch.controller.js";
import { createBatchSchema, updateBatchSchema } from "../validators/batch.validator.js";

const router = Router();

router.get("/", listBatches);
router.post("/", auth, rbac("admin"), validate(createBatchSchema), createBatch);
router.put("/:id", auth, rbac("admin"), validate(updateBatchSchema), updateBatch);
router.delete("/:id", auth, rbac("admin"), deleteBatch);
router.put("/:id/restore", auth, rbac("admin"), restoreBatch);

export default router;
