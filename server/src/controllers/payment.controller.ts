import { type Request, type Response } from "express";
import Payment from "../models/payment.model.js";

export const getPayments = async (req: any, res: Response) => {
  try {
    const payments = await Payment.find().populate("bookingId", "user");
    const data =
      req.user?.role === "customer"
        ? payments.filter((p: any) => String((p.bookingId as any)?.user || "") === String(req.user._id))
        : payments;
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching payments" });
  }
};

export const createPayment = async (req: Request, res: Response) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating payment" });
  }
};
