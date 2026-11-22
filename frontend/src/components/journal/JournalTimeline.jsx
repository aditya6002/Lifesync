import { BookOpen, Sparkles, Loader2 } from "lucide-react";
import JournalCard from "./JournalCard";

const JournalTimeline = ({
  journals,
  hasMore,
  loading,
  onLoadMore,
  onRead,
  onEdit,
  onDelete,
  onNew,
}) => {
  if (journals.length === 0) {
    return (
      <div className="p-12 rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/80 dark:border-zinc-800 shadow-xl shadow-purple-950/5 dark:shadow-black/30 flex flex-col items-center justify-center text-center gap-3">
        <div className="w-16 h-16 rounded-3xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-1 animate-float">
          <BookOpen size={32} strokeWidth={1.8} />
        </div>
        <h3 className="font-serif text-2xl font-bold text-zinc-900 dark:text-white">
          Your Journal is Empty
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
          Capture what made you smile today, reflect on challenges, or jot down thoughts in your private encrypted vault.
        </p>
        <button
          type="button"
          onClick={onNew}
          className="mt-3 inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-sm bg-gradient-to-r from-purple-600 to-amber-500 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-purple-600/30"
        >
          <Sparkles size={16} />
          <span>Write Your First Story</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {journals.map((journal) => (
          <JournalCard
            key={journal._id || journal.id}
            journal={journal}
            onRead={onRead}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-xs sm:text-sm bg-white/80 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-200 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400 transition-all shadow-sm"
          >
            {loading && <Loader2 size={14} className="animate-spin text-purple-600" />}
            <span>{loading ? "Loading more stories…" : "Load More Entries"}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default JournalTimeline;
