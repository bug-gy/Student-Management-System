import { Router } from "express";
import { login, logout, refresh, getMe } from "../controllers/auth.controller.js";
import { auth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { loginSchema } from "../validators/auth.validator.js";

const router = Router();

router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.get("/me", auth, getMe);

export default router;
