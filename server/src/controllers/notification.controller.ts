import { type Response } from "express";
import { Notification } from "../models/notification.model.js";
import { asyncHandler, ApiResponse, ApiError } from "../lib/apiUtils.js";

/**
 * @desc    Get user notifications
 * @route   GET /api/notifications
 */
export const getNotifications = asyncHandler(async (req: any, res: Response) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);

  res.status(200).json(
    new ApiResponse(200, notifications, "Notifications fetched successfully")
  );
});

/**
 * @desc    Mark notification as read
 * @route   PUT /api/notifications/:id/read
 */
export const markAsRead = asyncHandler(async (req: any, res: Response) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user._id },
    { read: true },
    { new: true }
  );

  res.status(200).json(
    new ApiResponse(200, notification, "Notification marked as read")
  );
});
