const mongoose = require("mongoose");

const rateLimitSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    operationType: {
      type: String,
      enum: ["login", "signup", "password_reset", "otp_verification"],
      required: true,
      index: true,
    },

    attemptCount: {
      type: Number,
      default: 1,
      min: 0,
      max: 1000,
    },

    lastAttemptTime: {
      type: Date,
      default: Date.now,
      index: true,
    },

    lockedUntil: {
      type: Date,
      default: null,
    },

    isLocked: {
      type: Boolean,
      default: false,
      index: true,
    },

    failedEmails: {
      type: [String],
      default: [],
    },

    ipAddress: {
      type: String,
      default: null,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    metadata: {
      userAgent: String,
      device: String,
      location: String,
    },

    unlockedBy: {
      type: String,
      enum: ["auto", "admin", "user_request"],
      default: null,
    },

    notes: String,
  },
  {
    timestamps: true,
    collection: "rateLimits",
  },
);

rateLimitSchema.index({ identifier: 1, operationType: 1 });

rateLimitSchema.index(
  { lastAttemptTime: 1 },
  { expireAfterSeconds: 7200 }, // 2 hours
);

rateLimitSchema.index({ isLocked: 1, lockedUntil: 1 });

rateLimitSchema.methods.incrementAttempt = function () {
  this.attemptCount += 1;
  this.lastAttemptTime = new Date();
  return this.save();
};

rateLimitSchema.methods.lockAccount = function (lockTime) {
  this.isLocked = true;
  this.lockedUntil = new Date(Date.now() + lockTime);
  return this.save();
};

rateLimitSchema.methods.unlockAccount = function (unlockedBy = "auto") {
  this.isLocked = false;
  this.lockedUntil = null;
  this.unlockedBy = unlockedBy;
  return this.save();
};

rateLimitSchema.methods.resetAttempts = function () {
  this.attemptCount = 1;
  this.lastAttemptTime = new Date();
  this.isLocked = false;
  this.lockedUntil = null;
  this.failedEmails = [];
  return this.save();
};

rateLimitSchema.methods.isCurrentlyLocked = function () {
  if (!this.lockedUntil) return false;
  return new Date() < this.lockedUntil;
};

rateLimitSchema.methods.addFailedEmail = function (email) {
  if (!this.failedEmails.includes(email)) {
    this.failedEmails.push(email);
  }
  return this.save();
};

rateLimitSchema.methods.getRemainingLockTime = function () {
  if (!this.lockedUntil) return 0;
  const remaining = this.lockedUntil - new Date();
  return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
};

rateLimitSchema.statics.findOrCreate = async function (
  identifier,
  operationType,
) {
  let record = await this.findOne({ identifier, operationType });

  if (!record) {
    record = new this({
      identifier,
      operationType,
    });
    await record.save();
  }

  return record;
};

rateLimitSchema.statics.clearAttempts = async function (
  identifier,
  operationType,
) {
  return this.deleteOne({ identifier, operationType });
};

rateLimitSchema.statics.getRecordsByIdentifier = async function (identifier) {
  return this.find({ identifier });
};

rateLimitSchema.statics.forceUnlock = async function (
  identifier,
  operationType,
) {
  return this.findOneAndUpdate(
    { identifier, operationType },
    {
      isLocked: false,
      lockedUntil: null,
      unlockedBy: "admin",
    },
    { new: true },
  );
};

rateLimitSchema.statics.getStatistics = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: "$operationType",
        count: { $sum: 1 },
        lockedCount: { $sum: { $cond: ["$isLocked", 1, 0] } },
      },
    },
  ]);

  return stats;
};

const RateLimit = mongoose.model("RateLimit", rateLimitSchema);

module.exports = RateLimit;
