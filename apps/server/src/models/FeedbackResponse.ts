import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAnswer {
  questionText: string;
  type: "rating" | "multiple_choice" | "text";
  value: string | number;
}

export interface IFeedbackResponse extends Document {
  form: Types.ObjectId;
  answers: IAnswer[];
  submittedAt: Date;
}

const answerSchema = new Schema<IAnswer>(
  {
    questionText: { type: String, required: true },
    type: { type: String, required: true, enum: ["rating", "multiple_choice", "text"] },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false },
);

const feedbackResponseSchema = new Schema<IFeedbackResponse>({
  form: { type: Schema.Types.ObjectId, ref: "FeedbackForm", required: true },
  answers: { type: [answerSchema], required: true },
  submittedAt: { type: Date, default: Date.now },
});

feedbackResponseSchema.index({ form: 1 });

export const FeedbackResponse = mongoose.model<IFeedbackResponse>("FeedbackResponse", feedbackResponseSchema);
