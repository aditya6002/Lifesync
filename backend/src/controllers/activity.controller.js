import Journal from "../models/features/journal.model.js";
import Task from "../models/features/task.model.js";
import Expense from "../models/features/expense.model.js";
import Note from "../models/features/note.model.js";
import { decrypt } from "../helper/hashing.helper.js";

const safeDecrypt = (str) => {
  if (!str) return "";
  try {
    return decrypt(str);
  } catch {
    return str;
  }
};

/**
 * Get unified user activity grouped by date for a given month and year
 */
const getMonthlyActivity = async (req, res) => {
  const user = req.user;
  const now = new Date();
  const year = req.query.year ? parseInt(req.query.year) : now.getFullYear();
  const month = req.query.month ? parseInt(req.query.month) - 1 : now.getMonth(); // 0-indexed

  const startOfMonth = new Date(Date.UTC(year, month, 1, 0, 0, 0));
  const endOfMonth = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));

  // 1. Fetch Journals
  const journals = await Journal.find({
    userId: user._id,
    createdAt: { $gte: startOfMonth, $lte: endOfMonth },
  }).select("title mood tags createdAt");

  // 2. Fetch Tasks
  const tasks = await Task.find({
    userId: user._id,
    $or: [
      { dueDate: { $gte: startOfMonth, $lte: endOfMonth } },
      { createdAt: { $gte: startOfMonth, $lte: endOfMonth } },
    ],
  }).select("task isDone priority dueDate createdAt startingTime");

  // 3. Fetch Expenses
  const expenses = await Expense.find({
    userId: user._id,
    date: { $gte: startOfMonth, $lte: endOfMonth },
  }).select("title amount category type date note");

  // 4. Fetch Notes
  const notes = await Note.find({
    userId: user._id,
    createdAt: { $gte: startOfMonth, $lte: endOfMonth },
  }).select("title tag createdAt");

  // Helper to format date string YYYY-MM-DD
  const toDateKey = (d) => {
    const dt = new Date(d);
    const y = dt.getUTCFullYear();
    const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
    const day = String(dt.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const daysMap = {};

  // Process Journals
  journals.forEach((j) => {
    const key = toDateKey(j.createdAt);
    if (!daysMap[key]) daysMap[key] = { journals: [], tasks: [], expenses: [], notes: [] };
    daysMap[key].journals.push({
      id: j._id,
      title: safeDecrypt(j.title),
      mood: j.mood || "calm",
      time: j.createdAt,
    });
  });

  // Process Tasks
  tasks.forEach((t) => {
    const key = toDateKey(t.dueDate || t.createdAt);
    if (!daysMap[key]) daysMap[key] = { journals: [], tasks: [], expenses: [], notes: [] };
    daysMap[key].tasks.push({
      id: t._id,
      title: safeDecrypt(t.task),
      isDone: t.isDone,
      priority: t.priority,
      time: t.startingTime || t.dueDate,
    });
  });

  // Process Expenses
  expenses.forEach((e) => {
    const key = toDateKey(e.date);
    if (!daysMap[key]) daysMap[key] = { journals: [], tasks: [], expenses: [], notes: [] };
    daysMap[key].expenses.push({
      id: e._id,
      title: e.title,
      amount: e.amount,
      category: e.category,
      type: e.type,
      time: e.date,
    });
  });

  // Process Notes
  notes.forEach((n) => {
    const key = toDateKey(n.createdAt);
    if (!daysMap[key]) daysMap[key] = { journals: [], tasks: [], expenses: [], notes: [] };
    daysMap[key].notes.push({
      id: n._id,
      title: safeDecrypt(n.title),
      tag: n.tag,
      time: n.createdAt,
    });
  });

  return res.status(200).json({
    success: true,
    year,
    month: month + 1,
    activities: daysMap,
    counts: {
      journals: journals.length,
      tasks: tasks.length,
      expenses: expenses.length,
      notes: notes.length,
    },
  });
};

export default {
  getMonthlyActivity,
};
