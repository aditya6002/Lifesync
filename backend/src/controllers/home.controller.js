const Expense = require("../models/expenses.model");
const axios = require("axios");
const Journal = require("../models/journal.model");
const Note = require("../models/Note.model");
const Task = require("../models/task.model");
const jwt = require("jsonwebtoken");
const activityLogModel = require("../models/activityLog.model");

// const getHomeData = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const now = new Date();
//     const year = now.getFullYear();
//     const month = now.getMonth();

//     const startOfMonth = new Date(year, month, 1);
//     const startOfToday = new Date(year, month, now.getDate());
//     const endOfToday = new Date(year, month, now.getDate() + 1);

//     const [
//       journals,
//       todayTasks,
//       todayPendingTasks,
//       totalNotes,
//       monthlyJournalCount,
//       expAgg,
//       recentActivities,
//     ] = await Promise.all([
//       Journal.find({ userId }, { date: 1, createdAt: 1 }).lean(),

//       // ✅ Only TODAY tasks
//       Task.find(
//         {
//           userId,
//           createdAt: { $gte: startOfToday, $lt: endOfToday },
//         },
//         { isDone: 1 },
//       ).lean(),

//       Task.countDocuments({
//         userId,
//         isDone: false,
//         createdAt: { $gte: startOfToday, $lt: endOfToday },
//       }),

//       Note.countDocuments({ userId }),

//       Journal.countDocuments({
//         userId,
//         createdAt: { $gte: startOfMonth, $lte: now },
//       }),

//       Expense.aggregate([
//         {
//           $match: {
//             userId,
//             createdAt: { $gte: startOfMonth, $lte: now },
//           },
//         },
//         {
//           $group: {
//             _id: null,
//             total: { $sum: "$amount" },
//           },
//         },
//       ]),

//       activityLogModel
//         .find({ userId })
//         .sort({ createdAt: -1 })
//         .limit(10)
//         .lean(),
//     ]);

//     // 🧠 Journal Streak
//     const journalStreak = (() => {
//       const dates = new Set(
//         journals
//           .map((e) => {
//             const d = new Date(e.date || e.createdAt);
//             if (isNaN(d.getTime())) return null;
//             return d.toISOString().slice(0, 10);
//           })
//           .filter(Boolean),
//       );

//       let count = 0;
//       let d = new Date();

//       while (true) {
//         const key = d.toISOString().slice(0, 10);
//         if (!dates.has(key)) break;
//         count++;
//         d.setDate(d.getDate() - 1);
//       }

//       return count;
//     })();

//     const currentMonthExpTotal = expAgg[0]?.total || 0;

//     // 🎯 TODAY TASK COMPLETION SCORE
//     const todayTaskScore = (() => {
//       if (!todayTasks.length) return 0;
//       const done = todayTasks.filter((t) => t.isDone).length;
//       return Math.round((done / todayTasks.length) * 100);
//     })();

//     // 🚀 PRODUCTIVITY SCORE (combined logic)
//     const productivityScore = Math.round(
//       todayTaskScore * 0.5 + // tasks weight
//         journalStreak * 5 + // streak boost
//         monthlyJournalCount * 0.5, // journaling consistency
//     );

//     const finalProductivityScore = Math.min(productivityScore, 100);

//     // 🤖 AI INSIGHTS (dynamic)
//     const aiInsights = [];

//     // Expense insight
//     if (currentMonthExpTotal > 5000) {
//       aiInsights.push({
//         text: "You're spending heavily this month. Consider reviewing expenses.",
//         color: "orange",
//       });
//     }

//     // Task insight
//     if (todayPendingTasks >= 3) {
//       aiInsights.push({
//         text: `${todayPendingTasks} tasks pending today. Try finishing top 2 first.`,
//         color: "red",
//       });
//     }

//     // Streak insight
//     if (journalStreak >= 3) {
//       aiInsights.push({
//         text: `${journalStreak}-day journal streak 🔥 Keep it going!`,
//         color: "green",
//       });
//     }

//     // Productivity insight
//     if (finalProductivityScore >= 80) {
//       aiInsights.push({
//         text: "You're highly productive today. Keep this momentum 🚀",
//         color: "green",
//       });
//     } else if (finalProductivityScore < 40) {
//       aiInsights.push({
//         text: "Low productivity detected. Start with small tasks to build momentum.",
//         color: "orange",
//       });
//     }

//     // fallback
//     if (aiInsights.length === 0) {
//       aiInsights.push({
//         text: "You're doing okay. A little push can make today great 💪",
//         color: "blue",
//       });
//     }

//     // 🔐 Token
//     const accessToken = jwt.sign({ userId }, process.env.ACCESS_JWT_SECRET, {
//       expiresIn: process.env.ACCESS_JWT_EXPIRE || "15m",
//     });

//     res.cookie("accessToken", accessToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "Strict",
//     });

