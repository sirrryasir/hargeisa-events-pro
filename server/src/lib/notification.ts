import { Notification } from "../models/notification.model.js";
import { sendNotification as emitSocketNotification } from "./socket.js";

export const createNotification = async (recipientId: string, data: { title: string, message: string, type?: "booking" | "payment" | "system", link?: string }) => {
  const notification = await Notification.create({
    recipient: recipientId,
    ...data
  });

  emitSocketNotification(recipientId, notification);
  return notification;
};
