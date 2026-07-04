import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AuthService } from "../services/auth.service.js";

const authService = new AuthService();

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/api/auth",
};

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);

  res.cookie("refreshToken", result.refreshToken, REFRESH_COOKIE_OPTIONS);
  res.json(ApiResponse.success({ user: result.user, accessToken: result.accessToken }, "Login successful"));
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie("refreshToken", { path: "/api/auth" });
  res.json(ApiResponse.success(null, "Logged out"));
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    res.status(401).json(ApiResponse.success(null, "No refresh token"));
    return;
  }

  const result = await authService.refresh(token);
  res.cookie("refreshToken", result.refreshToken, REFRESH_COOKIE_OPTIONS);
  res.json(ApiResponse.success({ accessToken: result.accessToken }, "Token refreshed"));
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getProfile(req.user!.userId);
  res.json(ApiResponse.success(user, "Profile fetched"));
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  await authService.forgotPassword(email);
  res.json(ApiResponse.success(null, "If the email exists, a reset link has been sent"));
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body;
  await authService.resetPassword(token, password);
  res.json(ApiResponse.success(null, "Password reset successful"));
});
