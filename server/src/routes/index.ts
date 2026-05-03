import { Router } from "express";
import authRoutes from "./auth.routes.js";
import venueRoutes from "./venue.routes.js";
import bookingRoutes from "./booking.routes.js";
import vendorRoutes from "./vendor.routes.js";
import paymentRoutes from "./payment.routes.js";
import uploadRoutes from "./upload.routes.js";
import notificationRoutes from "./notification.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/venues", venueRoutes);
router.use("/bookings", bookingRoutes);
router.use("/vendors", vendorRoutes);
router.use("/payments", paymentRoutes);
router.use("/upload", uploadRoutes);
router.use("/notifications", notificationRoutes);

export default router;
