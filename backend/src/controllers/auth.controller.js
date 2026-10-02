// Import necessary packages
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Import the User model
import User from "../models/auth/user.model.js";
import BlackListToken from "../models/auth/blackListToken.model.js";
import ReserveUsername from "../models/auth/reserveUsername.model.js";

// Import helper functions and services
import getOtp from "../helper/getOTP.js";
import emailService from "../services/email.services.js";
import AppError from "../middleware/AppError.middleware.js";

/**
 * @desc Register a new user
 * @route POST /api/v1/auth/register
 * @access Public
 * @body { name, username, email, password, profession, gender  }
 * @returns { user, token }
 */
const register = async (req, res) => {
  // Check if all required fields are present and not empty
  const { name, username, email, password, profession, gender } =
    req?.body || {};

  // Check if the username or email already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({
      message: "Username already exists",
    });
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return res.status(400).json({
      message: "Email already exists",
    });
  }

  // Generate OTP and hash it
  const otp = await getOtp();
  const salt = await bcrypt.genSalt(10);
  const hashOtp = await bcrypt.hash(otp, salt);
  const emailVerifyTokenExpires = new Date(new Date() + 15 * 60 * 1000); // 15 minutes from now

  const newUser = new User({
    name,
    username,
    gender,
    email,
    password,
    profession,
    emailVerifyToken: hashOtp,
    emailVerifyTokenExpires,
  });
  await newUser.save();

  await emailService.sendOTP(email, otp);

  // Generate access and refresh tokens
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  const accessToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign(
    { id: newUser._id },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: newUser._id,
      profilePic: newUser.profilePic,
      username: newUser.username,
    },
    token: accessToken,
  });
};

/**
 * @desc Verify User email
 * @route POST - /api/v1/auth/verify-email
 * @access @private
 * @body { otp }
 * @cookie { accessToken, refreshToken}
 * @returns {}
 */
const verifyEmailOtp = async (req, res) => {
  const { otp } = req.body;
  const user = req.user;

  if (!otp) {
    throw new AppError(400, "OTP is required", true);
  }

  if (!user) {
    throw new AppError(401, "User not logged in", true);
  }

  if (!user.emailVerifyToken || !user.emailVerifyTokenExpires) {
    throw new AppError(400, "No OTP found for this user", true);
  }

  if (new Date() > user.emailVerifyTokenExpires) {
    throw new AppError(400, "OTP has expired", true);
  }

  const isOtpValid = await user.verifyEmailToken(otp);
  if (!isOtpValid) {
    throw new AppError(400, "Invalid OTP", true);
  }

  user.isEmailVerified = true;
  user.emailVerifyToken = null;
  user.emailVerifyTokenExpires = null;

  await user.save();

  res.status(200).json({
    message: "Email verified successfully",
  });
};

/**
 * @desc Reserve an username for 1 hour
 * @route POST /api/v1/auth/username
 * @access Public
 * @body { username }
 * @return { true/false,username }
 * */
const reserveUsername = async (req, res) => {
  let { username } = req.body;

  username = username.toLowerCase();
  const existingUser = await User.findOne({ username });
  const reservedUser = await ReserveUsername.findOne({ username });

  if (existingUser || reservedUser) {
    return res.status(400).json({
      message: "Username already exists",
      success: false,
    });
  } else {
    const newReservedUser = new ReserveUsername({
      username: username,
    });

    await newReservedUser.save();
    res.status(200).json({
      message: "Username is available",
      success: true,
      username: {
        username: newReservedUser.username,
        _id: newReservedUser._id,
      },
    });
  }
};

/**
 * @desc Login a user
 * @route POST /api/v1/auth/login
 * @access Public
 * @body { loginId, password }
 * @returns { user, token }
 */
const login = async (req, res) => {
  const { loginId, password } = req.body;

  const isUserExist = await User.findOne({
    $or: [{ email: loginId }, { username: loginId }],
  });

  if (!isUserExist) {
    throw new AppError(404, "User not found", true);
  }

  const isPasswordValid = await isUserExist.comparePassword(password);

  if (!isPasswordValid) {
    throw new AppError(401, "Invalid password", true);
  }

  const accessToken = jwt.sign(
    { id: isUserExist._id },
    process.env.JWT_SECRET,
    { expiresIn: "20m" },
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  const refreshToken = jwt.sign(
    { id: isUserExist._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" },
  );

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  res.status(200).json({
    message: "User logged in successfully",
    user: {
      id: isUserExist._id,
      profilePic: isUserExist.profilePic,
      username: isUserExist.username,
    },
    token: accessToken,
  });
};

/**
 * @desc Logout user
 * @route POST /api/v1/auth/logout
 * @access @protected
 * @cookies {accessToken,refreshToken}
 * @returns {}
 */
const logout = async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(401, "User not logged in", true);
  }

  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken || !refreshToken) {
    throw new AppError(401, "User not logged in", true);
  }

  // Add the tokens to the blacklist
  const blackListToken = new BlackListToken({
    accessToken,
    refreshToken,
  });

  await blackListToken.save();

  // Clear the cookies
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(200).json({
    message: "User logged out successfully",
  });
};

/**
 * @desc Send Email for verification
 * @route POST - /api/v1/auth/send-email
 * @access @private
 * @body {}
 * @cookie { accessToken, refreshToken }
 * @returns {}
 */
const sendOtp = async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(400, "User not log in", true);
  }

  if (
    user.emailVerifyTokenExpires &&
    new Date() < user.emailVerifyTokenExpires
  ) {
    throw new AppError(
      400,
      "OTP already sent. Please wait for 15 minutes before requesting a new OTP.",
      true,
    );
  }

  if (user.isEmailVerified) {
    throw new AppError(400, "Email already verified");
  }

  const otp = await getOtp();
  const salt = await bcrypt.genSalt(10);
  const hashOtp = await bcrypt.hash(otp, salt);
  const emailVerifyTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

  user.emailVerifyToken = hashOtp;
  user.emailVerifyTokenExpires = emailVerifyTokenExpires;

  await user.save();

  await emailService.sendOTP(user.email, otp);

  res.status(200).json({
    success: true,
    message: "Otp sended",
  });
};

export default {
  register,
  verifyEmailOtp,
  reserveUsername,
  login,
  logout,
  sendOtp,
};
