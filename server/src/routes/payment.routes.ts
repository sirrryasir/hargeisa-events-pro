import { Router } from "express";
import { getPayments, createPayment } from "../controllers/payment.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", protect, getPayments);
router.post("/", protect, authorizeRoles("admin", "manager"), createPayment);

export default router;
