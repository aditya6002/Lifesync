import { Router } from "express";
import activityController from "../controllers/activity.controller.js";
import isUserLogin from "../middleware/isUserLogin.middleware.js";
import wrapAsync from "../utils/wrapAsync.utils.js";
import featureRateLimiter from "../middleware/features/featureRateLimiter.middleware.js";

const router = Router();

router.use(featureRateLimiter, isUserLogin);

router.get("/month", wrapAsync(activityController.getMonthlyActivity));

export default router;
