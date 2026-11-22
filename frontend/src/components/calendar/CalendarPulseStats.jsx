const CalendarPulseStats = ({ counts }) => {
  const { journals = 0, tasks = 0, expenses = 0, notes = 0 } = counts;

  return (
    <section
      className="p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/80 dark:border-zinc-800 shadow-xl shadow-purple-950/5 dark:shadow-black/30 flex items-center justify-around gap-4 flex-wrap"
      aria-label="Monthly activity overview"
    >
      <div className="flex items-center gap-3">
        <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shadow-sm shadow-purple-600 animate-pulse" />
        <div className="flex flex-col">
          <strong className="font-serif text-lg font-bold text-zinc-900 dark:text-white leading-tight">
            {journals}
          </strong>
          <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
            Journals Written
          </span>
        </div>
      </div>

      <div className="hidden sm:block w-px h-6 bg-zinc-200/60 dark:bg-zinc-800" />

      <div className="flex items-center gap-3">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500 animate-pulse" />
        <div className="flex flex-col">
          <strong className="font-serif text-lg font-bold text-zinc-900 dark:text-white leading-tight">
            {tasks}
          </strong>
          <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
            Tasks Scheduled
          </span>
        </div>
      </div>

      <div className="hidden sm:block w-px h-6 bg-zinc-200/60 dark:bg-zinc-800" />

      <div className="flex items-center gap-3">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500 animate-pulse" />
        <div className="flex flex-col">
          <strong className="font-serif text-lg font-bold text-zinc-900 dark:text-white leading-tight">
            {expenses}
          </strong>
          <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
            Expenses Tracked
          </span>
        </div>
      </div>

      <div className="hidden sm:block w-px h-6 bg-zinc-200/60 dark:bg-zinc-800" />

      <div className="flex items-center gap-3">
        <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500 animate-pulse" />
        <div className="flex flex-col">
          <strong className="font-serif text-lg font-bold text-zinc-900 dark:text-white leading-tight">
            {notes}
          </strong>
          <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
            Notes Jotted
          </span>
        </div>
      </div>
    </section>
  );
};

export default CalendarPulseStats;
