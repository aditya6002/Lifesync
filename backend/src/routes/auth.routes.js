// Importing packages
import { Router } from "express";

// Import necessary  middleware and utilities
import wrapAsync from "../utils/wrapAsync.utils.js";
import validate from "../middleware/validate.middleware.js";
import {
  loginLimiter,
  registerLimiter,
  usernameLimiter,
  logoutLimiter,
} from "../middleware/auth/authRateLimit.middleware.js";

// Import controllers, validators
import authController from "../controllers/auth.controller.js";

import usernameValidator from "../utils/auth/username.validator.js";
import loginValidationRules from "../utils/auth/login.validators.js";
import registerValidator from "../utils/auth/register.validators.js";
import isUserLogin from "../middleware/isUserLogin.middleware.js";

// Create a new router instance
const routes = new Router();

/**
 * @desc Register a new user
 * @route POST /api/v1/auth/register
 * @access Public
 * @body { name, username, email, password, profession, gender  }
 * @returns { user, token }
 */
routes.post(
  "/register",
  registerLimiter,
  registerValidator,
  validate,
  wrapAsync(authController.register),
);

/**
 * @desc Reserve an username for 1 hour
 * @route POST /api/v1/auth/username
 * @access Public
 * @body { username }
 * @return { true/false, username }
 * */
routes.post(
  "/username",
  usernameLimiter,
  usernameValidator,
  validate,
  authController.reserveUsername,
);

/**
 * @desc Login a user
 * @route POST /api/v1/auth/login
 * @access Public
 * @body { loginId, password }
 * @returns { user, token }
 */
routes.post(
  "/login",
  loginLimiter,
  loginValidationRules,
  validate,
  wrapAsync(authController.login),
);

/**
 * @desc Logout a user
 * @route POST /api/v1/auth/logout
 * @protected
 * @cookie { accessToken,refreshToken }
 * @returns {}
 */
routes.post(
  "/logout",
  logoutLimiter,
  isUserLogin,
  wrapAsync(authController.logout),
);

export default routes;
