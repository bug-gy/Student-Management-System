import mongoose, { Schema, Document, Types } from "mongoose";
import { NoticePriority } from "@sms/shared";

export interface INotice extends Document {
  title: string;
  description: string;
  attachment?: string;
  targetAudience: {
    type: "all" | "students" | "teachers" | "course" | "batch";
    refId?: Types.ObjectId;
  };
  priority: NoticePriority;
  publishDate: Date;
  expiryDate?: Date;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const noticeSchema = new Schema<INotice>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    attachment: { type: String },
    targetAudience: {
      type: { type: String, required: true, enum: ["all", "students", "teachers", "course", "batch"] },
      refId: { type: Schema.Types.ObjectId },
    },
    priority: { type: String, default: "normal", enum: ["normal", "urgent"] },
    publishDate: { type: Date, default: Date.now },
    expiryDate: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
  },
  { timestamps: true },
);

noticeSchema.index({ targetAudience: 1 });
noticeSchema.index({ publishDate: -1 });

export const Notice = mongoose.model<INotice>("Notice", noticeSchema);
