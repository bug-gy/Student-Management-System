import { Request, Response, NextFunction } from "express";
import { Role } from "@sms/shared";
import { ApiError } from "../utils/ApiError.js";

export const rbac = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized("Not authenticated"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden("Insufficient permissions"));
    }

    next();
  };
};
