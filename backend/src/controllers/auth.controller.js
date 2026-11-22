// Import necessary packages
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Import the User model
import User from "../models/auth/user.model.js";
import Task from "../models/features/task.model.js";
import Note from "../models/features/note.model.js";
import Journal from "../models/features/journal.model.js";
import Expense from "../models/features/expense.model.js";
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
      appLanguage: newUser.appLanguage,
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
  if (!user.isAccountActive) {
    throw new AppError(
      403,
      "Account is deactivated. Please activate your account to perform this action.",
      true,
    );
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
  console.log("Login route")

  const isUserExist = await User.findOne({
    $or: [{ email: loginId }, { username: loginId }],
  });

  if (!isUserExist) {
    throw new AppError(404, "User not found", true);
  }

  if (!isUserExist.isAccountActive) {
    throw new AppError(
      403,
      "Account is deactivated. Please activate your account to perform this action.",
      true,
    );
  }

  const isPasswordValid = await isUserExist.comparePassword(password);

  if (!isPasswordValid) {
    throw new AppError(401, "Invalid password", true);
  }

  const accessToken = jwt.sign(
    { id: isUserExist._id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
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
      _id: isUserExist._id,
      name: isUserExist.name,
      email: isUserExist.email,
      profilePic: isUserExist.profilePic,
      username: isUserExist.username,
      appLanguage: isUserExist.appLanguage,
      appLock: {
        isLockEnabled: Boolean(isUserExist.appLock?.isLockEnabled),
        hasPasscode: Boolean(isUserExist.appLock?.passcode),
        autoLock: isUserExist.appLock?.autoLock || "1m",
      },
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

  if (!user.isAccountActive) {
    throw new AppError(
      403,
      "Account is deactivated. Please activate your account to perform this action.",
      true,
    );
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

  if (!user.isAccountActive) {
    throw new AppError(
      403,
      "Account is deactivated. Please activate your account to perform this action.",
      true,
    );
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

/**
 * @desc Get current user details
 * @route GET /api/v1/auth/me
 * @access @private
 * @cookie { refreshToken }
 * @returns { user }
 */
const getMe = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken || !refreshToken.trim()) {
      throw new AppError(400, "User not log in");
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const userId = decoded.id;
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    if (!user.isAccountActive) {
      throw new AppError(
        403,
        "Account is deactivated. Please activate your account to perform this action.",
        true,
      );
    }

    const newAccessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.status(200).json({
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        isEmailVerified: user.isEmailVerified,
        appLanguage: user.appLanguage,
        appLock: {
          isLockEnabled: Boolean(user.appLock?.isLockEnabled),
          hasPasscode: Boolean(user.appLock?.passcode),
          autoLock: user.appLock?.autoLock || "1m",
        },
      },
    });
  } catch (error) {
    try {
      const blackListToken = new BlackListToken({
        accessToken: req.cookies?.accessToken,
        refreshToken: req.cookies?.refreshToken,
      });

      await blackListToken.save();
    } catch (err) {
      throw new AppError(500, "Internal server error", true);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    throw new AppError(401, "Invalid refresh token", true);
  }
};

/**
 * @desc Get current user details
 * @route GET /api/v1/auth/profile
 * @access @private
 * @cookie { accessToken }
 * @returns { user }
 */
const profile = async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(400, "User not log in", false);
  }

  if (!user.isAccountActive) {
    throw new AppError(
      403,
      "Account is deactivated. Please activate your account to perform this action.",
      true,
    );
  }

  res.json({
    user: {
      _id: user._id,
      id: user._id,
      name: user.name,
      username: user.username,
      gender: user.gender,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      profilePic: user.profilePic,
      profession: user.profession,
      bio: user.bio,
      goal: user.goal,
      appLanguage: user.appLanguage,
      createdAt: user.createdAt,
      appLock: {
        isLockEnabled: Boolean(user.appLock?.isLockEnabled),
        hasPasscode: Boolean(user.appLock?.passcode),
        autoLock: user.appLock?.autoLock || "1m",
      },
    },
  });
};

/**
 * @desc Edit current user details
 * @route POST /api/v1/auth/profile
 * @access @private
 * @cookie { accessToken }
 * @returns { user }
 */
const editProfile = async (req, res) => {
  const {
    name,
    username,
    gender,
    email,
    profilePic,
    profession,
    bio,
    goal,
    appLanguage,
  } = req.body;

  const user = req.user;
  if (!user) {
    throw new AppError(400, "User not log in", true);
  }

  if (!user.isAccountActive) {
    throw new AppError(
      403,
      "Account is deactivated. Please activate your account to perform this action.",
      true,
    );
  }

  // Update user fields if they are provided in the request body
  if (name) user.name = name;
  if (gender) user.gender = gender;
  if (profession) user.profession = profession;
  if (bio) user.bio = bio;
  if (goal) user.goal = goal;
  if (appLanguage) user.appLanguage = appLanguage;
  await user.save();

  // Check if the username or email is being updated and if they already exist in the database
  if (username) {
    if (username !== user.username) {
      const existingUser = await User.findOne({ username });
      const reservedUser = await ReserveUsername.findOne({ username });
      if (existingUser || reservedUser) {
        throw new AppError(400, "Username already exists", true);
      }
    }
    user.username = username;
  }
  if (email) {
    if (email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        throw new AppError(400, "Email already exists", true);
      }
    }
    user.email = email;
    user.isEmailVerified = false;
  }
  if (profilePic) {
    // cloud logic
    user.profilePic = profilePic;
  }
  await user.save();

  res.status(200).json({
    message: "Profile updated successfully",
    user: {
      _id: user._id,
      id: user._id,
      name: user.name,
      username: user.username,
      gender: user.gender,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      profilePic: user.profilePic,
      profession: user.profession,
      bio: user.bio,
      goal: user.goal,
      appLanguage: user.appLanguage,
      createdAt: user.createdAt,
      appLock: {
        isLockEnabled: Boolean(user.appLock?.isLockEnabled),
        hasPasscode: Boolean(user.appLock?.passcode),
        autoLock: user.appLock?.autoLock || "1m",
      },
    },
  });
};

