import { type Request, type Response } from "express";
import { Booking } from "../models/booking.model.js";
import { asyncHandler, ApiResponse, ApiError } from "../lib/apiUtils.js";

/**
 * @desc    Get all bookings
 * @route   GET /api/bookings
 * @access  Private/Admin
 */
export const getBookings = asyncHandler(async (req: any, res: Response) => {
  let query = {};
  
  // Customers only see their own bookings; admin/manager can see all.
  if (req.user && req.user.role === "customer") {
    query = { user: req.user._id };
  }

  const bookings = await Booking.find(query).populate("venue", "name type address");
  return res.status(200).json(new ApiResponse(200, bookings, "Bookings fetched successfully"));
});

/**
 * @desc    Create a new booking
 * @route   POST /api/bookings
 * @access  Public/Private
 */
export const createBooking = asyncHandler(async (req: any, res: Response) => {
  const { venue, clientName, clientPhone, eventDate, guestCount } = req.body;

  if (!venue || !clientName || !clientPhone || !eventDate || !guestCount) {
    throw new ApiError(400, "Required fields are missing");
  }

  // If user is logged in, associate booking with them
  const bookingData = {
    ...req.body,
    user: req.user ? req.user._id : undefined
  };

  const booking = await Booking.create(bookingData);
  return res.status(201).json(new ApiResponse(201, booking, "Booking request sent successfully"));
});

/**
 * @desc    Update booking status
 * @route   PATCH /api/bookings/:id
 * @access  Private/Admin
 */
export const updateBookingStatus = asyncHandler(async (req: any, res: Response) => {
  const { status, rating, feedback } = req.body;
  const updateData: { status?: string; rating?: number; feedback?: string } = {};

  const existingBooking = await Booking.findById(req.params.id);
  if (!existingBooking) {
    throw new ApiError(404, "Booking not found");
  }

  const isCustomer = req.user?.role === "customer";
  const isManagerOrAdmin = ["admin", "manager"].includes(req.user?.role);

  if (isCustomer) {
    if (String(existingBooking.user || "") !== String(req.user._id)) {
      throw new ApiError(403, "Forbidden: cannot modify other users' bookings");
    }
    if (typeof status !== "undefined") {
      throw new ApiError(403, "Forbidden: customers cannot change booking status");
    }
    if (typeof rating !== "undefined") updateData.rating = rating;
    if (typeof feedback !== "undefined") updateData.feedback = feedback;
  } else if (isManagerOrAdmin) {
    if (typeof status !== "undefined") updateData.status = status;
    if (typeof rating !== "undefined") updateData.rating = rating;
    if (typeof feedback !== "undefined") updateData.feedback = feedback;
  } else {
    throw new ApiError(403, "Forbidden: insufficient permissions");
  }

  const booking = await Booking.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  return res.status(200).json(new ApiResponse(200, booking, "Booking updated successfully"));
});
