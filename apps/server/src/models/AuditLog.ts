import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAuditLog extends Document {
  actor: Types.ObjectId;
  action: "create" | "update" | "delete";
  targetType: string;
  targetId: Types.ObjectId;
  oldValue?: unknown;
  newValue?: unknown;
  reason?: string;
  timestamp: Date;
}

const auditLogSchema = new Schema<IAuditLog>({
  actor: { type: Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true, enum: ["create", "update", "delete"] },
  targetType: { type: String, required: true },
  targetId: { type: Schema.Types.ObjectId, required: true },
  oldValue: { type: Schema.Types.Mixed },
  newValue: { type: Schema.Types.Mixed },
  reason: { type: String },
  timestamp: { type: Date, default: Date.now },
});

auditLogSchema.index({ targetType: 1, targetId: 1 });
auditLogSchema.index({ actor: 1 });
auditLogSchema.index({ timestamp: -1 });

export const AuditLog = mongoose.model<IAuditLog>("AuditLog", auditLogSchema);
