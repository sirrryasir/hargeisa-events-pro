import { Router } from "express";
import { getVendors, createVendor } from "../controllers/vendor.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getVendors);
router.post("/", protect, authorizeRoles("admin", "manager"), createVendor);

export default router;
