import { Router } from "express";
import { login, logout, refresh, getMe, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import { auth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { loginSchema, forgotPasswordSchema, resetPasswordSchema } from "../validators/auth.validator.js";
import { loginLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

router.post("/login", loginLimiter, validate(loginSchema), login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.get("/me", auth, getMe);
router.post("/forgot-password", loginLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", loginLimiter, validate(resetPasswordSchema), resetPassword);

export default router;