/**
 * @desc Edit current user password details
 * @route GET /api/v1/auth/change-password
 * @access @private
 * @cookie { accessToken }
 * @body { oldPassword, newPassword, newConfirmPassword }
 * @returns { user }
 */
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = req.user;

  if (!user) {
    throw new AppError(400, "User not log in", true);
  }

  if (!user.isAccountActive) {
    throw new AppError(
      403,
      "Account is deactivated. Please activate your account to perform this action.",
      true,
    );
  }

  const isPasswordValid = await user.comparePassword(oldPassword);

  if (!isPasswordValid) {
    throw new AppError(401, "Invalid old password", true);
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    message: "Password changed successfully",
  });
};

// Send Reset Password OTP
const resetPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400).json({
      success: false,
      message: "User not exists",
    });
  }

  if (!user.isAccountActive) {
    throw new AppError(
      403,
      "Account is deactivated. Please activate your account to perform this action.",
      true,
    );
  }

  const userVerifyToken = await jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );
  const emailVerifyTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

  user.userVerifyToken = userVerifyToken;
  user.userVerifyTokenExpires = emailVerifyTokenExpires;
  await user.save();

  await emailService.sendResetPasswordEmail(user.email, userVerifyToken);

  res.status(200).json({
    success: true,
    message: "Email sended",
  });
};

// Verify Reset Password OTP and Set Password
const setNewPassword = async (req, res) => {
  const { newPassword } = req.body;
  const token = req.query.token;

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new AppError(400, "Invalid token", true);
  }

  if (!token) {
    throw new AppError(400, "Token is required", true);
  }

  const user = await User.findOne({ userVerifyToken: token });

  if (!user) {
    throw new AppError(400, "Invalid token", true);
  }

  if (!user.isAccountActive) {
    throw new AppError(
      403,
      "Account is deactivated. Please activate your account to perform this action.",
      true,
    );
  }

  if (new Date() > user.userVerifyTokenExpires) {
    throw new AppError(400, "Token has expired", true);
  }

  user.password = newPassword;
  user.userVerifyToken = null;
  user.userVerifyTokenExpires = null;

  await user.save();

  res.status(200).json({
    message: "Password reset successfully",
  });
};

