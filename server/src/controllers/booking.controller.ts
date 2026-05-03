import { type Request, type Response } from "express";
import { Booking } from "../models/booking.model.js";
import { Venue } from "../models/venue.model.js";
import Vendor from "../models/vendor.model.js";
import Payment from "../models/payment.model.js";
import { asyncHandler, ApiResponse, ApiError } from "../lib/apiUtils.js";
import { sendEmail, getBookingConfirmationTemplate } from "../lib/email.js";
import { createNotification } from "../lib/notification.js";
import { User } from "../models/user.model.js";

/**
 * @desc    Get all bookings
 * @route   GET /api/bookings
 * @access  Private/Admin
 */
export const getBookings = asyncHandler(async (req: any, res: Response) => {
  let query: any = {};
  
  if (req.user && req.user.role === "vendor") {
    const vendorProfile = await Vendor.findOne({ owner: req.user._id });
    if (vendorProfile) {
      query = { vendor: vendorProfile._id };
    } else {
      return res.status(403).json(new ApiResponse(403, [], "Forbidden: Vendor profile not found"));
    }
  } else if (req.user && req.user.role === "customer") {
    query = { user: req.user._id };
  } else if (req.user && req.user.role === "manager") {
    const managedVenues = await Venue.find({ manager: req.user._id });
    const managedVenueIds = managedVenues.map(v => v._id);
    query = { venue: { $in: managedVenueIds } };
  } else if (req.user && req.user.role === "admin") {
    query = {}; 
  }

  const bookings = await Booking.find(query)
    .populate("venue", "name type address images")
    .populate("vendor", "name type")
    .populate("user", "email name");
  return res.status(200).json(new ApiResponse(200, bookings, "Bookings fetched successfully"));
});

export const getPublicBookings = asyncHandler(async (req: Request, res: Response) => {
  const allBookings = await Booking.find({
    status: { $in: ["confirmed", "pending"] }
  })
  .populate("venue", "name type address")
  .select("eventDate venue status clientName");

  const sanitizedBookings = allBookings.map(b => ({
    _id: b._id,
    venue: b.venue,
    eventDate: b.eventDate,
    status: b.status,
    clientName: "Occupied",
    isAnonymized: true
  }));

  return res.status(200).json(new ApiResponse(200, sanitizedBookings, "Public availability data fetched"));
});

/**
 * @desc    Create a new booking
 * @route   POST /api/bookings
 * @access  Public/Private
 */
