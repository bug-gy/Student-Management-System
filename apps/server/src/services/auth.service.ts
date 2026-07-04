import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { PasswordResetToken, generateResetToken } from "../models/PasswordResetToken.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { ApiError } from "../utils/ApiError.js";
import { EmailService } from "./email.service.js";
import { env } from "../config/env.js";

export class AuthService {
  private emailService = new EmailService();
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

  async forgotPassword(email: string) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return;
    }

    const token = generateResetToken();
    await PasswordResetToken.create({
      user: user._id,
      token,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    const resetUrl = `${env.CLIENT_URL}/reset-password/${token}`;
    await this.emailService.sendPasswordResetEmail(email, resetUrl);
  }

  async resetPassword(token: string, password: string) {
    const resetToken = await PasswordResetToken.findOne({ token, used: false, expiresAt: { $gt: new Date() } });
    if (!resetToken) {
      throw ApiError.badRequest("Invalid or expired reset token");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.findByIdAndUpdate(resetToken.user, { password: hashedPassword });
    await PasswordResetToken.findByIdAndUpdate(resetToken._id, { used: true });
  }
}
