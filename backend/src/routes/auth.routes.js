const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth.controller");
const wrapAsync = require("../middleware/wrapAsync.middleware.js");
const authMiddleware = require("../middleware/authValidation.middleware.js");
const { isUserLogin } = require("../middleware/auth.middleware");
const { authRateLimiter } = require("../middleware/rateLimiter.middleware.js");
const upload = require("../middleware/multer.middleware.js");

// Check username available or not
router.post("/username-available", wrapAsync(authControllers.checkUsername));

/**
 * POST /api/auth/login
 * @public
 * @description Login route
 * @body {email,password}
 */
router.post(
  "/login",
  authRateLimiter,
  authMiddleware.loginValidationRules,
  wrapAsync(authControllers.login),
);

/**
 * POST /api/auth/register
 * @public
 * @description Register route
 * @body {username,email,password}
 */
router.post(
  "/register",
  authMiddleware.registerValidationRules,
  authRateLimiter,
  wrapAsync(authControllers.newUser),
);

/**
 * POST /api/auth/logout
 * @private
 * @description Logout route
 * @body {refreshToken}
 */
router.post(
  "/logout",
  authRateLimiter,
  isUserLogin,
  wrapAsync(authControllers.logout),
);

/**
 * GET /api/auth/me
 * @private
 * @description Check if user is logged in
 */
router.post(
  "/me",
  // authRateLimiter,
  isUserLogin,
  wrapAsync(authControllers.isUserLoggedIn),
);

/**
 * POST /api/auth/profile
 * @private
 * @description Get user profile
 */
router.post(
  "/profile",
  authRateLimiter,
  isUserLogin,
  wrapAsync(authControllers.getProfile),
);

/**
 * POST /api/auth/refresh-token
 * @private
 * @description Refresh access token
 */
router.post(
  "/refresh-token",
  authRateLimiter,
  isUserLogin,
  wrapAsync(authControllers.refreshToken),
);

/**
 * POST /api/auth/profile-picture
 * @private
 * @description Add profile picture
 * @body {profilePicture, type: file,refreshToken}
 */
router.post(
  "/profile-picture",
  authRateLimiter,
  isUserLogin,
  upload.single("profilePicture"),
  wrapAsync(authControllers.addProfilePicture),
);

/**
 * POST /api/auth/change-password
 * @private
 * @description Change password
 * @body {oldPassword,newPassword,refreshToken}
 */
router.put(
  "/change-password",
  authRateLimiter,
  isUserLogin,
  authMiddleware.changePassWordValidationRules,
  wrapAsync(authControllers.changePassword),
);

/**
 * POST /api/auth/send-email-verification-token
 * @private
 * @description Send email verification token
 * @body {refreshToken,}
 */
router.post(
  "/send-email-verification-token",
  authRateLimiter,
  isUserLogin,
  wrapAsync(authControllers.reSendEmailVerification),
);

/**
 * POST /api/auth/verify-email
 * @private
 * @description Verify email token
 * @body {refreshToken, }
 */
router.post(
  "/verify-email",
  isUserLogin,
  authRateLimiter,
  wrapAsync(authControllers.verifyEmail),
);

/**
 * POST /api/auth/reset-password
 * @private
 * @description Send reset password link
 * @body {refreshToken}
 */
router.post(
  "/reset-password",
  authRateLimiter,
  wrapAsync(authControllers.sendResetPassLink),
);

/**
 * POST /api/auth/reset-password/:resetToken
 * @private
 * @description Verify reset password link
 * @body {refreshToken}
 */
router.post(
  "/reset-password/:resetToken",
  authRateLimiter,
  wrapAsync(authControllers.verifyResetToken),
);

module.exports = router;
