import { type Request, type Response } from "express";
import Payment from "../models/payment.model.js";
import { asyncHandler, ApiResponse, ApiError } from "../lib/apiUtils.js";

/**
 * @desc    Get all payments
 * @route   GET /api/payments
 */
export const getPayments = asyncHandler(async (req: any, res: Response) => {
  const payments = await Payment.find()
    .populate({
      path: "bookingId",
      select: "user",
    })
    .sort({ createdAt: -1 });

  // Filter for customers
  const data = req.user?.role === "customer"
    ? payments.filter((p: any) => String((p.bookingId as any)?.user || "") === String(req.user._id))
    : payments;

  res.status(200).json(
    new ApiResponse(200, data, "Payments fetched successfully")
  );
});

/**
 * @desc    Create a new payment (Staff only)
 * @route   POST /api/payments
 */
export const createPayment = asyncHandler(async (req: Request, res: Response) => {
  const { transactionId, bookingId, clientName, venueName, amount, type, status } = req.body;

  if (!transactionId || !bookingId || !amount) {
    throw new ApiError(400, "Required payment data missing");
  }

  const payment = await Payment.create({
    transactionId,
    bookingId,
    clientName,
    venueName,
    amount,
    type,
    status: status || "paid",
  });

  res.status(201).json(
    new ApiResponse(201, payment, "Payment recorded successfully")
  );
});
