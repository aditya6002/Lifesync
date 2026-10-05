import mongoose from "mongoose";
import expenseList from "../../utils/expenseList.js";

const expenseSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
      enum: expenseList,
    },
    note: {
      type: String,
      trim: true,
      length: {
        min: 0,
        max: 100,
      },
    },
    amount: {
      type: String,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
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

const Expense =
  mongoose.models.Expense || mongoose.model("Expense", expenseSchema);

export default Expense;
