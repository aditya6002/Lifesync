const rateLimit = require("express-rate-limit");


// Global rate limiter (all requests)
const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for health check
    return req.path === "/health";
  },
});

// Specific rate limiter for auth endpoints (stricter)
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 attempts per 15 minutes
  message: {
    success: false,
    code: "TOO_MANY_AUTH_ATTEMPTS",
    message: "Too many authentication attempts. Please try again later.",
  },
  standardHeaders: false,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Rate limit by email instead of IP for auth endpoints
    return req.body?.email || req.ip;
  },
});

module.exports = { globalRateLimiter, authRateLimiter };
