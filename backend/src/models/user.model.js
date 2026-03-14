const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // Basic user information
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, unique: true, sparse: true, default: "" },
    location: { type: String, default: "" },

    workPlace: { type: String, default: "" },
    yearOrRole: {
      type: String,
      default: "",
      enum: [
        "1st Year",
        "2nd Year",
        "3rd Year",
        "4th Year",
        "Graduate",
        "Postgraduate",
        "Professional",
        "Freelancer",
        "Other",
      ],
    },
    profession: {
      type: String,
      default: "",
      enum: ["student", "professional", "other"],
    },
    goal: { type: String, default: "" },
    bio: { type: String, default: "" },

    preferredLanguage: { type: String, default: "en" },

    isEmailVerified: { type: Boolean, default: false },
    emailVerificationCode: { type: String },
    emailVerificationCodeExpires: { type: Date },

    resetPasswordToken: { type: String },
    resetPasswordTokenExpires: { type: Date },

    // Admin approval fields
    isApproved: { type: Boolean, default: true },
    appPassword: { type: String },
    password: { type: String, required: true },

    isAccountLocked: { type: Boolean, default: false },
    accountLockedUntil: { type: Date },

    profilePictureUrl: { type: String, default: null },
  },
  { timestamps: true },
);

userSchema.methods.isAccountCurrentlyLocked = function () {
  if (!this.isAccountLocked) return false;
  if (!this.accountLockedUntil) return true;
  return new Date() < this.accountLockedUntil;
};

userSchema.methods.lockAccount = function (durationMinutes) {
  this.isAccountLocked = true;
  if (durationMinutes) {
    this.accountLockedUntil = new Date(
      Date.now() + durationMinutes * 60 * 1000,
    );
  } else {
    this.accountLockedUntil = null;
  }
  return this.save();
};

userSchema.methods.unlockAccount = function () {
  this.isAccountLocked = false;
  this.accountLockedUntil = null;
  return this.save();
};

userSchema.methods.getRemainingLockTime = function () {
  if (!this.isAccountLocked || !this.accountLockedUntil) return 0;
  const remaining = this.accountLockedUntil - new Date();
  return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
};

userSchema.methods.addFailedEmailAttempt = function (email) {
  return Promise.resolve();
};

userSchema.methods.resetFailedEmailAttempts = function () {
  return Promise.resolve();
};

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
