import mongoose from "mongoose";

const blackListTokenSchema = new mongoose.Schema(
  {
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      index: { expires: 0 },
    },
  },
  { timestamps: true },
);

const BlackList =
  mongoose.models.BlackList ||
  mongoose.model("BlackList", blackListTokenSchema);

export default BlackList;
