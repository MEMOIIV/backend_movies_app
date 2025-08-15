// asyncHandler: A wrapper for any async middleware/controller function
// Automatically catches any thrown errors and passes them to next(error)
// This eliminates the need to write try/catch in every async function
export const asyncHandler = (fn) => {
  return async (req, res, next) => {
    await fn(req, res, next).catch((error) => {
      return next(error); // Pass the error to global error handler
    });
  };
};

// globalErrorHandler: A centralized error handling middleware
// Executes when next(error) is called from anywhere in the app
// Returns a detailed error response (with stack trace only in development)
export const globalErrorHandler = (error, req, res, next) => {
  return res.status(error.cause || 400).json({
    error_message: error.message,
    // error: {
    //   name: error.name,         // e.g., TypeError, ValidationError, etc.
    //   message: error.message,   // The error message
    //   cause: error.cause        // Optional cause code (e.g., 403, 404, 500)
    // },
    stack: process.env.MOOD === "DEV" ? error.stack : undefined, // Show stack only in development
  });
};

// successResponse: A helper function to send successful HTTP responses
// Used to keep API responses consistent across the app
export const successResponse = ({
  res,
  message = "success",  // Default success message
  status = 200,          // Default HTTP status code
  data = {},             // The actual response data
} = {}) => {
  return res.status(status).json({
    message,
    data,
  });
};
