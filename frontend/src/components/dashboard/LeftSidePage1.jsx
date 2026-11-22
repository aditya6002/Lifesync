import {
  CalendarDays,
  CheckCircle2,
  FileText,
  NotebookPen,
  Wallet,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const firstOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);

const LeftSidePage = () => {
  const navigate = useNavigate();
  const [viewDate, setViewDate] = useState(() => firstOfMonth(new Date()));
  const [selected, setSelected] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  });

  const year = viewDate.getFullYear();
  const monthIndex = viewDate.getMonth();

  const cells = useMemo(() => {
    const firstWeekday = new Date(year, monthIndex, 1).getDay();
    const totalDays = new Date(year, monthIndex + 1, 0).getDate();
    return [
      ...Array.from({ length: firstWeekday }, () => null),
      ...Array.from({ length: totalDays }, (_, i) => i + 1),
    ];
  }, [year, monthIndex]);

  const changeMonth = (offset) =>
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));

  const today = new Date();
  const isCurrentMonth = year === today.getFullYear() && monthIndex === today.getMonth();
  const dayKey = (day) => `${year}-${monthIndex + 1}-${day}`;

  const shortcuts = [
    { name: "Journal", Icon: NotebookPen, color: "#8a4add", path: "/journal" },
    { name: "Expenses", Icon: Wallet, color: "#e99731", path: "/expenses" },
    { name: "Calendar", Icon: CalendarDays, color: "#3b82f6", path: "/calendar" },
    { name: "Tasks", Icon: CheckCircle2, color: "#6a9f4d", path: "/" },
  ];

  return (
    <section
      className="p-6 sm:p-7 rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/80 dark:border-zinc-800 shadow-xl shadow-purple-950/5 dark:shadow-black/30 flex flex-col gap-5 min-h-[520px]"
      aria-label="Calendar overview"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div
          onClick={() => navigate("/calendar")}
          className="w-11 h-11 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
          title="Open Calendar Page"
        >
          <CalendarDays size={22} />
        </div>

        <div className="flex-1 ml-3.5">
          <h2
            onClick={() => navigate("/calendar")}
            className="font-serif text-2xl font-bold text-zinc-900 dark:text-white inline-flex items-center gap-1.5 cursor-pointer hover:text-purple-600 transition-colors"
          >
            {MONTH_NAMES[monthIndex]} {year}
            <ArrowUpRight size={17} className="opacity-60" />
          </h2>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            {!isCurrentMonth ? (
              <button
                type="button"
                onClick={() => setViewDate(firstOfMonth(new Date()))}
                className="text-amber-600 dark:text-amber-400 hover:underline"
              >
                Back to today
              </button>
            ) : (
              "Click to view full calendar & activity"
            )}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            aria-label="Previous month"
            className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/80 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-200 hover:scale-105 active:scale-95 transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => changeMonth(1)}
            aria-label="Next month"
            className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/80 dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-200 hover:scale-105 active:scale-95 transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((d) => (
          <span key={d} className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 py-1">
            {d}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {cells.map((day, idx) => {
          if (!day) return <span key={`blank-${idx}`} className="h-9 sm:h-10" />;
          const key = dayKey(day);
          const isSelected = selected === key;
          const isToday = isCurrentMonth && day === today.getDate();
          const isSunday = idx % 7 === 0;

          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(key)}
              className={`h-9 sm:h-10 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center transition-all ${
                isSelected
                  ? "bg-gradient-to-tr from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-600/30 scale-105"
                  : isToday
                  ? "bg-amber-500/10 border-2 border-amber-500 text-amber-600 dark:text-amber-400 font-bold"
                  : isSunday
                  ? "text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  : "text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Shortcuts */}
      <div className="grid grid-cols-4 gap-2 mt-auto pt-3 border-t border-zinc-200/50 dark:border-zinc-800">
        {shortcuts.map(({ name, Icon, color, path }) => (
          <button
            key={name}
            type="button"
            onClick={() => path && navigate(path)}
            className="flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white/60 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/50 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 hover:scale-105 transition-all shadow-sm"
          >
            <Icon size={16} color={color} strokeWidth={2.2} />
            <span>{name}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default LeftSidePage;
