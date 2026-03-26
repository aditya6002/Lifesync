const Expense = require("../models/expenses.model");
const Journal = require("../models/journal.model");
const Note = require("../models/Note.model");
const Task = require("../models/task.model");
const jwt = require("jsonwebtoken");
const activityLogModel = require("../models/activityLog.model");

const getHomeData = async (req, res) => {
  try {
    const userId = req.user.id;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const startOfMonth = new Date(year, month, 1);
    const startOfToday = new Date(year, month, now.getDate());
    const endOfToday = new Date(year, month, now.getDate() + 1);

    const [
      journals,
      todayPendingTasks,
      totalNotes,
      monthlyJournalCount,
      expAgg,
      recentActivities,
    ] = await Promise.all([
      Journal.find({ userId }, { date: 1, createdAt: 1 }).lean(),

      Task.countDocuments({
        userId,
        isDone: false,
        createdAt: {
          $gte: startOfToday,
          $lt: endOfToday,
        },
      }),

      Note.countDocuments({ userId }),

      Journal.countDocuments({
        userId,
        createdAt: {
          $gte: startOfMonth,
          $lte: now,
        },
      }),

      Expense.aggregate([
        {
          $match: {
            userId,
            createdAt: {
              $gte: startOfMonth,
              $lte: now,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),

      activityLogModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
    ]);

    const journalStreakCal = () => {
      const dates = new Set(
        journals
          .map((e) => {
            const d = new Date(e.date || e.createdAt);
            if (isNaN(d.getTime())) return null;
            return d.toISOString().slice(0, 10);
          })
          .filter(Boolean),
      );

      let count = 0;
      let d = new Date();

      while (true) {
        const key = d.toISOString().slice(0, 10);
        if (!dates.has(key)) break;
        count++;
        d.setDate(d.getDate() - 1);
      }

      return count;
    };

    const journalStreak = journalStreakCal();

    const currentMonthExpTotal = expAgg[0]?.total || 0;

    const accessToken = jwt.sign({ userId }, process.env.ACCESS_JWT_SECRET, {
      expiresIn: process.env.ACCESS_JWT_EXPIRE || "15m",
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    return res.status(200).json({
      success: true,
      data: {
        todayPendingTasks,
        journalStreak,
        totalNotes,
        monthlyJournalCount,
        currentMonthExpTotal,
        recentActivity: recentActivities,
      },
    });
  } catch (error) {
    console.error("getHomeData error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load home data",
    });
  }
};
module.exports = { getHomeData };
