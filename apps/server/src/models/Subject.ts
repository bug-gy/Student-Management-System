import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISubject extends Document {
  name: string;
  code: string;
  course: Types.ObjectId;
  semester: number;
  creditHours?: number;
  assignedTeachers: Types.ObjectId[];
  status: "active" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const subjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    semester: { type: Number, required: true },
    creditHours: { type: Number },
    assignedTeachers: [{ type: Schema.Types.ObjectId, ref: "teacher" }],
    status: { type: String, default: "active", enum: ["active", "archived"] },
  },
  { timestamps: true },
);

subjectSchema.index({ course: 1, semester: 1 });
subjectSchema.index({ code: 1, course: 1 }, { unique: true });

export const Subject = mongoose.model<ISubject>("Subject", subjectSchema);
