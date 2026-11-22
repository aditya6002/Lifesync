import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, CalendarDays, Smile, ArrowRight } from "lucide-react";
import journalApi from "../../api/journal.api";

const DEFAULT_LAST_JOURNAL = {
  title: "Finding Stillness in the Chaos",
  date: "Today, 9:45 PM",
  mood: "Calm 🌿",
  tag: "Reflection",
  wordCount: 248,
  content:
    "Today was a grounding reminder that progress isn't about rushing through a checklist. Taking an hour to disconnect and write brought immediate clarity on what truly matters for tomorrow. Gratitude for the quiet wins.",
};

const LastJournalCard = () => {
  const [lastJournal, setLastJournal] = useState(() => {
    try {
      const saved = localStorage.getItem("lifesync_last_journal");
      return saved ? JSON.parse(saved) : DEFAULT_LAST_JOURNAL;
    } catch {
      return DEFAULT_LAST_JOURNAL;
    }
  });

  useEffect(() => {
    let isMounted = true;
    const fetchLastJournal = async () => {
      try {
        const data = await journalApi.getLastJournal();
        if (isMounted && data?.journal) {
          setLastJournal(data.journal);
          localStorage.setItem(
            "lifesync_last_journal",
            JSON.stringify(data.journal)
          );
        }
      } catch (err) {
        console.warn(
          "Could not fetch last journal from backend, using cached state:",
          err?.message
        );
      }
    };
    fetchLastJournal();
    return () => {
      isMounted = false;
    };
  }, []);

  const journalDate = lastJournal.date || "Today";
  const journalTitle = lastJournal.title || "Your latest reflection";
  const journalContent =
    lastJournal.content ||
    "Your latest journal entry will appear here when it is ready.";

  return (
    <section
      id="journal"
      className="p-6 sm:p-7 rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/80 dark:border-zinc-800 shadow-xl shadow-purple-950/5 dark:shadow-black/20 flex flex-col gap-5 relative overflow-hidden transition-all group"
      aria-label="Last Journal Entry"
    >
      {/* Background Decorative Glow */}
      <div
        aria-hidden="true"
        className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-purple-500/10 dark:bg-purple-600/10 blur-3xl pointer-events-none"
      />

      {/* Header */}
      <div className="flex items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
            <BookOpen size={22} strokeWidth={2.2} />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-white leading-tight">
              Last Journal Entry
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{journalDate}</p>
          </div>
        </div>

        {lastJournal.tag && (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40">
            {lastJournal.tag}
          </span>
        )}
      </div>

      {/* Journal Body */}
      <div className="relative p-5 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100/60 dark:border-purple-900/30 flex flex-col gap-2.5 z-10">
        <div className="font-serif text-3xl leading-none text-purple-400/60 select-none">
          “
        </div>
        <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-white leading-snug">
          {journalTitle}
        </h3>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 italic leading-relaxed line-clamp-4">
          {journalContent}
        </p>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs text-zinc-500 dark:text-zinc-400 relative z-10">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 font-medium">
            <CalendarDays size={14} className="text-purple-500" />
            {lastJournal.wordCount || 0} words
          </span>
          <span className="text-zinc-300 dark:text-zinc-700">·</span>
          <span className="flex items-center gap-1.5 font-medium">
            <Smile size={14} className="text-amber-500" />
            {lastJournal.mood || "Not set"}
          </span>
        </div>

        <Link
          to="/journal"
          className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 group-hover:translate-x-0.5 transition-all"
        >
          <span>View in Journal</span>
          <ArrowRight size={13} strokeWidth={2.2} />
        </Link>
      </div>
    </section>
  );
};

export default LastJournalCard;