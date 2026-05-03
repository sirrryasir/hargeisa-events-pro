import mongoose, { Schema, Document } from "mongoose";

export interface IVendor extends Document {
  name: string;
  type: string;
  rating: number;
  projects: number;
  status: "available" | "busy";
  contactEmail: string;
  contactPhone: string;
  contactPerson: string;
  description: string;
  owner: mongoose.Types.ObjectId;
}

const vendorSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    rating: { type: Number, default: 0 },
    projects: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["available", "busy"],
      default: "available",
    },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    contactPerson: { type: String },
    description: { type: String },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IVendor>("Vendor", vendorSchema);
