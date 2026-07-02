import mongoose, { Schema, Document, Types } from "mongoose";
import { AttendanceStatus } from "@sms/shared";

export interface IAttendance extends Document {
  subject: Types.ObjectId;
  date: Date;
  student: Types.ObjectId;
  status: AttendanceStatus;
  takenBy: Types.ObjectId;
}

const attendanceSchema = new Schema<IAttendance>({
  subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
  date: { type: Date, required: true },
  student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  status: { type: String, required: true, enum: ["present", "absent", "late"] },
  takenBy: { type: Schema.Types.ObjectId, ref: "teacher", required: true },
});

attendanceSchema.index({ subject: 1, date: 1, student: 1 }, { unique: true });

export const Attendance = mongoose.model<IAttendance>("Attendance", attendanceSchema);
