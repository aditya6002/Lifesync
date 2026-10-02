import { rateLimit } from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message:
      "Too many login attempts from this IP, please try again after 24 hours",
  },
});

const registerLimiter = rateLimit({
  windowMs: 120 * 60 * 1000,
  max: 6,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many attempts from this IP, please try again after 2 hours",
  },
});

export { loginLimiter, registerLimiter };
