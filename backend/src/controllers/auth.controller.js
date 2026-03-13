const bcryptjs = require("bcryptjs");
const User = require("../models/user.model");
const UsernameReservation = require("../models/usernameReservation.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {AppError} = require("../middleware/AppError.middleware");
const {
  sendEmail,
  sendOTP,
  sendResetPasswordEmail,
} = require("../services/mail.service");

// Utility: Generate JWT
const generateToken = (id, expireIn = "7d") => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: expireIn,
  });
};

// Utility: Generate OTP (6 digit)
const generateOTP = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

// REGISTER
const newUserFunction = async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    throw new AppError("Please provide all required fields", 400);
  }

  // Check username
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    throw new AppError("Username already exists", 409);
  }

  // Check email
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new AppError("Email already exists", 409);
  }

  const otp = generateOTP();
  const hashedOtp = await bcryptjs.hash(otp, 10);

  const user = await User.create({
    name,
    username,
    email,
    password: await bcryptjs.hash(password, 10),
    emailVerificationCode: hashedOtp,
    emailVerificationCodeExpires: Date.now() + 10 * 60 * 1000, // 10 min
  });

  await sendOTP(email, otp);

  // Remove reserved username if exists
  const reserved = await UsernameReservation.findOne({ username });
  if (reserved) {
    await UsernameReservation.findByIdAndDelete(reserved._id);
  }

  const token = generateToken(user._id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
  });
};

// LOGIN
const loginUserFunction = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Please provide email and password", 400);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isValid = await bcryptjs.compare(password, user.password);
  if (!isValid) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = generateToken(user._id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
    },
  });
};

// LOGOUT
const logoutFunction = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};

// VERIFY EMAIL
const verifyEmailFunction = async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    throw new AppError("OTP is required", 400);
  }

  const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user) throw new AppError("User not found", 404);

  if (user.isEmailVerified) {
    throw new AppError("Email already verified", 400);
  }

  // Expiry check
  if (Date.now() > user.emailVerificationCodeExpires) {
    throw new AppError("OTP expired. Please request new one.", 400);
  }

  const isValid = await bcryptjs.compare(otp, user.emailVerificationCode);
  if (!isValid) {
    throw new AppError("Invalid OTP", 400);
  }

  user.isEmailVerified = true;
  user.emailVerificationCode = undefined;
  user.emailVerificationCodeExpires = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Email verified successfully",
  });
};

// RESEND OTP
const reSendEmailVerificationFunction = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) throw new AppError("User not found", 404);

  if (user.isEmailVerified) {
    throw new AppError("Email already verified", 400);
  }

  const otp = generateOTP();
  user.emailVerificationCode = await bcryptjs.hash(otp, 10);
  user.emailVerificationCodeExpires = Date.now() + 10 * 60 * 1000;

  await user.save();
  await sendOTP(user.email, otp);

  res.status(200).json({
    success: true,
    message: "Verification email resent successfully",
  });
};

// CHECK USERNAME
const checkUsername = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    throw new AppError("Username required", 400);
  }

  const exists = await User.findOne({ username });
  const reserved = await UsernameReservation.findOne({ username });

  if (exists || reserved) {
    throw new AppError("Username already taken", 409);
  }

  await UsernameReservation.create({ username });

  res.status(201).json({
    success: true,
    message: "Username available",
  });
};

// CHECK LOGIN
const isUserLoggedIn = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) throw new AppError("User not found", 404);

  res.status(200).json({
    success: true,
    message: "User logged in",
    user: {
      name: user.name,
      username: user.username,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
    },
  });
};

// CHANGE PASSWORD
const changePassword = async (req, res) => {
  const { oldPassword, password, confirmPassword } = req.body;

  if (!oldPassword || !password || !confirmPassword) {
    throw new AppError("Please provide all details", 400);
  }

  if (password !== confirmPassword) {
    throw new AppError("Passwords do not match", 400);
  }

  const user = await User.findById(req.user.id);
  if (!user) throw new AppError("User not found", 404);

  const isMatch = await bcryptjs.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new AppError("Invalid old password", 401);
  }

  user.password = await bcryptjs.hash(password, 10);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
};

const deleteUser = (req, res) => {
  const user = User.findById({ _id: req.user.id });
};

const verifyResetToken = async (req, res) => {
  const { resetToken } = req.params;
  const { password, confirmPassword } = req.body;

  if (
    !password ||
    !password.trim() ||
    !confirmPassword ||
    !confirmPassword.trim()
  ) {
    throw new AppError("All details are required", 400);
  } else if (password !== confirmPassword) {
    throw new AppError("Password does not matched", 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
  } catch (err) {
    throw new AppError("Invalid or expired token", 401);
  }

  console.log(decoded);
  const user = await User.findById(decoded.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  let tokenSendAgain = false;

  if (user.resetPasswordTokenExpires < new Date()) {
    tokenSendAgain = true;
  }

  if (user.resetPasswordToken !== resetToken) {
    tokenSendAgain = true;
  }

  if (tokenSendAgain) {
    const verifyToken = await generateToken(user._id, "10m");
    user.resetPasswordToken = verifyToken;
    user.resetPasswordTokenExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    sendResetPasswordEmail(user.email, verifyToken);
    throw new AppError("Invalid token", 401);
  }

  const hashPassword = await bcryptjs.hash(password, 10);
  user.resetPasswordToken = null;
  user.resetPasswordTokenExpires = null;
  user.password = hashPassword;
  await user.save();

  res
    .status(200)
    .json({ success: true, message: "Password changed successfully" });
};

const sendResetPassLink = async (req, res) => {
  const { email } = req.body;

  if (!email || !email.trim()) {
    throw new AppError("Email is required", 400);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("User does not exist", 404);
  }

  if (
    user.resetPasswordTokenExpires &&
    user.resetPasswordTokenExpires > Date.now()
  ) {
    throw new AppError("Reset link already sent. Please wait.", 429);
  }

  const token = generateToken(user._id, "10m");

  user.resetPasswordToken = token;
  user.resetPasswordTokenExpires = Date.now() + 10 * 60 * 1000;

  await user.save();
  await sendResetPasswordEmail(email, token);

  res.status(200).json({
    success: true,
    message: "Reset password link sent successfully",
  });
};

module.exports = {
  newUser: newUserFunction,
  login: loginUserFunction,
  logout: logoutFunction,
  verifyEmail: verifyEmailFunction,
  reSendEmailVerification: reSendEmailVerificationFunction,
  checkUsername,
  isUserLoggedIn,
  changePassword,
  deleteUser,
  sendResetPassLink,
  verifyResetToken,
};
