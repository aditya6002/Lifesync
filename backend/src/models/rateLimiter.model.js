const mongoose = require("mongoose");

// ============================================
// RATE LIMIT SCHEMA - Sab operations ke liye
// ============================================

/**
 * Ye schema sab tarah ke rate limiting track karega:
 * - Login attempts
 * - Signup attempts
 * - Password reset attempts
 * - OTP verification attempts
 */
const rateLimitSchema = new mongoose.Schema(
  {
    // Unique identifier (email, IP, phone, etc.)
    identifier: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true, // Fast searching ke liye
    },

    // Kaunsa operation hai?
    operationType: {
      type: String,
      enum: ["login", "signup", "password_reset", "otp_verification"],
      required: true,
      index: true,
    },

    // Attempts ka count
    attemptCount: {
      type: Number,
      default: 1,
      min: 0,
    },

    // Last attempt ka time
    lastAttemptTime: {
      type: Date,
      default: Date.now,
      index: true,
    },

    // Account lock time
    lockedUntil: {
      type: Date,
      default: null,
    },

    // Kya account locked hai?
    isLocked: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Jitne emails failed huye (signup ke liye helpful)
    failedEmails: {
      type: [String],
      default: [],
    },

    // IP address (kaun se device se attempt hua)
    ipAddress: {
      type: String,
      default: null,
    },

    // User ka ID (agar registered hai)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Additional metadata
    metadata: {
      userAgent: String,
      device: String,
      location: String,
    },

    // Unlock reason (admin unlock ke liye)
    unlockedBy: {
      type: String,
      enum: ["auto", "admin", "user_request"],
      default: null,
    },

    // Notes
    notes: String,
  },
  {
    timestamps: true, // createdAt, updatedAt automatically add hoga
    collection: "rateLimits",
  },
);

// ============================================
// INDEXES
// ============================================

// Compound index: fast search with multiple fields
rateLimitSchema.index({ identifier: 1, operationType: 1 });

// TTL Index: Automatically delete records after 2 hours
// Ye memory waste nahi hoga
rateLimitSchema.index(
  { lastAttemptTime: 1 },
  { expireAfterSeconds: 7200 }, // 2 hours
);

// Index for locked accounts
rateLimitSchema.index({ isLocked: 1, lockedUntil: 1 });

// ============================================
// METHODS
// ============================================

/**
 * Increment attempt count
 */
rateLimitSchema.methods.incrementAttempt = function () {
  this.attemptCount += 1;
  this.lastAttemptTime = new Date();
  return this.save();
};

/**
 * Lock the account
 */
rateLimitSchema.methods.lockAccount = function (lockTime) {
  this.isLocked = true;
  this.lockedUntil = new Date(Date.now() + lockTime);
  return this.save();
};

/**
 * Unlock the account
 */
rateLimitSchema.methods.unlockAccount = function (unlockedBy = "auto") {
  this.isLocked = false;
  this.lockedUntil = null;
  this.unlockedBy = unlockedBy;
  return this.save();
};

/**
 * Reset attempts
 */
rateLimitSchema.methods.resetAttempts = function () {
  this.attemptCount = 1;
  this.lastAttemptTime = new Date();
  this.isLocked = false;
  this.lockedUntil = null;
  this.failedEmails = [];
  return this.save();
};

/**
 * Check if locked and still valid
 */
rateLimitSchema.methods.isCurrentlyLocked = function () {
  if (!this.lockedUntil) return false;
  return new Date() < this.lockedUntil;
};

/**
 * Add failed email
 */
rateLimitSchema.methods.addFailedEmail = function (email) {
  if (!this.failedEmails.includes(email)) {
    this.failedEmails.push(email);
  }
  return this.save();
};

/**
 * Get remaining lock time in seconds
 */
rateLimitSchema.methods.getRemainingLockTime = function () {
  if (!this.lockedUntil) return 0;
  const remaining = this.lockedUntil - new Date();
  return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
};

// ============================================
// STATIC METHODS
// ============================================

/**
 * Find or create rate limit record
 */
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

/**
 * Clear all attempts for an identifier
 */
rateLimitSchema.statics.clearAttempts = async function (
  identifier,
  operationType,
) {
  return this.deleteOne({ identifier, operationType });
};

/**
 * Get all records for an identifier
 */
rateLimitSchema.statics.getRecordsByIdentifier = async function (identifier) {
  return this.find({ identifier });
};

/**
 * Admin force unlock
 */
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

/**
 * Get statistics
 */
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

// ============================================
// EXPORT MODEL
// ============================================

const RateLimit = mongoose.model("RateLimit", rateLimitSchema);

module.exports = RateLimit;
