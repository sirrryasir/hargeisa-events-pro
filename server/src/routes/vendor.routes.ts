import { Router } from "express";
import { getVendors, getVendor, createVendor, updateVendor, deleteVendor } from "../controllers/vendor.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/")
  .get(getVendors)
  .post(protect, authorizeRoles("admin"), createVendor);

router
  .route("/:id")
  .get(getVendor)
  .put(protect, authorizeRoles("admin", "vendor"), updateVendor)
  .delete(protect, authorizeRoles("admin"), deleteVendor);

export default router;
