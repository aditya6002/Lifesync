import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import getOtp from "../helper/getOTP.js";
import emailService from "../services/email.services.js";

/**
 * @desc Register a new user
 * @route POST /api/v1/auth/register
 * @access Public
 * @body { name, username, email, password, profession }
 * @returns { user, token }
 */
const register = async (req, res) => {
  try {
    // Check if all required fields are present and not empty
    const { name, username, email, password, profession } = req?.body || {};
    if (
      !name ||
      !username ||
      !email ||
      !password ||
      !profession ||
      !name.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !profession.trim()
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (name.length < 3 || name.length > 50) {
      return res.status(400).json({
        message: "Name must be between 3 and 50 characters",
      });
    }

    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({
        message: "Username must be between 3 and 30 characters",
      });
    }

    if (password.length < 6 || password.length > 100) {
      return res.status(400).json({
        message: "Password must be between 6 and 100 characters",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // Validate profession
    const validProfessions = [
      "student",
      "professional",
      "freelancer",
      "entrepreneur",
      "retired",
      "unemployed",
      "artist",
      "content_creator",
      "researcher",
      "educator",
      "healthcare_worker",
      "engineer",
      "scientist",
      "developer",
      "designer",
      "writer",
      "musician",
      "athlete",
      "other",
    ];

    if (!validProfessions.includes(profession.toLowerCase())) {
      return res.status(400).json({
        message: `Profession must be one of the following: ${validProfessions.join(", ")}`,
      });
    }

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
      email,
      password,
      profession,
      emailVerifyToken: hashOtp,
      emailVerifyTokenExpires,
    });
    await newUser.save();

    await emailService.sendOTP(email, otp);

    // Generate access and refresh tokens
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
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        profilePic: newUser.profilePic,
        username: newUser.username,
      },
      token: accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log("Register new User Error", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export default {
  register,
};