// Delete user and all associated data
const deleteUser = async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new AppError(400, "User not log in", true);
  }
  if (!user.isAccountActive) {
    throw new AppError(
      403,
      "Account is deactivated. Please activate your account to perform this action.",
      true,
    );
  }

  user.deleteIn = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Set deletion date to 30 days from now

  const journals = await Journal.find({ userId: user._id });
  const tasks = await Task.find({ userId: user._id });
  const notes = await Note.find({ userId: user._id });
  const expenses = await Expense.find({ userId: user._id });
  for (const journal of journals) {
    journal.deleteIn = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await journal.save();
  }

  for (const task of tasks) {
    task.deleteIn = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await task.save();
  }

  for (const note of notes) {
    note.deleteIn = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await note.save();
  }

  for (const expense of expenses) {
    expense.deleteIn = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await expense.save();
  }

  user.isAccountActive = false;
  await user.save();

  res.status(200).json({
    message: "User account scheduled for deletion in 30 days",
    success: true,
  });
};

// Activate user and all associated data
const activateAccount = async (req, res) => {
  const { loginId, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: loginId }, { username: loginId }],
  });

  if (!user) {
    throw new AppError(400, "User not log in", true);
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new AppError(401, "Invalid password", true);
  }

  if (user.isAccountActive) {
    throw new AppError(400, "User account is already active", true);
  }

  user.deleteIn = null;

  const journals = await Journal.find({ userId: user._id });
  const tasks = await Task.find({ userId: user._id });
  const notes = await Note.find({ userId: user._id });
  const expenses = await Expense.find({ userId: user._id });
  for (const journal of journals) {
    journal.deleteIn = null;
    await journal.save();
  }

  for (const task of tasks) {
    task.deleteIn = null;
    await task.save();
  }

  for (const note of notes) {
    note.deleteIn = null;
    await note.save();
  }

  for (const expense of expenses) {
    expense.deleteIn = null;
    await expense.save();
  }

  user.isAccountActive = true;

  await user.save();

  res.status(200).json({
    message: "User activated successfully",
    success: true,
  });
};

/**
 * @desc Get App Lock status
 * @route GET /api/v1/auth/app-lock/status
 * @access Private
 */
const getAppLockStatus = async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(401, "User not logged in", true);
  }

  res.status(200).json({
    success: true,
    appLock: {
      isLockEnabled: Boolean(user.appLock?.isLockEnabled),
      hasPasscode: Boolean(user.appLock?.passcode),
      autoLock: user.appLock?.autoLock || "1m",
    },
  });
};

/**
 * @desc Set / Change App Lock passcode
 * @route POST /api/v1/auth/app-lock/set
 * @access Private
 * @body { passcode, autoLock }
 */
const setAppLock = async (req, res) => {
  const { passcode, autoLock } = req.body;
  const user = req.user;
  if (!user) {
    throw new AppError(401, "User not logged in", true);
  }

  if (!passcode || String(passcode).length !== 4) {
    throw new AppError(400, "A 4-digit passcode is required", true);
  }

  const hashed = await bcrypt.hash(String(passcode), 10);
  if (!user.appLock) user.appLock = {};
  user.appLock.passcode = hashed;
  user.appLock.isLockEnabled = true;
  if (autoLock) user.appLock.autoLock = autoLock;

  await user.save();

  res.status(200).json({
    success: true,
    message: "App lock passcode saved successfully",
    appLock: {
      isLockEnabled: true,
      hasPasscode: true,
      autoLock: user.appLock.autoLock || "1m",
    },
  });
};

/**
 * @desc Verify App Lock passcode
 * @route POST /api/v1/auth/app-lock/verify
 * @access Private
 * @body { passcode }
 */
const verifyAppLock = async (req, res) => {
  const { passcode } = req.body;
  const user = req.user;
  if (!user) {
    throw new AppError(401, "User not logged in", true);
  }

  if (!user.appLock?.passcode) {
    return res.status(200).json({
      success: true,
      message: "No passcode set on account",
    });
  }

  const isMatch = await user.comparePasscode(String(passcode));
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: "Incorrect passcode. Try again.",
    });
  }

  res.status(200).json({
    success: true,
    message: "Passcode verified successfully",
  });
};

