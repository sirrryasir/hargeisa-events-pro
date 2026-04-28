import { Router } from "express";
import { getBookings, createBooking, updateBookingStatus } from "../controllers/booking.controller.js";
import { protect, optionalProtect } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(protect, getBookings).post(optionalProtect, createBooking);
router.route("/:id").patch(protect, updateBookingStatus);

export default router;
