import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { ApiError } from "../utils/ApiError.js";

export class AuthService {
  async login(email: string, password: string) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw ApiError.unauthorized("Invalid credentials");
    }

    if (user.status === "inactive") {
      throw ApiError.forbidden("Account is deactivated");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw ApiError.unauthorized("Invalid credentials");
    }

    const payload = { userId: user._id.toString(), role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    };
  }

  async refresh(token: string) {
    try {
      const decoded = verifyRefreshToken(token);
      const user = await User.findById(decoded.userId);

      if (!user || user.status === "inactive") {
        throw ApiError.unauthorized("Invalid refresh token");
      }

      const payload = { userId: user._id.toString(), role: user.role };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      return { accessToken, refreshToken };
    } catch {
      throw ApiError.unauthorized("Invalid or expired refresh token");
    }
  }

  async getProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound("User not found");
    }
    return user.toJSON();
  }
}
