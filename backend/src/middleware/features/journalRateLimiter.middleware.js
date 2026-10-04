import { rateLimit } from "express-rate-limit";

const journalRateLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 50,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many requests from this IP, please slow down.",
  },
});

export default journalRateLimiter;
