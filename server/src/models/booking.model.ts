import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  user?: mongoose.Types.ObjectId;
  venue: mongoose.Types.ObjectId;
  clientName: string;
  clientPhone: string;
  eventType: string;
  eventDate: string;
  guestCount: number;
  status: "confirmed" | "pending" | "cancelled" | "rejected";
  notes: string;
  rating?: number;
  feedback?: string;
}

const bookingSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    venue: { type: Schema.Types.ObjectId, ref: "Venue", required: true },
    clientName: { type: String, required: true },
    clientPhone: { type: String, required: true },
    eventType: { type: String, required: true },
    eventDate: { type: String, required: true },
    guestCount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["confirmed", "pending", "cancelled", "rejected"],
      default: "pending",
    },
    notes: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    feedback: { type: String },
  },
  { timestamps: true }
);

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
