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
  otpLimiter,
  changePasswordLimit,
  resetPassword,
} from "../middleware/auth/authRateLimit.middleware.js";

// Import controllers, validators
import authController from "../controllers/auth.controller.js";

import usernameValidator from "../utils/auth/username.validator.js";
import loginValidationRules from "../utils/auth/login.validators.js";
import registerValidator from "../utils/auth/register.validators.js";
import otpValidator from "../utils/auth/otp.validator.js";
import isUserLogin from "../middleware/isUserLogin.middleware.js";
import editProfileValidator from "../utils/auth/editProfileValidator.js";
import changePasswordValidator from "../utils/auth/changePassword.validator.js";
import emailValidation from "../utils/auth/email.validator.js";
import resetPasswordValidator from "../utils/auth/resetPassword.validator.js";
import passwordValidator from "../utils/auth/passwordValidator.js";

// Create a new router instance
const routes = new Router();

/**
 * @desc Register a new user
 * @route POST /api/v1/auth/register
 * @access @public
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
 * @desc Verify email by OTP
 * @route POST - /api/v1/auth/verify-email
 * @access @private
 * @body { otp }
 * @cookie { accessToken, refreshToken }
 * @returns {}
 * */

routes.post(
  "/verify-email",
  isUserLogin,
  otpLimiter,
  otpValidator,
  validate,
  wrapAsync(authController.verifyEmailOtp),
);

/**
 * @desc Send Email for verification
 * @route POST - /api/v1/auth/send-email
 * @access @private
 * @body {}
 * @cookie { accessToken, refreshToken }
 * @returns {}
 */
routes.post(
  "/send-email",
  isUserLogin,
  otpLimiter,
  wrapAsync(authController.sendOtp),
);

/**
 * @desc Reserve an username for 1 hour
 * @route POST /api/v1/auth/username
 * @access Public
 * @body { username }
 * @return { true/false, username }
 *
 */
routes.post(
  "/username",
  usernameLimiter,
  usernameValidator,
  validate,
  wrapAsync(authController.reserveUsername),
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

/**
 * @desc Get current user details
 * @route GET /api/v1/auth/me
 * @access @private
 * @cookie { refreshToken }
 * @returns { user }
 */
routes.get("/me", wrapAsync(authController.getMe));

/**
 * @desc Get current user details
 * @route GET /api/v1/auth/profile
 * @access @private
 * @cookie { accessToken }
 * @returns { user }
 */
routes.get("/profile", isUserLogin, wrapAsync(authController.profile));

/**
 * @desc Edit current user details
 * @route POST /api/v1/auth/profile
 * @access @private
 * @body { user }
 * @cookie { accessToken }
 * @returns { user }
 */
routes.post(
  "/profile",
  isUserLogin,
  editProfileValidator,
  validate,
  wrapAsync(authController.editProfile),
);

/**
 * @desc Change password for current user
 * @route POST /api/v1/auth/change-password
 * @access @private
 * @body { oldPassword, newPassword }
 * @cookie { accessToken }
 * @returns {}
 */
routes.post(
  "/change-password",
  changePasswordLimit,
  isUserLogin,
  changePasswordValidator,
  validate,
  wrapAsync(authController.changePassword),
);

routes.post(
  "/set-password",
  resetPassword,
  resetPasswordValidator,
  validate,
  wrapAsync(authController.setNewPassword),
);

routes.post(
  "/reset-password",
  resetPassword,
  emailValidation,
  validate,
  wrapAsync(authController.resetPassword),
);

routes.delete(
  "/delete-account",
  isUserLogin,
  passwordValidator,
  validate,
  wrapAsync(authController.deleteUser),
);

routes.post(
  "/activate-account",
  isUserLogin,
  wrapAsync(authController.activateAccount),
);

export default routes;
