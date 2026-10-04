import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: "task",
      trim: true,
      lowercase: true,
      enum: ["task", "inbox"],
    },
    task: {
      type: String,
      required: true,
      trim: true,
    },
    note: {
      type: String,
      trim: true,
      default: null,
      trim: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    startingTime: {
      type: Date,
      default: null,
      required: true,
    },
    endingTime: {
      type: Date,
      default: null,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      trim: true,
      lowercase: true,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: Boolean,
      default: false,
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

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

export default Task;
