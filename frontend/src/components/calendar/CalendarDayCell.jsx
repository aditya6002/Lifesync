const CalendarDayCell = ({
  day,
  dateKey,
  isSelected,
  isToday,
  isSunday,
  activities,
  onSelect,
}) => {
  if (!day) {
    return <div className="h-16 sm:h-20 rounded-2xl bg-transparent" aria-hidden="true" />;
  }

  const hasJournals = activities?.journals?.length > 0;
  const hasTasks = activities?.tasks?.length > 0;
  const hasExpenses = activities?.expenses?.length > 0;
  const hasNotes = activities?.notes?.length > 0;
  const totalEvents =
    (activities?.journals?.length || 0) +
    (activities?.tasks?.length || 0) +
    (activities?.expenses?.length || 0) +
    (activities?.notes?.length || 0);

  return (
    <button
      type="button"
      onClick={() => onSelect(dateKey)}
      className={`relative h-16 sm:h-20 p-2 sm:p-2.5 rounded-2xl flex flex-col justify-between items-start transition-all duration-200 group text-left ${
        isSelected
          ? "bg-gradient-to-tr from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-600/30 scale-[1.03] z-10"
          : isToday
          ? "bg-amber-500/10 dark:bg-amber-500/15 border-2 border-amber-500/60 text-zinc-900 dark:text-white"
          : "bg-white/60 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 border border-white/80 dark:border-zinc-700/50 text-zinc-800 dark:text-zinc-200"
      }`}
    >
      <div className="flex items-center justify-between w-full">
        <span
          className={`font-semibold text-xs sm:text-sm ${
            isSelected
              ? "text-white"
              : isSunday
              ? "text-rose-500"
              : isToday
              ? "text-amber-600 dark:text-amber-400 font-bold"
              : ""
          }`}
        >
          {day}
        </span>

        {totalEvents > 0 && (
          <span
            className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-full ${
              isSelected
                ? "bg-white/20 text-white"
                : "bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400"
            }`}
          >
            {totalEvents}
          </span>
        )}
      </div>

      {/* Activity Dots */}
      <div className="flex items-center gap-1 flex-wrap">
        {hasJournals && (
          <span
            className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-purple-600"}`}
            title="Journal"
          />
        )}
        {hasTasks && (
          <span
            className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white/90" : "bg-emerald-500"}`}
            title="Task"
          />
        )}
        {hasExpenses && (
          <span
            className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white/80" : "bg-amber-500"}`}
            title="Expense"
          />
        )}
        {hasNotes && (
          <span
            className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white/70" : "bg-blue-500"}`}
            title="Note"
          />
        )}
      </div>
    </button>
  );
};

export default CalendarDayCell;
