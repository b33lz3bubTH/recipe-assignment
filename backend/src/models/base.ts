import { Schema, Document, model } from "mongoose";

interface IBaseDocument extends Document {
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  deletedAt: Date | null;
  deletedBy: string | null;
}

const baseSchemaFields = {
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: String, default: "" },
  updatedBy: { type: String, default: "" },
  deletedAt: { type: Date, default: null },
  deletedBy: { type: String, default: null },
};

const baseSchema = new Schema<IBaseDocument>(baseSchemaFields, {
  versionKey: false,
});

// Middleware to automatically update timestamps and user info
baseSchema.pre<IBaseDocument>("save", function (next) {
  this.updatedAt = new Date();
  if (!this.createdAt) {
    this.createdAt = this.updatedAt;
  }
  next();
});

export const BaseModel = model<IBaseDocument>("Base", baseSchema);
export { IBaseDocument, baseSchemaFields };