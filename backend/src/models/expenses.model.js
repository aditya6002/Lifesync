const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    amount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now, required: true },
    category: {
      type: String,
      enum: [
        "Income",
        "Food",
        "Shopping",
        "Travel",
        "Study",
        "Health",
        "Entertainment",
        "Other",
      ],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Expense", expenseSchema);
