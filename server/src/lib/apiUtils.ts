/**
 * Professional API Error Class
 */
class ApiError extends Error {
  statusCode: number;
  data: any;
  success: boolean;
  errors: any[];

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: any[] = [],
    stack: string = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Standard API Response Class
 */
class ApiResponse {
  statusCode: number;
  data: any;
  message: string;
  success: boolean;

  constructor(statusCode: number, data: any, message: string = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

/**
 * Higher-order function to handle async routes and catch errors
 */
const asyncHandler = (requestHandler: any) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { ApiError, ApiResponse, asyncHandler };