export const createBooking = asyncHandler(async (req: any, res: Response) => {
  const { venue, vendor, clientName, clientPhone, eventDate, guestCount } = req.body;

  if ((!venue && !vendor) || !clientName || !clientPhone || !eventDate || !guestCount) {
    throw new ApiError(400, "Required fields are missing");
  }

  // Only customers can create bookings
  if (req.user && req.user.role !== "customer") {
    throw new ApiError(403, "Forbidden: only customers can create bookings");
  }

  // Prevent double booking of the same venue on the same date
  if (venue) {
    const inputDate = new Date(eventDate);
    const startOfDay = new Date(inputDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(inputDate.setHours(23, 59, 59, 999));

    const existingBooking = await Booking.findOne({
      venue,
      eventDate: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: { $in: ["confirmed", "pending"] }
    });

    if (existingBooking) {
      throw new ApiError(400, "This venue is already booked or has a pending request for the selected date");
    }
  }

  // If user is logged in, associate booking with them
  const bookingData = {
    ...req.body,
    user: req.user ? req.user._id : undefined
  };

  const booking = await Booking.create(bookingData);

  // Notify Manager/Admin
  if (venue) {
    const venueDoc = await Venue.findById(venue);
    if (venueDoc && venueDoc.manager) {
      await createNotification(venueDoc.manager.toString(), {
        title: "New Booking Request",
        message: `You have a new booking request for ${venueDoc.name} on ${eventDate}.`,
        type: "booking",
        link: "/dashboard/bookings"
      });
    }
  } else if (vendor) {
    const vendorDoc = await Vendor.findById(vendor);
    if (vendorDoc && vendorDoc.owner) {
      await createNotification(vendorDoc.owner.toString(), {
        title: "New Service Request",
        message: `You have a new service request from ${clientName} on ${eventDate}.`,
        type: "booking",
        link: "/dashboard/bookings"
      });
    }
  }

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

  const existingBooking = await Booking.findById(req.params.id).populate("venue");
  if (!existingBooking) {
    throw new ApiError(404, "Booking not found");
  }

  const isCustomer = req.user?.role === "customer";
  const isManagerOrAdminOrVendor = ["admin", "manager", "vendor"].includes(req.user?.role);

  if (isCustomer) {
    if (String(existingBooking.user || "") !== String(req.user._id)) {
      throw new ApiError(403, "Forbidden: cannot modify other users' bookings");
    }
    
    // Customers can ONLY change status to "cancelled"
    if (typeof status !== "undefined") {
      if (status === "cancelled") {
        updateData.status = "cancelled";
        
        // Notify manager if it's a venue booking
        const venue: any = existingBooking.venue;
        if (venue && venue.manager) {
          await createNotification(venue.manager.toString(), {
            title: "Booking Cancelled",
            message: `The booking for ${venue.name} on ${new Date(existingBooking.eventDate).toLocaleDateString()} has been cancelled by the customer.`,
            type: "booking",
            link: "/dashboard/bookings"
          });
        }
      } else {
        throw new ApiError(403, "Forbidden: customers can only cancel bookings");
      }
    }
    
    if (typeof rating !== "undefined") updateData.rating = rating;
    if (typeof feedback !== "undefined") updateData.feedback = feedback;
  } else if (isManagerOrAdminOrVendor) {
    if (req.user.role === "manager") {
      const venue: any = existingBooking.venue;
      if (!venue || String(venue?.manager || "") !== String(req.user._id)) {
        throw new ApiError(403, "Forbidden: you do not manage the venue for this booking");
      }
    } else if (req.user.role === "vendor") {
      const vendorProfile = await Vendor.findOne({ owner: req.user._id });
      if (!vendorProfile || String(existingBooking.vendor || "") !== String(vendorProfile._id)) {
        throw new ApiError(403, "Forbidden: you are not the vendor for this booking");
      }
    }

    if (typeof status !== "undefined") {
      // TASK 3: Automate Payment Ledger Generation
      // Check if status is being changed from pending to confirmed
      if (status === "confirmed" && existingBooking.status === "pending") {
        await Payment.create({
          transactionId: `TXN-${Date.now()}`,
          bookingId: existingBooking._id,
          clientName: existingBooking.clientName,
          venueName: (existingBooking.venue as any)?.name || "Premium Venue",
          amount: 500, // Mocked deposit amount
          type: "Deposit (50%)",
          status: "paid",
        });

        // Send Email Notification
        const populatedBooking = await Booking.findById(existingBooking._id).populate("user").populate("venue");
        const clientEmail = (populatedBooking?.user as any)?.email;

        if (clientEmail) {
          await sendEmail({
            email: clientEmail,
            subject: "Booking Confirmed - Hargeisa Events Pro",
            message: `Your booking for ${(populatedBooking?.venue as any)?.name} is confirmed.`,
            html: getBookingConfirmationTemplate(populatedBooking),
          });
        }

        // Notify Customer via System Notification
        if (existingBooking.user) {
          await createNotification(existingBooking.user.toString(), {
            title: "Booking Confirmed",
            message: `Your booking for ${(existingBooking.venue as any)?.name || "the selected venue"} has been confirmed.`,
            type: "booking",
            link: "/dashboard/my-bookings"
          });
        }
      }
      updateData.status = status;
    }
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

/**
 * @desc    Get reviews for a venue or vendor
 * @route   GET /api/bookings/reviews/:targetId
 * @access  Public
 */
export const getReviews = asyncHandler(async (req: Request, res: Response) => {
  const { targetId } = req.params;

  const reviews = await Booking.find({
    $or: [{ venue: targetId }, { vendor: targetId }],
    rating: { $exists: true, $ne: null },
  })
    .select("clientName rating feedback eventDate createdAt")
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
});

/**
 * @desc    Get occupied dates for a venue
 * @route   GET /api/bookings/availability/:venueId
 * @access  Public
 */
export const getVenueAvailability = asyncHandler(async (req: Request, res: Response) => {
  const { venueId } = req.params;

  const bookings = await Booking.find({
    venue: venueId,
    status: { $in: ["confirmed", "pending"] },
    eventDate: { $gte: new Date() } // Only future bookings
  }).select("eventDate");

  const occupiedDates = bookings.map(b => b.eventDate.toISOString().split("T")[0]);

  return res.status(200).json(
    new ApiResponse(200, occupiedDates, "Occupied dates fetched successfully")
  );
});
