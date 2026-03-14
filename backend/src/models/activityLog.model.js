// src/models/ActivityLog.js
const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    module: {
      type: String,
      enum: ["expenses", "journal", "notes", "tasks", "ai"],
      required: true,
    },
    action: {
      type: String,
      enum: ["created", "updated", "deleted", "completed", "viewed"],
      required: true,
    },
    entityId: { type: mongoose.Schema.Types.ObjectId },
    entityName: { type: String },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
    // date only field for heatmap grouping
    date: { type: String, index: true }, // "2026-03-11"
  },
  { timestamps: true },
);

// Compound index for fast user+date queries
activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model("ActivityLog", activityLogSchema);
