const Expense = require("../models/expenses.model");
const Journal = require("../models/journal.model");
const Note = require("../models/Note.model");
const Task = require("../models/task.model");

const getHomeData = async (req, res) => {
  const userId = req.user.id;

  const [journals, notes, expenses, tasks, totalJounals, totalNotes] =
    await Promise.all([
      Journal.find({ userId }).sort({ _id: -1 }).limit(5),
      Note.find({ userId }).sort({ _id: -1 }).limit(5),
      Expense.find({ userId }).sort({ _id: -1 }).limit(10),
      Task.find({ userId }).sort({ _id: -1 }).limit(15),
      (await Journal.find({ userId })).length,
      (await Note.find({ userId })).length,
    ]);

  res.status(200).json({
    success: true,
    message: "Data fetched",
    journals,
    notes,
    expenses,
    tasks: tasks.filter((t) => t.isDone == false),
    totalJounals,
    totalNotes,
  });
};

module.exports = { getHomeData };
