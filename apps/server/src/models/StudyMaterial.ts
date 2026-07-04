import mongoose, { Schema, Document, Types } from "mongoose";

export interface IStudyMaterial extends Document {
  subject: Types.ObjectId;
  uploadedBy: Types.ObjectId;
  title: string;
  topic?: string;
  week?: number;
  filePath: string;
  fileType: string;
  fileSize: number;
  downloadCount: number;
  status: "active" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const studyMaterialSchema = new Schema<IStudyMaterial>(
  {
    subject: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "teacher", required: true },
    title: { type: String, required: true, trim: true },
    topic: { type: String, trim: true },
    week: { type: Number },
    filePath: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    downloadCount: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "archived"], default: "active" },
  },
  { timestamps: true },
);

studyMaterialSchema.index({ subject: 1, topic: 1 });

export const StudyMaterial = mongoose.model<IStudyMaterial>("StudyMaterial", studyMaterialSchema);
