import { type Request, type Response } from "express";
import Payment from "../models/payment.model.js";
import { asyncHandler, ApiResponse, ApiError } from "../lib/apiUtils.js";
import { createNotification } from "../lib/notification.js";
import { Booking } from "../models/booking.model.js";

/**
 * @desc    Get all payments
 * @route   GET /api/payments
 */
export const getPayments = asyncHandler(async (req: any, res: Response) => {
  const payments = await Payment.find()
    .populate({
      path: "bookingId",
      select: "user venue",
      populate: { path: "venue", select: "manager" }
    })
    .sort({ createdAt: -1 });

  let data = payments;
  
  if (req.user?.role === "vendor") {
    return res.status(403).json(new ApiResponse(403, [], "Forbidden: Vendors cannot view the financial ledger"));
  } else if (req.user?.role === "customer") {
    data = payments.filter((p: any) => String((p.bookingId as any)?.user || "") === String(req.user._id));
  } else if (req.user?.role === "manager") {
    data = payments.filter((p: any) => {
      const venueManager = (p.bookingId as any)?.venue?.manager;
      return String(venueManager || "") === String(req.user._id);
    });
  }

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
  
  // Notify Customer
  const booking = await Booking.findById(bookingId);
  if (booking && booking.user) {
    await createNotification(booking.user.toString(), {
      title: "Payment Received",
      message: `Your payment of $${amount} for ${venueName || "your booking"} has been recorded.`,
      type: "payment",
      link: "/dashboard/payments"
    });
  }

  res.status(201).json(
    new ApiResponse(201, payment, "Payment recorded successfully")
  );
});
