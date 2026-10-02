import { rateLimit } from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hour
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
  windowMs: 120 * 60 * 1000, // 2 hours
  max: 6,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many attempts from this IP, please try again after 2 hours",
  },
});

const usernameLimiter = rateLimit({
  windowMs: 120 * 60 * 1000, // 2 hours
  max: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message:
      "Too many username reservation attempts from this IP, please try again after 2 hours",
  },
});

const otpLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 6,
  standardHeaders: "draft-6",
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message:
      "Too many email verification attempts from this IP, please try again after 24 hours",
  },
});

const changePasswordLimit = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 2,
  standardHeaders: "draft-6",
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many attempts, please try again later",
  },
});

const logoutLimiter = loginLimiter;
export {
  loginLimiter,
  registerLimiter,
  usernameLimiter,
  logoutLimiter,
  otpLimiter,
  changePasswordLimit,
};
