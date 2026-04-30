import { Router } from "express";
import { getVendors, createVendor } from "../controllers/vendor.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/")
  .get(getVendors)
  .post(protect, authorizeRoles("admin"), createVendor);

export default router;
