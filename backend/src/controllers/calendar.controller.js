const Note = require("../models/Note.model");
const Journal = require("../models/journal.model");
const Task = require("../models/task.model");
const Expense = require("../models/expenses.model");

const getDataByDate = async (req, res) => {
  try {
    const { year, month, date } = req.params;

    // Creating start and end date objects for the given date
    const start = new Date(
      Number(year),
      Number(month) - 1,
      Number(date),
      0,
      0,
      0,
      0,
    );

    const end = new Date(
      Number(year),
      Number(month) - 1,
      Number(date),
      23,
      59,
      59,
      999,
    );

    // Finding notes for the user within the specified date range
    const [notes, journals, tasks, expenses] = await Promise.all([
      Note.find({ userId: req.user.id, createdAt: { $gte: start, $lte: end } }),
      Journal.find({
        userId: req.user.id,
        createdAt: { $gte: start, $lte: end },
      }),
      Task.find({ userId: req.user.id, createdAt: { $gte: start, $lte: end } }),
      Expense.find({
        userId: req.user.id,
        createdAt: { $gte: start, $lte: end },
      }),
    ]);

    res.status(200).json({
      success: true,
      message: "Notes retrieved successfully",
      notes,
      journals,
      tasks,
      expenses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getDataByDate,
};
