class AppError extends Error {
  constructor(
    statusCode = 500,
    message = "Internal Server Error",
    isOperationalError = true,
    stack = "",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperationalError = isOperationalError;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
