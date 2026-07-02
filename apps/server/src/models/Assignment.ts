import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAssignment extends Document {
  subject: Types.ObjectId;
  createdBy: Types.ObjectId;
  title: string;
  description?: string;
  attachment?: string;
  deadline: Date;
  maxMarks: number;
  status: "open" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

const assignmentSchema = new Schema<IAssignment>(
  {
    subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "teacher", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    attachment: { type: String },
    deadline: { type: Date, required: true },
    maxMarks: { type: Number, required: true },
    status: { type: String, default: "open", enum: ["open", "closed"] },
  },
  { timestamps: true },
);

assignmentSchema.index({ subject: 1, status: 1 });

export const Assignment = mongoose.model<IAssignment>("Assignment", assignmentSchema);
