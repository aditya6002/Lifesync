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
    achievements: {
      type: Array[
        {
          title: String,
          icon: String,
          description: String,
          isAchievement: Boolean,
          date: Date,
        }
      ],
      default: [
        {
          title: "7-Day Streak",
          icon: "🔥",
          description: "Journaled 7 days in a row",
          isAchievement: false,
          date: Date,
        },
        {
          title: "30-Day Streak",
          description: "Journal 30 days consecutively",
          icon: "🌟",
          isAchievement: false,
          date: Date,
        },
        {
          title: "Goal Achiever",
          icon: "🎯",
          description: "Complete all tasks in a week",
          isAchievement: false,
          date: Date,
        },
        {
          title: "Budget Master",
          icon: "💰",
          description: "Stayed under budget for a month",
          isAchievement: false,
          date: Date,
        },
        {
          title: "Power User",
          icon: "💎",
          description: "Used the app for 100 days",
          isAchievement: false,
          date: Date,
        },
        {
          title: "Zen Master",
          icon: "🧘",
          description: "Log positive mood for 14 days",
          isAchievement: false,
          date: Date,
        },
        {
          title: "Task Crusher",
          icon: "🚀",
          description: "Completed 100+ tasks in a month",
          isAchievement: false,
          date: Date,
        },
        {
          title: "Knowledge Keeper",
          icon: "📚",
          description: "Created 200+ notes",
          isAchievement: false,
          date: Date,
        },
        {
          title: "Consistency King/Queen",
          description: "Journaled 1000 entries",
          icon: "🏆",
          isAchievement: false,
          date: Date,
        },
        {
          title: "Year-Round Journaler",
          description: "Journaled every day for a year",
          icon: "📅",
          isAchievement: false,
          date: Date,
        },
      ],
    },

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
