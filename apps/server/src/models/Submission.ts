import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISubmission extends Document {
  assignment: Types.ObjectId;
  student: Types.ObjectId;
  filePath: string;
  submittedAt: Date;
  grade?: number;
  feedback?: string;
  status: "submitted" | "graded" | "returned";
}

const submissionSchema = new Schema<ISubmission>({
  assignment: { type: Schema.Types.ObjectId, ref: "Assignment", required: true },
  student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  filePath: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  grade: { type: Number },
  feedback: { type: String },
  status: { type: String, default: "submitted", enum: ["submitted", "graded", "returned"] },
});

submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

export const Submission = mongoose.model<ISubmission>("Submission", submissionSchema);
