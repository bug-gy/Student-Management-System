import mongoose, { Schema, Document, Types } from "mongoose";
import crypto from "crypto";

export interface IPasswordResetToken extends Document {
  user: Types.ObjectId;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

const passwordResetTokenSchema = new Schema<IPasswordResetToken>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true, index: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PasswordResetToken = mongoose.model<IPasswordResetToken>("PasswordResetToken", passwordResetTokenSchema);

export const generateResetToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};
