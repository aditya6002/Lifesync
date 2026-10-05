import Expense from "../models/features/expense.model.js";
import { encrypt, decrypt } from "../helper/hashing.helper.js";
import AppError from "../middleware/AppError.middleware.js";

const addExpense = async (req, res) => {
  const { category, note, amount, date } = req.body;
  const user = req.user;

  const expense = await Expense.create({
    category: category.trim().toLowerCase(),
    note: note ? encrypt(note.trim()) : null,
    amount: encrypt(amount),
    date: new Date(date),
    userId: user._id,
  });

  res.status(201).json({
    success: true,
    message: "Expense added successfully",
    expense: {
      _id: expense._id,
      category: expense.category,
      note: expense.note ? decrypt(expense.note) : null,
      amount: decrypt(expense.amount),
      date: expense.date,
      userId: expense.userId,
    },
  });
};

const editExpense = async (req, res) => {
  const { category, note, amount, date } = req.body;
  const user = req.user;
  const expenseId = req.params.expenseId;

  const expense = await Expense.findByIdAndUpdate(
    { _id: expenseId, userId: user._id },
    {
      category: category.trim().toLowerCase(),
      note: note ? encrypt(note.trim()) : null,
      amount: encrypt(amount),
      date: new Date(date),
    },
    { returnDocument: "after" },
  );

  if (!expense) {
    throw new AppError(400, "Expense not found", true);
  }

  res.status(202).json({
    success: true,
    message: "Expense added successfully",
    expense: {
      _id: expense._id,
      category: expense.category,
      note: expense.note ? decrypt(expense.note) : null,
      amount: decrypt(expense.amount),
      date: expense.date,
      userId: expense.userId,
    },
  });
};

const getExpense = async (req, res) => {
  const user = req.user;
  const expenseId = req.params.expenseId;

  const expense = await Expense.findOne({
    _id: expenseId,
    userId: user._id,
  }).select("-deleteIn -createdAt -updatedAt");

  if (!expense) {
    throw new AppError(400, "Expense not found", true);
  }

  expense.note = expense.note ? decrypt(expense.note) : null;
  expense.amount = decrypt(expense.amount);

  res.status(200).json({
    success: true,
    message: "Expense fetch successfully",
    expense,
  });
};

const deleteExpense = async (req, res) => {
  const user = req.user;
  const expenseId = req.params.expenseId;

  const expense = await Expense.findOneAndDelete({
    _id: expenseId,
    userId: user._id,
  }).select("-deleteIn -createdAt -updatedAt");

  if (!expense) {
    throw new AppError(400, "Expense not found", true);
  }

  expense.note = expense.note ? decrypt(expense.note) : null;
  expense.amount = decrypt(expense.amount);

  res.status(202).json({
    success: true,
    message: "Expense deleted successfully",
    expense,
  });
};

const getAll = async (req, res) => {
  const user = req.user;
  const { skip, limit } = req.query || { skip: 0, limit: 15 };

  const expenses = await Expense.find({ userId: user._id })
    .sort({ date: -1 })
    .skip(parseInt(skip))
    .limit(parseInt(limit))
    .select("-deleteIn -createdAt -updatedAt");

  const totalExpenses = await Expense.countDocuments({ userId: user._id });

  const expensesWithDecryptedData = expenses.map((expense) => ({
    _id: expense._id,
    category: expense.category,
    note: expense.note ? decrypt(expense.note) : null,
    amount: decrypt(expense.amount),
    date: expense.date,
    userId: expense.userId,
  }));

  res.status(200).json({
    success: true,
    message: "Expenses fetched successfully",
    expenses: expensesWithDecryptedData,
    totalExpenses,
  });
};

const historyExpenses = async (req, res) => {
  const user = req.user;
  const month = req.query.month || new Date().getMonth() + 1;
  const year = req.query.year || new Date().getFullYear();

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const expenses = await Expense.find({
    userId: user._id,
    date: { $gte: startDate, $lte: endDate },
  })
    .sort({ date: -1 })
    .select("-deleteIn -createdAt -updatedAt");

  const totalExpenses = await Expense.countDocuments({
    userId: user._id,
    date: { $gte: startDate, $lte: endDate },
  });

  const expensesWithDecryptedData = expenses.map((expense) => ({
    _id: expense._id,
    category: expense.category,
    note: expense.note ? decrypt(expense.note) : null,
    amount: decrypt(expense.amount),
    date: expense.date,
    userId: expense.userId,
  }));

  res.status(200).json({
    success: true,
    message: "Expenses fetched successfully",
    expenses: expensesWithDecryptedData,
    totalExpenses,
  });
};

export default {
  addExpense,
  editExpense,
  getExpense,
  deleteExpense,
  getAll,
  historyExpenses,
};