/**
 * @desc Toggle App Lock enabled state
 * @route POST /api/v1/auth/app-lock/toggle
 * @access Private
 * @body { isLockEnabled }
 */
const toggleAppLock = async (req, res) => {
  const { isLockEnabled } = req.body;
  const user = req.user;
  if (!user) {
    throw new AppError(401, "User not logged in", true);
  }

  if (!user.appLock) user.appLock = {};
  user.appLock.isLockEnabled = Boolean(isLockEnabled);
  await user.save();

  res.status(200).json({
    success: true,
    message: `App lock ${user.appLock.isLockEnabled ? "enabled" : "disabled"}`,
    appLock: {
      isLockEnabled: user.appLock.isLockEnabled,
      hasPasscode: Boolean(user.appLock.passcode),
      autoLock: user.appLock.autoLock || "1m",
    },
  });
};

/**
 * @desc Update App Lock auto-lock timeout
 * @route POST /api/v1/auth/app-lock/settings
 * @access Private
 * @body { autoLock }
 */
const updateAppLockSettings = async (req, res) => {
  const { autoLock } = req.body;
  const user = req.user;
  if (!user) {
    throw new AppError(401, "User not logged in", true);
  }

  if (!user.appLock) user.appLock = {};
  if (autoLock) user.appLock.autoLock = autoLock;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Settings updated successfully",
    appLock: {
      isLockEnabled: Boolean(user.appLock.isLockEnabled),
      hasPasscode: Boolean(user.appLock.passcode),
      autoLock: user.appLock.autoLock || "1m",
    },
  });
};

/**
 * @desc Remove App Lock passcode
 * @route DELETE /api/v1/auth/app-lock
 * @access Private
 * @body { currentPasscode }
 */
const removeAppLock = async (req, res) => {
  const { currentPasscode } = req.body;
  const user = req.user;
  if (!user) {
    throw new AppError(401, "User not logged in", true);
  }

  if (user.appLock?.passcode) {
    const isMatch = await user.comparePasscode(String(currentPasscode));
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect passcode",
      });
    }
  }

  user.appLock = {
    isLockEnabled: false,
    passcode: null,
    autoLock: "1m",
  };
  await user.save();

  res.status(200).json({
    success: true,
    message: "App lock removed successfully",
    appLock: {
      isLockEnabled: false,
      hasPasscode: false,
      autoLock: "1m",
    },
  });
};

/**
 * @desc Forgot Passcode Recovery - verify with Account Password
 * @route POST /api/v1/auth/app-lock/forgot
 * @access Private
 * @body { accountPassword, newPasscode }
 */
const forgotAppLock = async (req, res) => {
  const { accountPassword, newPasscode } = req.body;
  const user = req.user;
  if (!user) {
    throw new AppError(401, "User not logged in", true);
  }

  if (!accountPassword) {
    throw new AppError(400, "Account password is required for identity verification", true);
  }

  const isPasswordValid = await user.comparePassword(accountPassword);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: "Incorrect account password. Verification failed.",
    });
  }

  if (newPasscode) {
    if (String(newPasscode).length !== 4) {
      throw new AppError(400, "New passcode must be exactly 4 digits", true);
    }
    const hashed = await bcrypt.hash(String(newPasscode), 10);
    user.appLock.passcode = hashed;
    user.appLock.isLockEnabled = true;
  } else {
    // If no new passcode is given, unlock and disable the passcode
    user.appLock = {
      isLockEnabled: false,
      passcode: null,
      autoLock: "1m",
    };
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: newPasscode
      ? "Passcode reset successfully"
      : "Passcode removed and app unlocked successfully",
    appLock: {
      isLockEnabled: user.appLock.isLockEnabled,
      hasPasscode: Boolean(user.appLock.passcode),
      autoLock: user.appLock.autoLock || "1m",
    },
  });
};

export default {
  register,
  verifyEmailOtp,
  reserveUsername,
  login,
  logout,
  sendOtp,
  getMe,
  profile,
  editProfile,
  changePassword,
  resetPassword,
  setNewPassword,
  deleteUser,
  activateAccount,
  getAppLockStatus,
  setAppLock,
  verifyAppLock,
  toggleAppLock,
  updateAppLockSettings,
  removeAppLock,
  forgotAppLock,
};
