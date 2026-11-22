import mongoose from "mongoose";

const expenseList = [
  "food",
  "transportation",
  "utilities",
  "entertainment",
  "healthcare",
  "education",
  "personal care",
  "clothing",
  "gifts and donations",
  "travel",
  "subscriptions and memberships",
  "miscellaneous",
  "housing",
  "insurance",
  "savings and investments",
  "debt payments",
  "childcare",
  "pet care",
  "home maintenance",
  "taxes",
  "emergency fund",
  "retirement contributions",
  "luxury items",
  "professional development",
  "hobbies",
  "transportation maintenance",
  "home improvement",
  "technology and gadgets",
  "fitness and wellness",
  "social activities",
  "cultural experiences",
  "charitable contributions",
  "financial services",
  "legal expenses",
  "salary",
  "freelance",
  "investment",
  "bonus",
  "business",
  "others"
];

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "",
    },
    type: {
      type: String,
      enum: ["expense", "income"],
      default: "expense",
    },
    category: {
      type: String,
      required: true,
      trim: true,
      default: "others",
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
    amount: {
      type: Number,
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
  { timestamps: true }
);

const Expense =
  mongoose.models.Expense || mongoose.model("Expense", expenseSchema);

export default Expense;
