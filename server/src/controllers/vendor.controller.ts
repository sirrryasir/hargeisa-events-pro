import { type Request, type Response } from "express";
import Vendor from "../models/vendor.model.js";
import { asyncHandler, ApiResponse, ApiError } from "../lib/apiUtils.js";

/**
 * @desc    Get all vendors
 * @route   GET /api/vendors
 */
export const getVendors = asyncHandler(async (req: Request, res: Response) => {
  const vendors = await Vendor.find().sort({ createdAt: -1 });
  
  res.status(200).json(
    new ApiResponse(200, vendors, "Vendors fetched successfully")
  );
});

/**
 * @desc    Create a new vendor
 * @route   POST /api/vendors
 */
export const createVendor = asyncHandler(async (req: Request, res: Response) => {
  const { name, type, contactEmail, contactPhone, contactPerson, description } = req.body;

  if (!name || !type || !contactEmail || !contactPhone) {
    throw new ApiError(400, "Please provide all required fields");
  }

  const vendor = await Vendor.create({
    name,
    type,
    contactEmail,
    contactPhone,
    contactPerson,
    description,
    status: "available",
    rating: 0,
    projects: 0
  });

  res.status(201).json(
    new ApiResponse(201, vendor, "Vendor created successfully")
  );
});
