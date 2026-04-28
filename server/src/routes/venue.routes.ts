import { Router } from "express";
import { getVenues, createVenue, getVenueById } from "../controllers/venue.controller.js";
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(getVenues).post(protect, authorizeRoles("admin", "manager"), createVenue);
router.route("/:id").get(getVenueById);

export default router;
