import { Edit3, Trash2 } from "lucide-react";

const ExpenseItem = ({ item, categoryObj, onEdit, onDelete }) => {
  const isIncome = item.type === "income";
  const displayDate = new Date(item.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="group flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white/80 dark:bg-zinc-800/60 border border-white dark:border-zinc-700/60 shadow-sm shadow-purple-950/5 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
      {/* Category Emoji Box */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ backgroundColor: `${categoryObj.color}15` }}
      >
        <span>{categoryObj.emoji}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <strong className="font-semibold text-sm text-zinc-900 dark:text-white truncate max-w-[240px]">
            {item.title}
          </strong>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
              isIncome
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-purple-500/10 text-purple-600 dark:text-purple-400"
            }`}
          >
            {isIncome ? "Income" : categoryObj.label}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
          <span>{displayDate}</span>
          {item.note && (
            <>
              <span className="opacity-40">•</span>
              <span className="truncate max-w-[180px] sm:max-w-xs">{item.note}</span>
            </>
          )}
        </div>
      </div>

      {/* Amount & Actions */}
      <div className="flex items-center gap-3">
        <strong
          className={`font-serif text-base sm:text-lg font-bold tracking-tight ${
            isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
          }`}
        >
          {isIncome ? "+" : "-"}₹{Number(item.amount).toLocaleString("en-IN")}
        </strong>

        <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
            title="Edit"
          >
            <Edit3 size={14} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(item._id || item.id)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default ExpenseItem;
