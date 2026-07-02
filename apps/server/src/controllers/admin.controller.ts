import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { UserService } from "../services/user.service.js";

const userService = new UserService();

export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.listUsers(req.query as Record<string, string>);
  res.json(ApiResponse.paginated(result.users, result.pagination, "Users fetched"));
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  res.status(201).json(ApiResponse.created(user, "User created"));
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.updateUser(req.params.id!, req.body);
  res.json(ApiResponse.success(user, "User updated"));
});

export const deactivateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.deactivateUser(req.params.id!);
  res.json(ApiResponse.success(user, "User deactivated"));
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const result = await userService.resetPassword(req.params.id!, req.body.newPassword!);
  res.json(ApiResponse.success(result, "Password reset"));
});
