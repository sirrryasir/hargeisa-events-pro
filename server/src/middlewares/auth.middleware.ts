import jwt from "jsonwebtoken";
import { type Request, type Response, type NextFunction } from "express";
import { User } from "../models/user.model.js";
import { asyncHandler, ApiError } from "../lib/apiUtils.js";

export const protect = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");
      
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      throw new ApiError(401, "Not authorized, token failed");
    }
  }

  if (!token) {
    throw new ApiError(401, "Not authorized, no token");
  }
});

export const optionalProtect = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");
      req.user = await User.findById(decoded.id).select("-password");
    } catch (error) {
      // Just continue without setting req.user
    }
  }
  next();
});

export const authorizeRoles = (...roles: string[]) =>
  asyncHandler(async (req: any, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, "Not authorized, no user context");
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "Forbidden: insufficient permissions");
    }

    next();
  });
