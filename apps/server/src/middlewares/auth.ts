import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";
import { ApiError } from "../utils/ApiError.js";

export const auth = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(ApiError.unauthorized("No token provided"));
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return next(ApiError.unauthorized("No token provided"));
    }

    const decoded = verifyAccessToken(token);
    req.user = { userId: decoded.userId, role: decoded.role as "admin" | "teacher" | "student" };
    next();
  } catch {
    next(ApiError.unauthorized("Invalid or expired token"));
  }
};
