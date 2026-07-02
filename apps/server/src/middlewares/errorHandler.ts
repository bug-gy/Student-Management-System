import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      data: null,
      message: err.message,
      errors: err.errors.length > 0 ? err.errors : undefined,
    });
    return;
  }

  if (err.name === "ValidationError") {
    res.status(400).json({
      success: false,
      data: null,
      message: "Validation error",
    });
    return;
  }

  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    data: null,
    message: "Internal server error",
  });
};
