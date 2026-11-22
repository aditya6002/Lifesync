import { Calendar, Clock, Pencil, Trash2, ArrowRight } from "lucide-react";
import { MOODS } from "./MoodSelector";

const JournalCard = ({ journal, onRead, onEdit, onDelete }) => {
  const moodObj = MOODS.find((m) => m.id === journal.mood) || {
    id: "calm",
    emoji: "🌿",
    label: "Calm",
    color: "#10b981",
  };

  const formattedDate = new Date(journal.createdAt || Date.now()).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const wordCount = journal.content ? journal.content.trim().split(/\s+/).length : 0;

  return (
    <article
      onClick={() => onRead(journal)}
      className="group p-5 sm:p-6 rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/80 dark:border-zinc-800 shadow-lg shadow-purple-950/5 dark:shadow-black/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-4"
    >
      <div>
        {/* Top: Mood badge + Actions */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: `${moodObj.color}15`, color: moodObj.color }}
          >
            <span>{moodObj.emoji}</span>
            <span>{moodObj.label}</span>
          </span>

          <div
            className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => onEdit(journal)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors"
              title="Edit"
            >
              <Pencil size={13} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(journal)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-serif text-lg sm:text-xl font-bold text-zinc-900 dark:text-white leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-1">
          {journal.title || "Untitled Reflection"}
        </h3>

        {/* Content Excerpt */}
        <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
          {journal.content}
        </p>
      </div>

      {/* Footer: Date & Word count */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-200/50 dark:border-zinc-800 text-[11px] text-zinc-400 dark:text-zinc-500">
        <div className="flex items-center gap-2">
          <span>{formattedDate}</span>
          <span>•</span>
          <span>{wordCount} words</span>
        </div>
        <span className="flex items-center gap-1 font-semibold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
          Read <ArrowRight size={12} />
        </span>
      </div>
    </article>
  );
};

export default JournalCard;
