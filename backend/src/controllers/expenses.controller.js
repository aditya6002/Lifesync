const Expenses = require("../models/expenses.model.js");
const AppError = require("../middleware/AppError.js");

// New Expense
const createExpenses = async (req, res) => {
  const { title, content, amount, createdAt = new Date() } = req.body;

  if (
    !title ||
    !title.trim() ||
    !content ||
    !content.trim() ||
    !amount ||
    !amount.trim()
  ) {
    throw new AppError("Required all field", 400);
  }

  const newExpense = await Expenses.create({
    title,
    content,
    amount,
    createdAt,
    userId: req.user.id,
  });

  res.status(201).json({ success: true, message: "created", newExpense });
};

// Get Expense
const getDataByMonth = async (req, res) => {
  const { month, year, skip, limit } = req.params;

  const monthNum = Number(month);
  const yearNum = Number(year);
  if (
    !monthNum ||
    monthNum < 1 ||
    monthNum > 12 ||
    !yearNum ||
    skip < 0 ||
    limit < 0
  ) {
    throw new AppError("Invalid month or year", 400);
  }

  const start = new Date(yearNum, monthNum - 1, 1, 0, 0, 0, 0);
  const end = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);

  const expenses = await Expenses.find({
    userId: req.user.id,
    createdAt: { $gte: start, $lte: end },
  })
    .sort({ _id: -1 })
    .skip(Number(skip))
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    expenses,
  });
};

// Edit expense
const editExpense = async (req, res) => {
  const expense = req.body.expense;

  if (!expense?._id) {
    throw new AppError("Expense ID is required", 400);
  }

  const editedExpense = await Expenses.findByIdAndUpdate(
    { _id: expense._id },
    { title: expense.title, content: expense.content, amount: expense.amount },
    { new: true },
  );

  if (!editedExpense) {
    throw new AppError("Expense not found", 404);
  }

  res.status(200).json({
    success: true,
    editedExpense,
  });
};

// Delete Expense
const deleteExpense = async (req, res) => {
  const { expenseId } = req.params;

  const deletedExpense = await Expenses.findByIdAndDelete(expenseId);
  if (!deletedExpense) {
    throw new AppError("Expense not found", 404);
  }
  res
    .status(200)
    .json({ success: true, message: "Expense deleted successfully" });
};

module.exports = {
  createExpense: createExpenses,
  getDataByMonth,
  editExpense,
  deleteExpense,
};
