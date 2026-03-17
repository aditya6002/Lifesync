class AppError extends Error {
  constructor(message, statusCode, code = "APP_ERROR", details = {}) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

class ApiError extends Error {
  constructor(message, statusCode, code = "UNKNOWN_ERROR", details = {}) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

module.exports = { AppError, ApiError };
