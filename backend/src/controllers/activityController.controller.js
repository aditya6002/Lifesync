// src/controllers/activityController.js
const ActivityLog = require("../models/activityLog.model");

// ── Heatmap ─────────────────────────────────────────────
exports.getHeatmap = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 70;
    const userId = req.user.id;

    // Date range
    const from = new Date();
    from.setDate(from.getDate() - days);
    const fromStr = from.toISOString().slice(0, 10);

    // Aggregate: count logs per day
    const grouped = await ActivityLog.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: fromStr },
        },
      },
      {
        $group: {
          _id: "$date",
          count: { $sum: 1 },
          // collect unique modules active that day
          modules: { $addToSet: "$module" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Build full array (fill gaps with 0)
    const map = {};
    grouped.forEach((g) => {
      map[g._id] = { count: g.count, modules: g.modules };
    });

    const heatmap = Array.from({ length: days }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      const dateStr = d.toISOString().slice(0, 10);
      const entry = map[dateStr];
      const count = entry?.count || 0;

      return {
        date: dateStr,
        count,
        modules: entry?.modules || [],
        // level 0–4 for heatmap color
        level:
          count === 0 ? 0 : count < 2 ? 1 : count < 5 ? 2 : count < 9 ? 3 : 4,
        label:
          count === 0
            ? "No activity"
            : `${count} action${count > 1 ? "s" : ""} — ${(entry?.modules || []).join(", ")}`,
      };
    });

    res.json({ success: true, data: heatmap });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Recent Activity Feed ─────────────────────────────────
exports.getRecentActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const userId = req.user.id;

    const logs = await ActivityLog.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Format for frontend
    const ICONS = {
      expenses: { created: "🍜", updated: "✏️", deleted: "🗑" },
      journal: { created: "✦", updated: "✏️", deleted: "🗑" },
      notes: { created: "◇", updated: "✏️", deleted: "🗑" },
      tasks: { created: "◎", completed: "✅", deleted: "🗑" },
      ai: { chat: "⟡" },
    };

    const formatted = logs.map((log) => ({
      id: log._id,
      icon: ICONS[log.module]?.[log.action] || "●",
      text: formatActivityText(log),
      time: timeAgo(log.createdAt),
      module: log.module,
      action: log.action,
      createdAt: log.createdAt,
    }));

    res.json({ success: true, data: formatted });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Daily Productivity Score ─────────────────────────────
exports.getDailyScore = async (req, res) => {
  try {
    const userId = req.user.id;
    const date = req.query.date || new Date().toISOString().slice(0, 10);

    const logs = await ActivityLog.find({ userId, date }).lean();

    // Count by module
    const byModule = {};
    logs.forEach((l) => {
      if (!byModule[l.module]) byModule[l.module] = [];
      byModule[l.module].push(l);
    });

    // Tasks score (40%) — completed tasks / total today
    const taskLogs = byModule.tasks || [];
    const completedTasks = taskLogs.filter(
      (l) => l.action === "completed",
    ).length;
    const tasksScore = Math.min(100, completedTasks * 25); // 4 tasks = 100

    // Journal score (25%) — wrote today?
    const journalScore = byModule.journal?.length > 0 ? 100 : 0;

    // Expenses score (20%) — any expense activity today
    const expenseScore = byModule.expenses?.length > 0 ? 100 : 50; // 50 if no activity (neutral)

    // Notes score (15%) — updated/created note
    const notesScore = byModule.notes?.length > 0 ? 100 : 0;

    const totalScore = Math.round(
      tasksScore * 0.4 +
        journalScore * 0.25 +
        expenseScore * 0.2 +
        notesScore * 0.15,
    );

    res.json({
      success: true,
      data: {
        date,
        score: totalScore,
        breakdown: {
          tasks: { score: tasksScore, weight: "40%" },
          journal: { score: journalScore, weight: "25%" },
          expenses: { score: expenseScore, weight: "20%" },
          notes: { score: notesScore, weight: "15%" },
        },
        totalActions: logs.length,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Helpers ──────────────────────────────────────────────
function formatActivityText(log) {
  const actionMap = {
    created: "Added",
    updated: "Updated",
    deleted: "Deleted",
    completed: "Completed",
    viewed: "Viewed",
  };
  const verb = actionMap[log.action] || log.action;
  const name = log.entityName || log.module;
  const extra = log.meta?.amount ? ` ₹${Math.abs(log.meta.amount)}` : "";
  return `${verb} ${log.module}: ${name}${extra}`;
}

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}
