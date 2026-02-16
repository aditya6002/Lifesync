const Expenses = require("../models/expenses.model.js");

const createExpenses = async (req, res) => {
  const { title, content, amount, date = new Date() } = req.body;
  const newExpense = await Expenses.create({
    title,
    content,
    amount,
    createdAt: date,
    userId: req.user.id,
  });

  res.status(201).json({ success: true, message: "created", newExpense });
};

const getAllNotes = async (req, res) => {
  try {
    const expenses = await Expenses.find({ userId: req.user.id });

    res.status(200).json({ success: true, expenses });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getDataByMonth = async (req, res) => {
  try {
    const { month, year } = req.params;
    const monthNum = Number(month);
    const yearNum = Number(year);
    if (!monthNum || monthNum < 1 || monthNum > 12 || !yearNum) {
      return res.status(400).json({
        success: false,
        message: "Invalid month or year",
      });
    }

    const start = new Date(yearNum, monthNum - 1, 1, 0, 0, 0, 0);
    const end = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);

    const expenses = await Expenses.find({
      userId: req.user.id,
      createdAt: { $gte: start, $lte: end },
    });

    res.status(200).json({
      success: true,
      expenses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createExpense: createExpenses,
  getAllNotes,
  getDataByMonth,
};
