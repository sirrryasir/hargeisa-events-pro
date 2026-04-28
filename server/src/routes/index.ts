import { Router } from "express";
import authRoutes from "./auth.routes.js";
import venueRoutes from "./venue.routes.js";
import bookingRoutes from "./booking.routes.js";
import vendorRoutes from "./vendor.routes.js";
import paymentRoutes from "./payment.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/venues", venueRoutes);
router.use("/bookings", bookingRoutes);
router.use("/vendors", vendorRoutes);
router.use("/payments", paymentRoutes);

export default router;
