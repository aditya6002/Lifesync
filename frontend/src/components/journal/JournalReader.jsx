import { ArrowLeft, Pencil, Trash2, Calendar, Clock, Smile } from "lucide-react";
import { MOODS } from "./MoodSelector";

const JournalReader = ({ journal, onBack, onEdit, onDelete }) => {
  if (!journal) return null;

  const moodObj = MOODS.find((m) => m.id === journal.mood) || {
    id: "calm",
    emoji: "🌿",
    label: "Calm",
    color: "#10b981",
  };

  const formattedDate = new Date(journal.createdAt || Date.now()).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const wordCount = journal.content ? journal.content.trim().split(/\s+/).length : 0;

  return (
    <article className="p-6 sm:p-10 rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/80 dark:border-zinc-800 shadow-xl shadow-purple-950/5 dark:shadow-black/30 flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between gap-4 border-b border-zinc-200/60 dark:border-zinc-800 pb-5">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Timeline</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(journal)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 hover:bg-purple-100 transition-colors"
          >
            <Pencil size={13} />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => onDelete(journal)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
          >
            <Trash2 size={13} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Mood Badge & Date Meta */}
      <div className="flex items-center gap-3 flex-wrap">
        <span
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold"
          style={{ backgroundColor: `${moodObj.color}15`, color: moodObj.color }}
        >
          <span>{moodObj.emoji}</span>
          <span>{moodObj.label}</span>
        </span>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">•</span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">{formattedDate}</span>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">•</span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">{wordCount} words</span>
      </div>

      {/* Large Title */}
      <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white leading-tight">
        {journal.title || "Untitled Reflection"}
      </h1>

      {/* Reflection Content Body */}
      <div className="mt-4 text-base sm:text-lg text-zinc-800 dark:text-zinc-200 leading-relaxed sm:leading-loose whitespace-pre-wrap font-sans font-normal">
        {journal.content}
      </div>
    </article>
  );
};

export default JournalReader;
