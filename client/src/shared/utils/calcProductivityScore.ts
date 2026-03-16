export default function calcProductivityScore(data: {
  tasksToday: number;
  tasksDoneToday: number;
  wroteJournal: boolean;
  journalStreak: number;
  monthlyBudget: number;
  monthlySpent: number;
  updatedNote: boolean;
}) {
  const {
    tasksToday,       // total tasks for today
    tasksDoneToday,   // completed today
    wroteJournal,     // boolean
    journalStreak,    // days
    monthlyBudget,    // e.g. 5000
    monthlySpent,     // e.g. 2839
    updatedNote,      // boolean
  } = data;

  // Tasks (40%)
  const tasksScore = tasksToday > 0
    ? (tasksDoneToday / tasksToday) * 100
    : 0;

  // Journal (25%)
  const journalScore = wroteJournal
    ? Math.min(100, 60 + journalStreak)
    : 0;

  // Expenses (20%) — 100 if under budget
  const expenseScore = monthlySpent <= monthlyBudget
    ? 100
    : Math.max(0, 100 - ((monthlySpent / monthlyBudget) - 1) * 100);

  // Notes (15%)
  const notesScore = updatedNote ? 100 : 0;

  // Weighted final
  const score = Math.round(
    tasksScore   * 0.40 +
    journalScore * 0.25 +
    expenseScore * 0.20 +
    notesScore   * 0.15
  );

  return score; // 0–100
}