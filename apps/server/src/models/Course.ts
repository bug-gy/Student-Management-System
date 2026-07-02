import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
  name: string;
  code: string;
  duration: number;
  description?: string;
  status: "active" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    duration: { type: Number, required: true },
    description: { type: String },
    status: { type: String, default: "active", enum: ["active", "archived"] },
  },
  { timestamps: true },
);

courseSchema.virtual("enrolledStudentCount", {
  ref: "Student",
  localField: "_id",
  foreignField: "course",
  count: true,
});

courseSchema.set("toJSON", { virtuals: true });
courseSchema.set("toObject", { virtuals: true });

export const Course = mongoose.model<ICourse>("Course", courseSchema);
