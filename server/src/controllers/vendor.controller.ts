import { type Request, type Response } from "express";
import Vendor from "../models/vendor.model.js";
import { User } from "../models/user.model.js";
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
 * @desc    Get single vendor
 * @route   GET /api/vendors/:id
 */
export const getVendor = asyncHandler(async (req: Request, res: Response) => {
  const vendor = await Vendor.findById(req.params.id);

  if (!vendor) {
    throw new ApiError(404, "Vendor not found");
  }

  res.status(200).json(
    new ApiResponse(200, vendor, "Vendor fetched successfully")
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

  // Find existing user or create a new vendor account
  let vendorUser = await User.findOne({ email: contactEmail });
  
  if (!vendorUser) {
    vendorUser = await User.create({
      name: contactPerson || name,
      email: contactEmail,
      password: "password123", // Default password for new vendors
      role: "vendor",
    });
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
    projects: 0,
    owner: vendorUser._id
  });

  res.status(201).json(
    new ApiResponse(201, vendor, "Vendor created successfully")
  );
});

/**
 * @desc    Update a vendor
 * @route   PUT /api/vendors/:id
 */
export const updateVendor = asyncHandler(async (req: any, res: Response) => {
  let vendor = await Vendor.findById(req.params.id);

  if (!vendor) {
    throw new ApiError(404, "Vendor not found");
  }

  // Authorization check: Admin or the assigned Vendor
  if (req.user.role !== "admin" && req.user._id.toString() !== vendor.owner?.toString()) {
    throw new ApiError(403, "Not authorized to update this vendor profile");
  }

  vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(new ApiResponse(200, vendor, "Vendor updated successfully"));
});
