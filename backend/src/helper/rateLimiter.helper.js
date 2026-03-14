const RateLimit = require("../models/rateLimiter.model");

// ============================================
// CONFIGURATION
// ============================================
const LIMITS = {
  LOGIN: {
    maxAttempts: 5,
    lockTime: 15 * 60 * 1000, // 15 minutes
    resetTime: 30 * 60 * 1000, // 30 minutes
  },
  SIGNUP: {
    maxAttempts: 6,
    lockTime: 30 * 60 * 1000, // 30 minutes
    resetTime: 60 * 60 * 1000, // 60 minutes
  },
  PASSWORD_RESET: {
    maxAttempts: 5,
    lockTime: 20 * 60 * 1000, // 20 minutes
    resetTime: 60 * 60 * 1000, // 60 minutes
  },
  OTP_VERIFICATION: {
    maxAttempts: 3,
    lockTime: 10 * 60 * 1000, // 10 minutes
    resetTime: 30 * 60 * 1000, // 30 minutes
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generic rate limit check function (with MongoDB)
 * @param {string} identifier - Email or IP address
 * @param {string} operationType - login, signup, password_reset, otp_verification
 * @param {object} limits - Limit configuration
 * @param {string} ipAddress - IP address (optional)
 * @returns {Promise<object>} - Rate limit check result
 */
async function checkGenericRateLimit(
  identifier,
  operationType,
  limits,
  ipAddress = null,
) {
  try {
    const now = new Date();

    // Database se record dhundo
    let record = await RateLimit.findOne({ identifier, operationType });

    // Agar record nahi hai
    if (!record) {
      // Naya record banao
      record = new RateLimit({
        identifier,
        operationType,
        attemptCount: 1,
        lastAttemptTime: now,
        ipAddress,
      });
      await record.save();

      return {
        allowed: true,
        attemptsLeft: limits.maxAttempts - 1,
        message: "First attempt",
      };
    }

    // Check: Agar reset time pass ho gaya?
    const timeDifference = now - new Date(record.lastAttemptTime);
    if (timeDifference > limits.resetTime) {
      // Reset karo
      await record.resetAttempts();
      return {
        allowed: true,
        attemptsLeft: limits.maxAttempts - 1,
        message: "Attempts reset",
      };
    }

    // Check: Agar currently locked hai?
    if (record.isCurrentlyLocked()) {
      const remainingTime = record.getRemainingLockTime();
      return {
        allowed: false,
        reason: `Too many attempts. Try again in ${remainingTime} seconds`,
        remainingTime,
        locked: true,
        lockedUntil: record.lockedUntil,
      };
    }

    // Check: Agar max attempts exceed ho gayin?
    if (record.attemptCount >= limits.maxAttempts) {
      // Lock karo
      await record.lockAccount(limits.lockTime);

      return {
        allowed: false,
        reason: `Too many attempts. Locked for ${Math.ceil(limits.lockTime / 60000)} minutes`,
        locked: true,
        lockedUntil: record.lockedUntil,
      };
    }

    // Otherwise allow karo
    return {
      allowed: true,
      attemptsLeft: limits.maxAttempts - record.attemptCount,
      attemptCount: record.attemptCount,
    };
  } catch (error) {
    console.error("Rate limit check error:", error);
    // Safety: Database fail ho to allow karo (security better than user block)
    return { allowed: true, error: error.message };
  }
}

/**
 * Record failed attempt
 */
async function recordGenericFailedAttempt(
  identifier,
  operationType,
  email = null,
  ipAddress = null,
) {
  try {
    let record = await RateLimit.findOne({ identifier, operationType });

    if (!record) {
      record = new RateLimit({
        identifier,
        operationType,
        attemptCount: 1,
        ipAddress,
      });
    } else {
      await record.incrementAttempt();
    }

    // Add failed email agar signup/password reset ke liye
    if (email) {
      await record.addFailedEmail(email);
    }

    await record.save();
  } catch (error) {
    console.error("Failed to record attempt:", error);
  }
}

/**
 * Clear attempts from database
 */
async function clearGenericAttempts(identifier, operationType) {
  try {
    await RateLimit.deleteOne({ identifier, operationType });
  } catch (error) {
    console.error("Failed to clear attempts:", error);
  }
}

/**
 * Get attempt info from database
 */
async function getGenericAttemptInfo(identifier, operationType) {
  try {
    const record = await RateLimit.findOne({ identifier, operationType });
    return record ? record.toObject() : null;
  } catch (error) {
    console.error("Failed to get attempt info:", error);
    return null;
  }
}

// ============================================
// LOGIN RATE LIMITING
// ============================================

/**
 * Check if login attempt allowed
 * @param {string} email - User email
 * @param {string} ipAddress - IP address (optional)
 * @returns {Promise<object>} - Rate limit status
 */
async function checkLoginAttempt(email, ipAddress = null) {
  return checkGenericRateLimit(email, "login", LIMITS.LOGIN, ipAddress);
}

/**
 * Record failed login attempt
 * @param {string} email - User email
 * @param {string} ipAddress - IP address (optional)
 */
async function recordFailedLoginAttempt(email, ipAddress = null) {
  return recordGenericFailedAttempt(email, "login", null, ipAddress);
}

/**
 * Clear login attempts after successful login
 * @param {string} email - User email
 */
async function clearLoginAttempts(email) {
  return clearGenericAttempts(email, "login");
}

/**
 * Get login attempt info
 * @param {string} email - User email
 * @returns {Promise<object>} - Attempt details
 */
async function getLoginAttemptInfo(email) {
  return getGenericAttemptInfo(email, "login");
}

// ============================================
// SIGNUP RATE LIMITING
// ============================================

/**
 * Check if signup attempt allowed (by IP)
 * @param {string} ipOrIdentifier - IP address or unique identifier
 * @returns {Promise<object>} - Rate limit status
 */
async function checkSignupAttempt(ipOrIdentifier) {
  return checkGenericRateLimit(ipOrIdentifier, "signup", LIMITS.SIGNUP);
}

/**
 * Record failed signup attempt
 * @param {string} ipOrIdentifier - IP address
 * @param {string} email - Email being signed up
 */
async function recordFailedSignupAttempt(ipOrIdentifier, email) {
  return recordGenericFailedAttempt(ipOrIdentifier, "signup", email);
}

/**
 * Clear signup attempts after successful signup
 * @param {string} ipOrIdentifier - IP address
 */
async function clearSignupAttempts(ipOrIdentifier) {
  return clearGenericAttempts(ipOrIdentifier, "signup");
}

/**
 * Get signup attempt info
 * @param {string} ipOrIdentifier - IP address
 * @returns {Promise<object>} - Attempt details
 */
async function getSignupAttemptInfo(ipOrIdentifier) {
  return getGenericAttemptInfo(ipOrIdentifier, "signup");
}

// ============================================
// PASSWORD RESET RATE LIMITING
// ============================================

/**
 * Check if password reset attempt allowed
 * @param {string} email - User email
 * @param {string} ipAddress - IP address (optional)
 * @returns {Promise<object>} - Rate limit status
 */
async function checkPasswordResetAttempt(email, ipAddress = null) {
  return checkGenericRateLimit(
    email,
    "password_reset",
    LIMITS.PASSWORD_RESET,
    ipAddress,
  );
}

/**
 * Record failed password reset attempt
 * @param {string} email - User email
 * @param {string} ipAddress - IP address (optional)
 */
async function recordFailedPasswordResetAttempt(email, ipAddress = null) {
  return recordGenericFailedAttempt(email, "password_reset", null, ipAddress);
}

/**
 * Clear password reset attempts
 * @param {string} email - User email
 */
async function clearPasswordResetAttempts(email) {
  return clearGenericAttempts(email, "password_reset");
}

/**
 * Get password reset attempt info
 * @param {string} email - User email
 * @returns {Promise<object>} - Attempt details
 */
async function getPasswordResetAttemptInfo(email) {
  return getGenericAttemptInfo(email, "password_reset");
}

// ============================================
// OTP VERIFICATION RATE LIMITING
// ============================================

/**
 * Check if OTP verification attempt allowed
 * @param {string} email - User email
 * @param {string} ipAddress - IP address (optional)
 * @returns {Promise<object>} - Rate limit status
 */
async function checkOtpVerificationAttempt(email, ipAddress = null) {
  return checkGenericRateLimit(
    email,
    "otp_verification",
    LIMITS.OTP_VERIFICATION,
    ipAddress,
  );
}

/**
 * Record failed OTP verification attempt
 * @param {string} email - User email
 * @param {string} ipAddress - IP address (optional)
 */
async function recordFailedOtpVerificationAttempt(email, ipAddress = null) {
  return recordGenericFailedAttempt(email, "otp_verification", null, ipAddress);
}

/**
 * Clear OTP verification attempts
 * @param {string} email - User email
 */
async function clearOtpVerificationAttempts(email) {
  return clearGenericAttempts(email, "otp_verification");
}

/**
 * Get OTP verification attempt info
 * @param {string} email - User email
 * @returns {Promise<object>} - Attempt details
 */
async function getOtpVerificationAttemptInfo(email) {
  return getGenericAttemptInfo(email, "otp_verification");
}

// ============================================
// ADMIN & UTILITY FUNCTIONS
// ============================================

/**
 * Get statistics about rate limiting
 * @returns {Promise<object>} - Stats for all operations
 */
async function getStatistics() {
  try {
    const stats = await RateLimit.getStatistics();
    const total = await RateLimit.countDocuments();

    return {
      byOperationType: stats,
      totalRecords: total,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("Statistics error:", error);
    return { error: error.message };
  }
}

/**
 * Clear all attempts for a user (across all operations)
 * @param {string} identifier - Email or IP
 */
async function clearAllAttempts(identifier) {
  try {
    const result = await RateLimit.deleteMany({ identifier });
    return {
      success: true,
      message: `Deleted ${result.deletedCount} records for ${identifier}`,
      deletedCount: result.deletedCount,
    };
  } catch (error) {
    console.error("Clear all attempts error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Force unlock a user (admin function)
 * @param {string} identifier - Email or IP
 * @param {string} operationType - Type: 'login', 'signup', 'password_reset', 'otp_verification'
 */
async function forceUnlock(identifier, operationType = "login") {
  try {
    const record = await RateLimit.forceUnlock(identifier, operationType);

    if (record) {
      return {
        success: true,
        message: `${operationType} attempts unlocked for ${identifier}`,
        record,
      };
    }

    return { success: false, message: "No record found" };
  } catch (error) {
    console.error("Force unlock error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get all records for an identifier
 * @param {string} identifier - Email or IP
 */
async function getRecordsByIdentifier(identifier) {
  try {
    const records = await RateLimit.getRecordsByIdentifier(identifier);
    return { success: true, records };
  } catch (error) {
    console.error("Get records error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Cleanup old records (Optional - TTL index already handles this)
 */
async function cleanupOldRecords() {
  try {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const result = await RateLimit.deleteMany({
      lastAttemptTime: { $lt: twoHoursAgo },
    });

    console.log(`Cleaned up ${result.deletedCount} old records`);
    return { success: true, deletedCount: result.deletedCount };
  } catch (error) {
    console.error("Cleanup error:", error);
    return { success: false, error: error.message };
  }
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
  // Login functions
  checkLoginAttempt,
  recordFailedLoginAttempt,
  clearLoginAttempts,
  getLoginAttemptInfo,

  // Signup functions
  checkSignupAttempt,
  recordFailedSignupAttempt,
  clearSignupAttempts,
  getSignupAttemptInfo,

  // Password Reset functions
  checkPasswordResetAttempt,
  recordFailedPasswordResetAttempt,
  clearPasswordResetAttempts,
  getPasswordResetAttemptInfo,

  // OTP Verification functions
  checkOtpVerificationAttempt,
  recordFailedOtpVerificationAttempt,
  clearOtpVerificationAttempts,
  getOtpVerificationAttemptInfo,

  // Admin & Utility functions
  cleanupOldRecords,
  clearAllAttempts,
  getStatistics,
  forceUnlock,
  getRecordsByIdentifier,
  LIMITS, // Export config if needed
};
