import { Router } from "express";
import { registerUser, loginUser, getUserProfile, updateUserProfile } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.route("/profile").get(protect, getUserProfile).patch(protect, updateUserProfile);

export default router;
