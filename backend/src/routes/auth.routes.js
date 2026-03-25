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

// Register a new user
router.post(
  "/register",
  authMiddleware.registerValidationRules,
  authRateLimiter,
  wrapAsync(authControllers.newUser),
);

// Logout route
router.post(
  "/logout",
  authRateLimiter,
  isUserLogin,
  wrapAsync(authControllers.logout),
);

// Is User logged in or not
router.get(
  "/me",
  // authRateLimiter,
  isUserLogin,
  wrapAsync(authControllers.isUserLoggedIn),
);

// Refresh access token
router.post(
  "/refresh-token",
  authRateLimiter,
  isUserLogin,
  wrapAsync(authControllers.refreshToken),
);

// Add profile picture
router.post(
  "/profile-picture",
  authRateLimiter,
  isUserLogin,
  upload.single("profilePicture"),
  wrapAsync(authControllers.addProfilePicture),
);

// Change Password
router.put(
  "/change-password",
  authRateLimiter,
  isUserLogin,
  authMiddleware.changePassWordValidationRules,
  wrapAsync(authControllers.changePassword),
);

// Send Email verification token
router.post(
  "/send-email-verification-token",
  authRateLimiter,
  isUserLogin,
  wrapAsync(authControllers.reSendEmailVerification),
);

// Verify email token
router.post(
  "/verify-email",
  isUserLogin,
  authRateLimiter,
  wrapAsync(authControllers.verifyEmail),
);

//Send Reset Password Link
router.post(
  "/reset-password",
  authRateLimiter,
  wrapAsync(authControllers.sendResetPassLink),
);

// Verify reset password link
router.post(
  "/reset-password/:resetToken",
  authRateLimiter,
  wrapAsync(authControllers.verifyResetToken),
);

module.exports = router;
