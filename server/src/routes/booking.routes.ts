import { Router } from "express";
import { getBookings, getPublicBookings, createBooking, updateBookingStatus, getReviews, getVenueAvailability } from "../controllers/booking.controller.js";
import { protect, optionalProtect } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(protect, getBookings).post(optionalProtect, createBooking);
router.get("/public", optionalProtect, getPublicBookings);
router.get("/reviews/:targetId", getReviews);
router.get("/availability/:venueId", getVenueAvailability);
router.route("/:id").patch(protect, updateBookingStatus);

export default router;
