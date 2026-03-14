const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

userSchema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
