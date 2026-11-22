import { Activity, CalendarDays, BookOpen, Wallet } from "lucide-react";
import ActivityItem from "./ActivityItem";

const ActivityInspector = ({
  selectedDate,
  selectedDayActivity,
  totalSelectedActivities,
  activityFilter,
  setActivityFilter,
  onToggleTask,
  onNavigate,
}) => {
  const formattedDate = new Date(selectedDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <aside className="p-6 sm:p-7 rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/80 dark:border-zinc-800 shadow-xl shadow-purple-950/5 dark:shadow-black/30">
      {/* Header */}
      <div className="flex items-center gap-3.5 mb-5">
        <div className="w-10 h-10 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
          <Activity size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-white leading-tight">
            Daily Activity Log
          </h2>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 block truncate">
            {formattedDate}
          </span>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400">
          {totalSelectedActivities} {totalSelectedActivities === 1 ? "event" : "events"}
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 pb-4 mb-4 border-b border-zinc-200/60 dark:border-zinc-800 flex-wrap">
        <button
          type="button"
          onClick={() => setActivityFilter("all")}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            activityFilter === "all"
              ? "bg-purple-600 text-white shadow-sm shadow-purple-600/30"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setActivityFilter("journal")}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            activityFilter === "journal"
              ? "bg-purple-600 text-white shadow-sm shadow-purple-600/30"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          Journals ({selectedDayActivity.journals.length})
        </button>
        <button
          type="button"
          onClick={() => setActivityFilter("task")}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            activityFilter === "task"
              ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          Tasks ({selectedDayActivity.tasks.length})
        </button>
        <button
          type="button"
          onClick={() => setActivityFilter("expense")}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            activityFilter === "expense"
              ? "bg-amber-600 text-white shadow-sm shadow-amber-600/30"
              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          Expenses ({selectedDayActivity.expenses.length})
        </button>
      </div>

      {/* Activity Stack or Empty State */}
      <div className="max-h-[520px] overflow-y-auto pr-1">
        {totalSelectedActivities === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12 px-4 text-zinc-500 dark:text-zinc-400 gap-2">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-1">
              <CalendarDays size={24} strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-base font-bold text-zinc-900 dark:text-white">
              No activity for this day
            </h3>
            <p className="text-xs max-w-xs mb-3">
              Pick another day or quickly write a journal or log an expense.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onNavigate("/journal")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 hover:bg-purple-100 transition-colors"
              >
                <BookOpen size={13} /> Write Journal
              </button>
              <button
                type="button"
                onClick={() => onNavigate("/expenses")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 hover:bg-amber-100 transition-colors"
              >
                <Wallet size={13} /> Log Expense
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {(activityFilter === "all" || activityFilter === "journal") &&
              selectedDayActivity.journals.map((j) => (
                <ActivityItem
                  key={j.id}
                  item={j}
                  type="journal"
                  onToggleTask={onToggleTask}
                  onNavigate={onNavigate}
                />
              ))}

            {(activityFilter === "all" || activityFilter === "task") &&
              selectedDayActivity.tasks.map((t) => (
                <ActivityItem
                  key={t.id}
                  item={t}
                  type="task"
                  onToggleTask={onToggleTask}
                  onNavigate={onNavigate}
                />
              ))}

            {(activityFilter === "all" || activityFilter === "expense") &&
              selectedDayActivity.expenses.map((e) => (
                <ActivityItem
                  key={e.id}
                  item={e}
                  type="expense"
                  onToggleTask={onToggleTask}
                  onNavigate={onNavigate}
                />
              ))}

            {(activityFilter === "all" || activityFilter === "notes") &&
              selectedDayActivity.notes.map((n) => (
                <ActivityItem
                  key={n.id}
                  item={n}
                  type="note"
                  onToggleTask={onToggleTask}
                  onNavigate={onNavigate}
                />
              ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default ActivityInspector;
