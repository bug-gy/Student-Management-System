import mongoose, { Schema, Document, Types } from "mongoose";

export interface IGrade extends Document {
  subject: Types.ObjectId;
  student: Types.ObjectId;
  examType: string;
  score: number;
  maxScore: number;
  enteredBy: Types.ObjectId;
  remark?: string;
  createdAt: Date;
  updatedAt: Date;
}

const gradeSchema = new Schema<IGrade>(
  {
    subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    examType: { type: String, required: true },
    score: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    enteredBy: { type: Schema.Types.ObjectId, ref: "teacher", required: true },
    remark: { type: String },
  },
  { timestamps: true },
);

gradeSchema.index({ subject: 1, student: 1, examType: 1 }, { unique: true });

export const Grade = mongoose.model<IGrade>("Grade", gradeSchema);
