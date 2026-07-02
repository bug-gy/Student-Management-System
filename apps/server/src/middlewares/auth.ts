import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import { ApiError } from "../utils/ApiError.js";

export const auth = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw ApiError.unauthorized("No token provided");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw ApiError.unauthorized("No token provided");
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = { userId: decoded.userId, role: decoded.role as "admin" | "teacher" | "student" };
    next();
  } catch {
    throw ApiError.unauthorized("Invalid or expired token");
  }
};
