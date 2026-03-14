const rateLimit = require("express-rate-limit");

// Global rate limiter (all requests)
const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    req.path === "/health";
    req.path === "/me";
    return;
  },
});

// Specific rate limiter for auth endpoints (stricter)
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    code: "TOO_MANY_AUTH_ATTEMPTS",
    message: "Too many authentication attempts. Please try again later.",
  },
  standardHeaders: false,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Rate limit by email instead of IP for auth endpoints
    return `${req.body?.email}-${req.ip}`;
  },
});

module.exports = { globalRateLimiter, authRateLimiter };
