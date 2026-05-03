import mongoose, { Schema, Document } from "mongoose";

export interface IVenue extends Document {
  name: string;
  type: "hotel" | "hall";
  address: string;
  capacity: number;
  pricePerDay: number;
  amenities: string[];
  imageUrl: string;
  contactPhone: string;
  description: string;
  manager?: mongoose.Types.ObjectId;
}

const venueSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["hotel", "hall"], required: true },
    address: { type: String, required: true },
    capacity: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    amenities: [{ type: String }],
    imageUrl: { type: String, default: "/venues/default.jpg" },
    images: [{ type: String }],
    contactPhone: { type: String, required: true },
    description: { type: String, trim: true },
    manager: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Venue = mongoose.model<IVenue>("Venue", venueSchema);
