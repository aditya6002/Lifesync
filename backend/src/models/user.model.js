const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Basic user information
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationCode: { type: String },
    emailVerificationCodeExpires: { type: Date },

    resetPasswordToken: { type: String },
    resetPasswordTokenExpires: { type: Date },

    // Admin approval fields
    isApproved: { type: Boolean, default: true },
    appPassword: { type: String },
    password: { type: String, required: true },

    // // References to other models
    // tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    // notes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Note" }],
    // diaries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Diary" }],
    // expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Expense" }],
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
