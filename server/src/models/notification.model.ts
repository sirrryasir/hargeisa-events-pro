import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ["booking", "payment", "system"],
    default: "system"
  },
  read: { type: Boolean, default: false },
  link: { type: String }
}, { timestamps: true });

export const Notification = mongoose.model("Notification", notificationSchema);
