import { ChevronLeft, ChevronRight } from "lucide-react";
import CalendarDayCell from "./CalendarDayCell";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const CalendarGrid = ({
  year,
  month,
  cells,
  selectedDate,
  onSelectDate,
  onChangeMonth,
  monthlyData,
  today,
  isCurrentMonth,
  getDateKey,
}) => {
  return (
    <section className="p-6 sm:p-7 rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/80 dark:border-zinc-800 shadow-xl shadow-purple-950/5 dark:shadow-black/30">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl font-bold text-zinc-900 dark:text-white">
          {MONTH_NAMES[month]}{" "}
          <span className="bg-gradient-to-r from-purple-600 to-amber-500 bg-clip-text text-transparent">
            {year}
          </span>
        </h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChangeMonth(-1)}
            aria-label="Previous Month"
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/80 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-200 hover:scale-105 active:scale-95 transition-all shadow-sm"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => onChangeMonth(1)}
            aria-label="Next Month"
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/80 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-200 hover:scale-105 active:scale-95 transition-all shadow-sm"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Weekday Row */}
      <div className="grid grid-cols-7 gap-2 text-center mb-2">
        {WEEKDAYS.map((d) => (
          <span
            key={d}
            className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 py-1"
          >
            {d}
          </span>
        ))}
      </div>

      {/* Day Cells Grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {cells.map((day, idx) => {
          const dateKey = day ? getDateKey(day) : null;
          const isSelected = selectedDate === dateKey;
          const isToday = isCurrentMonth && day === today.getDate();
          const isSunday = idx % 7 === 0;
          const activities = dateKey ? monthlyData[dateKey] : null;

          return (
            <CalendarDayCell
              key={dateKey || `blank-${idx}`}
              day={day}
              dateKey={dateKey}
              isSelected={isSelected}
              isToday={isToday}
              isSunday={isSunday}
              activities={activities}
              onSelect={onSelectDate}
            />
          );
        })}
      </div>

      {/* Color Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-5 border-t border-zinc-200/60 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-600" /> Journal
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Task
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" /> Expense
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500" /> Note
        </span>
      </div>
    </section>
  );
};

export default CalendarGrid;
