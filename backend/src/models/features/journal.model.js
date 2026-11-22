import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    mood: {
      type: String,
      default: null,
      trim: true,
      lowercase: true,
    },
    tags: {
      type: String,
      length: { min: 2, max: 50 },
      trim: true,
      default: null,
      lowercase: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    deleteIn: {
      type: Date,
      default: null,
      index: {
        expireAfterSeconds: 0,
      },
    },
  },
  { timestamps: true },
);

const Journal =
  mongoose.models.Journal || mongoose.model("Journal", journalSchema);

export default Journal;
