import { Router } from "express";

//
import wrapAsync from "../utils/wrapAsync.utils.js";
import validate from "../middleware/validate.middleware.js";
import loginValidationRules from "../utils/auth/login.validators.js";
const routes = new Router();

import authController from "../controllers/auth.controller.js";
import { loginLimiter } from "../middleware/auth/authRateLimit.middleware.js";

routes.post("/register", validate, wrapAsync(authController.register));

routes.post(
  "/login",
  loginLimiter,
  loginValidationRules,
  validate,
  wrapAsync(authController.login),
);

export default routes;
