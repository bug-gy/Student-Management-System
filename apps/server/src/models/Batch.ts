import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBatch extends Document {
  course: Types.ObjectId;
  year: number;
  section: string;
  label: string;
  createdAt: Date;
  updatedAt: Date;
}

const batchSchema = new Schema<IBatch>(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    year: { type: Number, required: true },
    section: { type: String, required: true, trim: true },
    label: { type: String },
  },
  { timestamps: true },
);

batchSchema.pre("save", function (next) {
  if (this.isModified("course") || this.isModified("year") || this.isModified("section")) {
    this.label = `${this.year}-Section${this.section}`;
  }
  next();
});

batchSchema.index({ course: 1, year: 1, section: 1 }, { unique: true });

export const Batch = mongoose.model<IBatch>("Batch", batchSchema);
