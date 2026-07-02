import { Request, Response, NextFunction } from "express";
import { Role } from "@sms/shared";
import { ApiError } from "../utils/ApiError.js";

export const rbac = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw ApiError.unauthorized("Not authenticated");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw ApiError.forbidden("Insufficient permissions");
    }

    next();
  };
};
