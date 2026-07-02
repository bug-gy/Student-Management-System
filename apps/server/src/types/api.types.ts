import { Role } from "@sms/shared";

export interface JwtPayload {
  userId: string;
  role: Role;
}

export interface AuthenticatedRequest {
  userId: string;
  role: Role;
}
