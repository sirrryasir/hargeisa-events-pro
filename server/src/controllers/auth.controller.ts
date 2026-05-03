import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { asyncHandler, ApiResponse, ApiError } from "../lib/apiUtils.js";

// Helper function to generate JWT
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "secret", {
    expiresIn: "30d",
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 */
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  const normalizedEmail = email.toLowerCase();

  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    throw new ApiError(400, "User already exists");
  }

  const user = await User.create({ name, email: normalizedEmail, password, role: "customer" });

  res.status(201).json(
    new ApiResponse(
      201,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: generateToken(String(user._id)),
      },
      "User registered"
    )
  );
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 */
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase();

  const user: any = await User.findOne({ email: normalizedEmail }).select("+password");

  if (user && (await user.comparePassword(password))) {
    res.status(200).json(
      new ApiResponse(
        200,
        {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token: generateToken(String(user._id)),
        },
        "Login successful"
      )
    );
  } else {
    throw new ApiError(401, "Invalid email or password");
  }
});

/**
 * @desc    Get user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getUserProfile = asyncHandler(async (req: any, res: Response) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json(
      new ApiResponse(200, {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }, "User profile fetched")
    );
  } else {
    throw new ApiError(404, "User not found");
  }
});

/**
 * @desc    Update user profile
 * @route   PATCH /api/auth/profile
 * @access  Private
 */
export const updateUserProfile = asyncHandler(async (req: any, res: Response) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json(
      new ApiResponse(200, {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      }, "Profile updated successfully")
    );
  } else {
    throw new ApiError(404, "User not found");
  }
});
