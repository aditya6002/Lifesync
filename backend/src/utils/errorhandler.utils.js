const errorHandler = (err, req, res, next) => {
  console.error("Error:", {
    name: err.name,
    code: err.code,
    message: err.message,
    status: err.statusCode || 500,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Default error
  let statusCode = 500;
  let code = "INTERNAL_SERVER_ERROR";
  let message = "An unexpected error occurred. Please try again later.";
  let details = {};

  // Handle ApiError
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    details = err.details;
  }
  // Handle JWT errors (already converted to ApiError in middleware)
  else if (err instanceof jwt.JsonWebTokenError) {
    statusCode = 401;
    code = "INVALID_TOKEN";
    message = "Invalid authentication token";
  }
  // Handle validation errors
  else if (err.name === "ValidationError") {
    statusCode = 400;
    code = "VALIDATION_ERROR";
    message = err.message;
  }
  // Handle database errors (MongoDB example)
  else if (err.name === "MongoError") {
    statusCode = 500;
    code = "DATABASE_ERROR";
    message = "Database operation failed";
  }
  // Handle other errors
  else if (err.message) {
    message = err.message;
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message: message,
    code: code,
    ...(process.env.NODE_ENV === "development" && { details }),
  });
};

module.exports = { errorHandler };
