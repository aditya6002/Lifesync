import { rateLimit } from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message:
      "Too many login attempts from this IP, please try again after 30 minutes",
  },
});

const registerLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 6,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message:
      "Too many attempts from this IP, please try again after 30 minutes",
  },
});

export { loginLimiter, registerLimiter };
