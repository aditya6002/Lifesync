import { Sparkles, Calendar as CalendarIcon, RefreshCw } from "lucide-react";

const CalendarHeader = ({ onTodayClick, onRefreshClick, loading }) => {
  return (
    <header className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/80 dark:border-zinc-800 shadow-xl shadow-purple-950/5 dark:shadow-black/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all duration-300">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold tracking-wider uppercase mb-3">
          <Sparkles size={13} />
          <span>Real-Time Chrono Vault</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
          Activity & Timeflow{" "}
          <span className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-amber-500 bg-clip-text text-transparent">
            Calendar
          </span>
        </h1>
        <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Synchronize your reflections, tasks, expenses, and notes into one unified, color-coded daily timeline.
        </p>
      </div>

      <div className="flex items-center gap-2.5 flex-shrink-0">
        <button
          type="button"
          onClick={onTodayClick}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold bg-white/80 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 text-zinc-800 dark:text-zinc-100 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-all shadow-sm"
        >
          <CalendarIcon size={14} />
          <span>Today</span>
        </button>

        <button
          type="button"
          onClick={onRefreshClick}
          title="Refresh Activities"
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/80 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-200 hover:scale-105 active:scale-95 transition-all shadow-sm"
        >
          <RefreshCw size={15} className={loading ? "animate-spin text-purple-600" : ""} />
        </button>
      </div>
    </header>
  );
};

export default CalendarHeader;
