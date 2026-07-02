import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

interface TokenPayload {
  userId: string;
  role: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload as object, env.JWT_ACCESS_SECRET, {
    expiresIn: (env.JWT_ACCESS_EXPIRES_IN || "15m") as jwt.SignOptions["expiresIn"],
  });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload as object, env.JWT_REFRESH_SECRET, {
    expiresIn: (env.JWT_REFRESH_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"],
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
};
