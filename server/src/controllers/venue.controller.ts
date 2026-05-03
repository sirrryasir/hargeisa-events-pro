import { type Request, type Response } from "express";
import { Venue } from "../models/venue.model.js";
import { asyncHandler, ApiResponse, ApiError } from "../lib/apiUtils.js";

/**
 * @desc    Get all venues
 * @route   GET /api/venues
 */
export const getVenues = asyncHandler(async (req: Request, res: Response) => {
  const venues = await Venue.find();
  res.status(200).json(new ApiResponse(200, venues, "Venues fetched successfully"));
});

/**
 * @desc    Create a new venue
 * @route   POST /api/venues
 */
export const createVenue = asyncHandler(async (req: any, res: Response) => {
  const venueData = { ...req.body };
  
  // If the user is a manager, automatically assign them as the venue manager
  if (req.user && req.user.role === "manager") {
    venueData.manager = req.user._id;
  }

  const venue = await Venue.create(venueData);
  res.status(201).json(new ApiResponse(201, venue, "Venue created successfully"));
});

/**
 * @desc    Get single venue
 * @route   GET /api/venues/:id
 */
export const getVenueById = asyncHandler(async (req: Request, res: Response) => {
  const venue = await Venue.findById(req.params.id);
  
  if (!venue) {
    throw new ApiError(404, "Venue not found");
  }
  
  res.status(200).json(new ApiResponse(200, venue, "Venue fetched successfully"));
});

/**
 * @desc    Update a venue
 * @route   PUT /api/venues/:id
 */
export const updateVenue = asyncHandler(async (req: any, res: Response) => {
  let venue = await Venue.findById(req.params.id);

  if (!venue) {
    throw new ApiError(404, "Venue not found");
  }

  // Authorization check: Admin or the assigned Manager
  if (req.user.role !== "admin" && req.user._id.toString() !== venue.manager?.toString()) {
    throw new ApiError(403, "Not authorized to update this venue");
  }

  venue = await Venue.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(new ApiResponse(200, venue, "Venue updated successfully"));
});
