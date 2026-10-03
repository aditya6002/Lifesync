import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
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
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);

export default Note;
