import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { rbac } from "../middlewares/rbac.js";
import { validate } from "../middlewares/validate.js";
import {
  listUsers,
  createUser,
  updateUser,
  deactivateUser,
  resetPassword,
} from "../controllers/admin.controller.js";
import { createUserSchema, updateUserSchema, resetPasswordSchema } from "../validators/user.validator.js";

const router = Router();

router.use(auth, rbac("admin"));

router.get("/users", listUsers);
router.post("/users", validate(createUserSchema), createUser);
router.put("/users/:id", validate(updateUserSchema), updateUser);
router.delete("/users/:id", deactivateUser);
router.post("/users/:id/reset-password", validate(resetPasswordSchema), resetPassword);

export default router;
