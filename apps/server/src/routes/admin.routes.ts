import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { rbac } from "../middlewares/rbac.js";
import { validate } from "../middlewares/validate.js";
import { recordAudit } from "../middlewares/auditLog.js";
import {
  listUsers,
  createUser,
  updateUser,
  deactivateUser,
  resetPassword,
  bulkCreateUsers,
} from "../controllers/admin.controller.js";
import { createUserSchema, updateUserSchema, resetPasswordSchema } from "../validators/user.validator.js";

const router = Router();

router.use(auth, rbac("admin"));

router.get("/users", listUsers);
router.post("/users", validate(createUserSchema), recordAudit({ action: "create", targetType: "User", targetId: "new" }), createUser);
router.put("/users/:id", validate(updateUserSchema), recordAudit({ action: "update", targetType: "User", targetId: ":id" }), updateUser);
router.delete("/users/:id", recordAudit({ action: "delete", targetType: "User", targetId: ":id" }), deactivateUser);
router.post("/users/:id/reset-password", validate(resetPasswordSchema), recordAudit({ action: "update", targetType: "User", targetId: ":id" }), resetPassword);
router.post("/users/bulk", recordAudit({ action: "create", targetType: "User", targetId: "bulk" }), bulkCreateUsers);

export default router;