//     return res.status(200).json({
//       success: true,
//       data: {
//         todayPendingTasks,
//         todayTaskScore,
//         productivityScore: finalProductivityScore,
//         journalStreak,
//         totalNotes,
//         monthlyJournalCount,
//         currentMonthExpTotal,
//         recentActivity: recentActivities,
//         aiInsights,
//       },
//     });
//   } catch (error) {
//     console.error("getHomeData error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to load home data",
//     });
//   }
// };

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
      todayTasks,
      todayPendingTasks,
      totalNotes,
      monthlyJournalCount,
      expAgg,
      recentActivities,
    ] = await Promise.all([
      // Journals (for streak)
      Journal.find({ userId }, { date: 1, createdAt: 1 }).lean(),

      // ✅ Today tasks (for score)
      Task.find(
        {
          userId,
          createdAt: { $gte: startOfToday, $lt: endOfToday },
        },
        { isDone: 1 },
      ).lean(),

      // ✅ Today pending count
      Task.countDocuments({
        userId,
        isDone: false,
        createdAt: { $gte: startOfToday, $lt: endOfToday },
      }),

      // Notes count
      Note.countDocuments({ userId }),

      // Monthly journal count
      Journal.countDocuments({
        userId,
        createdAt: { $gte: startOfMonth, $lte: now },
      }),

      // Monthly expense
      Expense.aggregate([
        {
          $match: {
            userId,
            createdAt: { $gte: startOfMonth, $lte: now },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]),

      // ✅ Recent activity (8 items)
      activityLogModel.find({ userId }).sort({ createdAt: -1 }).limit(8).lean(),
    ]);

    // 🧠 Journal Streak (safe)
    const journalStreak = (() => {
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
    })();

    const currentMonthExpTotal = expAgg[0]?.total || 0;

    const todayTaskScore = (() => {
      if (!todayTasks.length) return 0;
      const done = todayTasks.filter((t) => t.isDone).length;
      return Math.round((done / todayTasks.length) * 100);
    })();

    const rawScore =
      todayTaskScore * 0.5 + journalStreak * 5 + monthlyJournalCount * 0.5;

    const productivityScore = Math.min(Math.round(rawScore), 100);

    const aiInsights = [];

    // Expense
    if (currentMonthExpTotal > 10000) {
      aiInsights.push({
        text: "High spending this month 💸 Consider cutting costs.",
        color: "red",
      });
    } else if (currentMonthExpTotal > 5000) {
      aiInsights.push({
        text: "Spending slightly higher than usual.",
        color: "orange",
      });
    } else {
      aiInsights.push({
        text: "Spending looks healthy 👍",
        color: "green",
      });
    }

    // Tasks
    if (todayTaskScore === 100) {
      aiInsights.push({
        text: "Perfect day! All tasks done 🎯",
        color: "green",
      });
    } else if (todayTaskScore >= 60) {
      aiInsights.push({
        text: "Good progress today 💪",
        color: "blue",
      });
    } else {
      aiInsights.push({
        text: "Start with 1 small task to build momentum.",
        color: "orange",
      });
    }

    // Pending
    if (todayPendingTasks >= 5) {
      aiInsights.push({
        text: `${todayPendingTasks} tasks pending. Focus on top priorities.`,
        color: "red",
      });
    } else if (todayPendingTasks > 0) {
      aiInsights.push({
        text: `${todayPendingTasks} tasks left. Finish strong!`,
        color: "blue",
      });
    }

    // Streak
    if (journalStreak >= 7) {
      aiInsights.push({
        text: `${journalStreak}-day streak 🔥 Amazing consistency!`,
        color: "green",
      });
    } else if (journalStreak >= 3) {
      aiInsights.push({
        text: `${journalStreak}-day streak. Keep it going!`,
        color: "blue",
      });
    } else {
      aiInsights.push({
        text: "Start journaling today ✍️",
        color: "orange",
      });
    }

    // Journals
    if (monthlyJournalCount >= 10) {
      aiInsights.push({
        text: "Great journaling habit this month 🧠",
        color: "green",
      });
    } else {
      aiInsights.push({
        text: "Write more journals to track your growth.",
        color: "blue",
      });
    }

    // Productivity
    if (productivityScore >= 80) {
      aiInsights.push({
        text: "You're highly productive today 🚀",
        color: "green",
      });
    } else if (productivityScore < 40) {
      aiInsights.push({
        text: "Low productivity—start small.",
        color: "red",
      });
    }

    // Notes
    if (totalNotes >= 20) {
      aiInsights.push({
        text: "You're capturing ideas well 📝",
        color: "green",
      });
    } else {
      aiInsights.push({
        text: "Use notes more to track ideas.",
        color: "blue",
      });
    }

    // Ensure 7–8 insights
    // while (aiInsights.length < 7) {
    //   aiInsights.push({
    //     text: "Consistency beats intensity 💪",
    //     color: "blue",
    //   });
    // }

    const finalInsights = aiInsights.slice(0, 8);

    // 🔐 Token
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
        todayTaskScore,
        productivityScore,
        journalStreak,
        totalNotes,
        monthlyJournalCount,
        currentMonthExpTotal,
        recentActivity: recentActivities,
        aiInsights: finalInsights,
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
