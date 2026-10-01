import { rateLimit } from "express-rate-limit";

const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many requests, please slow down.",
  },
});

export default globalLimiter;
