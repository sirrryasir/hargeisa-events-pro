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
