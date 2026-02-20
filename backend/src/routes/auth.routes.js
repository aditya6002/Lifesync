const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth.controller");
const wrapAsync = require("../middleware/wrapAsync.middleware.js");
const authMiddleware = require("../middleware/authValidation.middleware.js");
const { isUserLogin } = require("../middleware/auth.middleware");

// Check username available or not
router.post("/username-available", wrapAsync(authControllers.checkUsername));

// Login user
router.post(
  "/login",
  authMiddleware.loginValidationRules,
  wrapAsync(authControllers.login),
);

// Register a new user
router.post(
  "/register",
  authMiddleware.registerValidationRules,
  wrapAsync(authControllers.newUser),
);

// Logout route
router.post("/logout", isUserLogin, wrapAsync(authControllers.logout));

// Is User logged in or not
router.get("/me", isUserLogin, wrapAsync(authControllers.isUserLoggedIn));

// Change Password
router.put(
  "/change-password",
  isUserLogin,
  authMiddleware.changePassWordValidationRules,
  wrapAsync(authControllers.changePassword),
);

// Send Emial verification token
router.post(
  "/send-email-verification-token",
  isUserLogin,
  wrapAsync(authControllers.reSendEmailVerification),
);

// Verify email token
router.post(
  "/verify-email",
  isUserLogin,
  wrapAsync(authControllers.verifyEmail),
);

//Send Reset Password Link
router.post("/reset-password", wrapAsync(authControllers.sendResetPassLink));

// Verify reset password link
router.post(
  "/reset-password/:resetToken",
  wrapAsync(authControllers.verifyResetToken),
);

module.exports = router;
