import { BookOpen, Wallet, FileText, ArrowRight, Check } from "lucide-react";

const ActivityItem = ({ item, type, onToggleTask, onNavigate }) => {
  if (type === "journal") {
    return (
      <article className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 dark:bg-zinc-800/60 border border-white dark:border-zinc-700/60 shadow-sm hover:-translate-y-0.5 transition-all">
        <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
          <BookOpen size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <strong className="text-sm font-semibold text-zinc-900 dark:text-white truncate block">
            {item.title || "Untitled Reflection"}
          </strong>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Mood: {item.mood || "Calm 🌿"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("/journal")}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
          title="Read in Journal"
        >
          <ArrowRight size={15} />
        </button>
      </article>
    );
  }

  if (type === "task") {
    return (
      <article
        className={`flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 dark:bg-zinc-800/60 border border-white dark:border-zinc-700/60 shadow-sm transition-all ${
          item.isDone ? "opacity-60" : ""
        }`}
      >
        <button
          type="button"
          onClick={() => onToggleTask(item.id, item.isDone)}
          className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors ${
            item.isDone
              ? "bg-emerald-500 border-emerald-500 text-white"
              : "border-zinc-300 dark:border-zinc-600 hover:border-emerald-500"
          }`}
          aria-label="Toggle task status"
        >
          {item.isDone && <Check size={12} strokeWidth={3} />}
        </button>
        <div className="flex-1 min-w-0">
          <strong
            className={`text-sm font-semibold text-zinc-900 dark:text-white truncate block ${
              item.isDone ? "line-through text-zinc-400 dark:text-zinc-500" : ""
            }`}
          >
            {item.title || "Daily Task"}
          </strong>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
            {item.priority || "normal"} priority
          </span>
        </div>
      </article>
    );
  }

  if (type === "expense") {
    const isIncome = item.type === "income";
    return (
      <article className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 dark:bg-zinc-800/60 border border-white dark:border-zinc-700/60 shadow-sm transition-all">
        <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
          <Wallet size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <strong className="text-sm font-semibold text-zinc-900 dark:text-white truncate block">
            {item.title}
          </strong>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 capitalize">
            {item.category}
          </span>
        </div>
        <strong
          className={`font-serif text-sm font-bold ${
            isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
          }`}
        >
          {isIncome ? "+" : "-"}₹{Number(item.amount).toLocaleString("en-IN")}
        </strong>
      </article>
    );
  }

  if (type === "note") {
    return (
      <article className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/80 dark:bg-zinc-800/60 border border-white dark:border-zinc-700/60 shadow-sm transition-all">
        <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
          <FileText size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <strong className="text-sm font-semibold text-zinc-900 dark:text-white truncate block">
            {item.title}
          </strong>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Tag: {item.tag || "General"}
          </span>
        </div>
      </article>
    );
  }

  return null;
};

export default ActivityItem;
