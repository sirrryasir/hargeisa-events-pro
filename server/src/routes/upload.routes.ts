import { Router } from "express";
import { upload } from "../middlewares/upload.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import { ApiResponse } from "../lib/apiUtils.js";

const router = Router();

router.post("/", protect, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json(new ApiResponse(400, null, "No file uploaded"));
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(200).json(new ApiResponse(200, { imageUrl }, "Image uploaded successfully"));
});

export default router;
