import mongoose, { Schema, Document } from "mongoose";
import { Role, UserStatus } from "@sms/shared";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  status: UserStatus;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, required: true, enum: ["admin", "teacher", "student"] },
    status: { type: String, default: "active", enum: ["active", "inactive"] },
    profilePicture: { type: String },
  },
  { timestamps: true, discriminatorKey: "role" },
);

userSchema.set("toJSON", {
  transform(_doc, ret) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = ret;
    return rest;
  },
});

export const User = mongoose.model<IUser>("User", userSchema);
