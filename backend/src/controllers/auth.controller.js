const bcryptjs = require("bcryptjs");
const User = require("../models/user.model");
const UsernameReservation = require("../models/usernameReservation.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const AppError = require("../middleware/AppError");
const nodemailer = require("nodemailer");

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

// Helper function to send email verification
async function sendEmail(email, emailVerificationToken) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verificationLink = `http://localhost:8080/auth/verify-email?token=${emailVerificationToken}`;

  (async () => {
    const info = await transporter.sendMail({
      from: `"LifeSync " <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Verify Your Email",
      text: `
Hi,

Please verify your email by clicking the link below:
${verificationLink}

If you didn’t create this account, you can ignore this email.
  `,
      html: `
  <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
    <h3>Verify Your Email</h3>
    <p>Please confirm your email address to continue.</p>
    
    <a href="${verificationLink}" 
      style="display: inline-block; padding: 10px 20px; 
              background-color: #4f46e5; color: #ffffff; 
              text-decoration: none; border-radius: 5px;">
      Verify Email
    </a>

    <p style="margin-top: 15px; font-size: 12px; color: #777;">
      If you didn’t create this account, just ignore this email.
    </p>
  </div>
  `,
    });
  })().catch(console.error);
}

async function sendResetPasswordEmail(email, resetToken) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetLink = `http://localhost:8080/auth/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: `"LifeSync" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Reset Your Password (Valid for 10 Minutes)",
    text: `
Hi,

You requested to reset your password.

Click the link below to reset your password:
${resetLink}

⚠ This link will expire in 10 minutes.

If you did not request a password reset, please ignore this email.
    `,
    html: `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
      <h3>Reset Your Password</h3>
      <p>You requested to reset your password.</p>

      <a href="${resetLink}"
        style="display: inline-block; padding: 12px 24px;
               background-color: #ef4444; color: #ffffff;
               text-decoration: none; border-radius: 6px;">
        Reset Password
      </a>

      <p style="margin-top: 15px; font-size: 14px;">
        ⏳ This link will expire in <strong>10 minutes</strong>.
      </p>

      <p style="margin-top: 15px; font-size: 12px; color: #777;">
        If you didn’t request this, you can safely ignore this email.
      </p>
    </div>
    `,
  });
}

async function sendOTP(email, otp) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  (async () => {
    const info = await transporter.sendMail({
      from: `"LifeSync " <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Verify Your Email",
      text: `
          Hi,
          Your One-Time Password (OTP) for verification is: ${otp}
          This OTP is valid for 10 minutes.
          If you did not request this, please ignore this email.

          Thanks,
          LifeSync Team
  `,
      html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
            <div style="max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px;">

              <h2 style="text-align: center; color: #333;">Verify Your Email</h2>

              <p>Hi,</p>

              <p>Your One-Time Password (OTP) for verification is:</p>

              <div style="text-align: center; margin: 20px 0;">
                <span style="font-size: 28px; letter-spacing: 5px; font-weight: bold; color: #4CAF50;">
                  ${otp}
                </span>
              </div>

              <p>This OTP is valid for <strong>10 minutes</strong>.</p>

              <p>If you did not request this, please ignore this email.</p>

              <p style="margin-top: 30px;">Thanks,<br/>LifeSync</p>

            </div>
          </div>
          `,
    });
  })().catch(console.error);
}
