import mongoose from "mongoose";
import bcrypt from "bcrypt";

const profession = [
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

/**

 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9_-]{3,20}$/,
        "Username can only contain letters, numbers, underscores, and hyphens",
      ],
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "others"],
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      immutable: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    isEmailVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    emailVerifyToken: {
      type: String,
      required: true,
      default: null,
    },
    emailVerifyTokenExpires: {
      type: Date,
      default: null,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordTokenExpires: {
      type: Date,
      default: null,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    profilePic: {
      type: String,
      default:
        "https://images.unsplash.com/vector-1745610393569-9373c9c64117?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YXZhdGFyc3xlbnwwfHwwfHx8MA%3D%3D",
    },
    profession: {
      type: String,
      default: "other",
      enum: profession,
      trim: true,
      lowercase: true,
    },
    bio: {
      type: String,
      default: null,
      trim: true,
    },
    goals: {
      type: String,
      default: null,
      trim: true,
    },
    appLanguage: {
      type: String,
      default: "en",
    },
  },
  { timestamps: true },
);

userSchema.methods.comparePassword = async (password) => {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.verifyEmailToken = async (token) => {
  return await bcrypt.compare(token, this.emailVerifyToken);
};

userSchema.methods.verifyResetPasswordToken = async (token) => {
  return await bcrypt.compare(token, this.resetPasswordToken);
};

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model.User || mongoose.model("User", userSchema);

export default User;
