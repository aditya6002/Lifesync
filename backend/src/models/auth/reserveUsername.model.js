import mongoose from "mongoose";

const reserveUsernameSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    expireAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
      index: { expires: 0 },
    },
  },
  { timestamps: true },
);

const ReserveUsername =
  mongoose.models.ReserveUsername ||
  mongoose.model("ReserveUsername", reserveUsernameSchema);

export default ReserveUsername;
