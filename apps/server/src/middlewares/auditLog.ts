import { Request, Response, NextFunction } from "express";
import { AuditLog } from "../models/AuditLog.js";

interface AuditAction {
  action: "create" | "update" | "delete";
  targetType: string;
  targetId: string;
  oldValue?: unknown;
  newValue?: unknown;
  reason?: string;
}

export const recordAudit = (details: AuditAction) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await AuditLog.create({
        actor: req.user?.userId,
        ...details,
      });
    } catch (error) {
      console.error("Audit log error:", error);
    }
    next();
  };
};
