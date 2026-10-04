import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: true,
      trim: true,
    },
    note: {
      type: String,
      default: null,
      trim: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    startingTime: {
      type: String,
      default: null,
      required: true,
    },
    endingTime: {
      type: String,
      default: null,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
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
