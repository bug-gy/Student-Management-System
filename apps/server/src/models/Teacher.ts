import { Schema, Types } from "mongoose";
import { User, IUser } from "./User.js";

export interface ITeacher extends IUser {
  bio?: string;
  contact?: string;
  assignedSubjects: Types.ObjectId[];
}

const teacherSchema = new Schema<ITeacher>({
  bio: { type: String, maxlength: 500 },
  contact: { type: String },
  assignedSubjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
});

export const Teacher = User.discriminator<ITeacher>("teacher", teacherSchema);
