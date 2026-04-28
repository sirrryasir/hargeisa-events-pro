import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  transactionId: string;
  bookingId: mongoose.Types.ObjectId;
  clientName: string;
  venueName: string;
  amount: number;
  type: "Full Payment" | "Deposit (50%)";
  status: "paid" | "pending" | "failed";
  paymentDate: Date;
}

const paymentSchema = new Schema(
  {
    transactionId: { type: String, required: true, unique: true },
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    clientName: { type: String, required: true },
    venueName: { type: String, required: true },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: ["Full Payment", "Deposit (50%)"],
      required: true,
    },
    status: {
      type: String,
      enum: ["paid", "pending", "failed"],
      default: "pending",
    },
    paymentDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>("Payment", paymentSchema);
