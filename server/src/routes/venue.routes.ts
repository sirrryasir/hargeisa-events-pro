import { Router } from "express";
import { getVenues, createVenue, getVenueById, updateVenue, deleteVenue } from "../controllers/venue.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(getVenues).post(protect, authorizeRoles("admin"), createVenue);
router.route("/:id")
  .get(getVenueById)
  .put(protect, authorizeRoles("admin", "manager"), updateVenue)
  .delete(protect, authorizeRoles("admin"), deleteVenue);

export default router;
