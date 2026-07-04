import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export class EmailService {
  async sendPasswordResetEmail(email: string, resetUrl: string) {
    if (!env.SMTP_USER || !env.SMTP_PASS) {
      console.log(`[DEV] Password reset URL for ${email}: ${resetUrl}`);
      return;
    }
    await transporter.sendMail({
      from: `"SMS" <${env.SMTP_USER}>`,
      to: email,
      subject: "Password Reset - Student Management System",
      html: `
        <p>You requested a password reset.</p>
        <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
        <p>This link expires in 1 hour.</p>
        <p>If you didn't request this, ignore this email.</p>
      `,
    });
  }
}
