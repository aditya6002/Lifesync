import { BookOpen, Plus, Search, X, Flame, PenLine, CalendarDays, Lock } from "lucide-react";
import { MOODS } from "./MoodSelector";
import { useLock } from "../../context/LockContext";

const JournalSidebar = ({
  journals,
  onNew,
  moodFilter,
  onMoodFilter,
  search,
  onSearch,
}) => {
  const { isLockEnabled, hasPasscode, lockApp, setShowSettingsModal, setShowSetupModal } = useLock();

  const totalWords = journals.reduce((sum, j) => {
    return sum + (j.content ? j.content.trim().split(/\s+/).length : 0);
  }, 0);

  const thisMonthCount = journals.filter((j) => {
    return new Date(j.createdAt || Date.now()).getMonth() === new Date().getMonth();
  }).length;

  return (
    <aside className="p-6 rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/80 dark:border-zinc-800 shadow-xl shadow-purple-950/5 dark:shadow-black/30 flex flex-col gap-5">
      {/* Brand Header */}
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-purple-600/25 flex-shrink-0">
          <BookOpen size={22} strokeWidth={2} />
        </div>
        <div>
          <h2 className="font-serif text-2xl font-bold bg-gradient-to-r from-purple-600 via-fuchsia-500 to-amber-500 bg-clip-text text-transparent leading-tight">
            Journal
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {journals.length} {journals.length === 1 ? "entry" : "entries"} recorded
          </p>
        </div>
      </div>

      {/* New Entry CTA Button */}
      <button
        type="button"
        onClick={onNew}
        className="w-full py-3.5 px-5 rounded-full font-semibold text-sm text-white bg-gradient-to-r from-purple-600 to-amber-500 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
      >
        <Plus size={18} strokeWidth={2.4} />
        <span>New Reflection</span>
      </button>

      {/* Search Input */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="search"
          placeholder="Search entries…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full h-10 pl-9 pr-8 rounded-xl bg-white/80 dark:bg-zinc-800/70 border border-zinc-200/80 dark:border-zinc-700/60 text-xs sm:text-sm text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/15 transition-all"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearch("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-zinc-100/70 dark:bg-zinc-800/50 text-center">
        <div>
          <span className="text-xs text-amber-500 block mb-0.5">🔥</span>
          <strong className="text-sm font-bold text-zinc-900 dark:text-white block">
            {journals.length > 0 ? "3d" : "0d"}
          </strong>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Streak
          </span>
        </div>
        <div>
          <span className="text-xs text-purple-500 block mb-0.5">✍️</span>
          <strong className="text-sm font-bold text-zinc-900 dark:text-white block">
            {totalWords > 1000 ? `${(totalWords / 1000).toFixed(1)}k` : totalWords}
          </strong>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Words
          </span>
        </div>
        <div>
          <span className="text-xs text-blue-500 block mb-0.5">📅</span>
          <strong className="text-sm font-bold text-zinc-900 dark:text-white block">
            {thisMonthCount}
          </strong>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Month
          </span>
        </div>
      </div>

      {/* Mood Filters */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Filter by Mood
          </span>
          {moodFilter && (
            <button
              type="button"
              onClick={() => onMoodFilter(null)}
              className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold hover:underline"
            >
              Reset
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {MOODS.map((m) => {
            const isSelected = moodFilter === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onMoodFilter(isSelected ? null : m.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-white/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700/60 hover:border-purple-400"
                }`}
              >
                <span>{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* App Lock Protection Notice */}
      <div className="mt-auto pt-4 border-t border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <span className="flex items-center gap-1.5">
          <Lock size={13} className="text-purple-600 dark:text-purple-400" />
          <span>{isLockEnabled ? "Vault Encrypted" : "App Lock Ready"}</span>
        </span>
        <button
          type="button"
          onClick={() => (hasPasscode ? setShowSettingsModal(true) : setShowSetupModal(true))}
          className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
        >
          {isLockEnabled ? "Settings" : "Setup PIN"}
        </button>
      </div>
    </aside>
  );
};

export default JournalSidebar;
