import mongoose, { Schema, Document, Types } from "mongoose";

export interface IQuestion {
  questionText: string;
  type: "rating" | "multiple_choice" | "text";
  options?: string[];
}

export interface IFeedbackForm extends Document {
  title: string;
  subject?: Types.ObjectId;
  targetTeacher?: Types.ObjectId;
  questions: IQuestion[];
  openDate: Date;
  closeDate: Date;
  createdBy: Types.ObjectId;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>(
  {
    questionText: { type: String, required: true },
    type: { type: String, required: true, enum: ["rating", "multiple_choice", "text"] },
    options: [{ type: String }],
  },
  { _id: false },
);

const feedbackFormSchema = new Schema<IFeedbackForm>(
  {
    title: { type: String, required: true },
    subject: { type: Schema.Types.ObjectId, ref: "Subject" },
    targetTeacher: { type: Schema.Types.ObjectId, ref: "teacher" },
    questions: { type: [questionSchema], required: true },
    openDate: { type: Date, required: true },
    closeDate: { type: Date, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const FeedbackForm = mongoose.model<IFeedbackForm>("FeedbackForm", feedbackFormSchema);
