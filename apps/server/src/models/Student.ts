import { Schema, Types } from "mongoose";
import { User, IUser } from "./User.js";

export interface IStudent extends IUser {
  course?: Types.ObjectId;
  batch?: Types.ObjectId;
  enrollmentDate: Date;
  rollNumber?: string;
}

const studentSchema = new Schema<IStudent>({
  course: { type: Schema.Types.ObjectId, ref: "Course" },
  batch: { type: Schema.Types.ObjectId, ref: "Batch" },
  enrollmentDate: { type: Date, required: true },
  rollNumber: { type: String, unique: true, sparse: true },
});

export const Student = User.discriminator<IStudent>("student", studentSchema);
