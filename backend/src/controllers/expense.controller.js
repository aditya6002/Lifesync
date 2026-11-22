import Expense from "../models/features/expense.model.js";

/**
 * Add a new Expense or Income record
 */
const addExpense = async (req, res) => {
  const { title, type, category, note, amount, date } = req.body;
  const user = req.user;

  if (amount === undefined || amount === null || isNaN(amount) || Number(amount) < 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid non-negative amount",
    });
  }

  const newExpense = await Expense.create({
    title: title?.trim() || (category ? category.charAt(0).toUpperCase() + category.slice(1) : "Expense"),
    type: type === "income" ? "income" : "expense",
    category: category?.trim()?.toLowerCase() || "others",
    note: note?.trim() || "",
    amount: Number(amount),
    date: date ? new Date(date) : new Date(),
    userId: user._id,
  });

  return res.status(201).json({
    success: true,
    message: "Expense record created successfully",
    expense: newExpense,
  });
};

/**
 * Get all expenses with filters and pagination
 */
const getAllExpenses = async (req, res) => {
  const user = req.user;
  const { type, category, search, startDate, endDate, skip = 0, limit = 50 } = req.query;

  const query = { userId: user._id };

  if (type && ["expense", "income"].includes(type)) {
    query.type = type;
  }

  if (category && category !== "all") {
    query.category = category.toLowerCase();
  }

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  if (search && search.trim()) {
    const s = search.trim();
    query.$or = [
      { title: { $regex: s, $options: "i" } },
      { note: { $regex: s, $options: "i" } },
      { category: { $regex: s, $options: "i" } },
    ];
  }

  const total = await Expense.countDocuments(query);
  const expenses = await Expense.find(query)
    .sort({ date: -1, createdAt: -1 })
    .skip(Number(skip))
    .limit(Number(limit));

  return res.status(200).json({
    success: true,
    total,
    expenses,
    hasMore: Number(skip) + expenses.length < total,
  });
};

/**
 * Get statistical summary for expenses & incomes
 */
const getExpenseSummary = async (req, res) => {
  const user = req.user;
  const { year } = req.query;
  const targetYear = year ? parseInt(year) : new Date().getFullYear();

  const startOfYear = new Date(targetYear, 0, 1);
  const endOfYear = new Date(targetYear, 11, 31, 23, 59, 59, 999);

  const allRecords = await Expense.find({
    userId: user._id,
    date: { $gte: startOfYear, $lte: endOfYear },
  });

  let totalExpenses = 0;
  let totalIncome = 0;
  const categoryMap = {};
  const monthExpenses = Array(12).fill(0);
  const monthIncome = Array(12).fill(0);

  allRecords.forEach((item) => {
    const amt = Number(item.amount) || 0;
    const m = new Date(item.date).getMonth();

    if (item.type === "income") {
      totalIncome += amt;
      monthIncome[m] += amt;
    } else {
      totalExpenses += amt;
      monthExpenses[m] += amt;
      const cat = item.category || "others";
      categoryMap[cat] = (categoryMap[cat] || 0) + amt;
    }
  });

  const categoryBreakdown = Object.entries(categoryMap)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const recentTransactions = await Expense.find({ userId: user._id })
    .sort({ date: -1, createdAt: -1 })
    .limit(6);

  return res.status(200).json({
    success: true,
    year: targetYear,
    totalExpenses,
    totalIncome,
    netSavings: totalIncome - totalExpenses,
    categoryBreakdown,
    monthlyTrends: {
      expenses: monthExpenses,
      income: monthIncome,
    },
    recentTransactions,
  });
};

/**
 * Get single expense by ID
 */
const getExpenseById = async (req, res) => {
  const { expenseId } = req.params;
  const user = req.user;

  const expense = await Expense.findOne({ _id: expenseId, userId: user._id });
  if (!expense) {
    return res.status(404).json({ success: false, message: "Expense record not found" });
  }

  return res.status(200).json({ success: true, expense });
};

/**
 * Edit an existing expense
 */
const editExpense = async (req, res) => {
  const { expenseId } = req.params;
  const { title, type, category, note, amount, date } = req.body;
  const user = req.user;

  const expense = await Expense.findOne({ _id: expenseId, userId: user._id });
  if (!expense) {
    return res.status(404).json({ success: false, message: "Expense record not found" });
  }

  if (title !== undefined) expense.title = title.trim();
  if (type !== undefined && ["expense", "income"].includes(type)) expense.type = type;
  if (category !== undefined) expense.category = category.trim().toLowerCase();
  if (note !== undefined) expense.note = note.trim();
  if (amount !== undefined && !isNaN(amount) && Number(amount) >= 0) expense.amount = Number(amount);
  if (date !== undefined) expense.date = new Date(date);

  await expense.save();

  return res.status(200).json({
    success: true,
    message: "Expense record updated successfully",
    expense,
  });
};

/**
 * Delete an expense
 */
const deleteExpense = async (req, res) => {
  const { expenseId } = req.params;
  const user = req.user;

  const expense = await Expense.findOneAndDelete({ _id: expenseId, userId: user._id });
  if (!expense) {
    return res.status(404).json({ success: false, message: "Expense record not found" });
  }

  return res.status(200).json({
    success: true,
    message: "Expense record deleted successfully",
  });
};

export default {
  addExpense,
  getAllExpenses,
  getExpenseSummary,
  getExpenseById,
  editExpense,
  deleteExpense,
};
