import { useState, useEffect } from "react";
import { ArrowLeft, Save, Sparkles, Loader2 } from "lucide-react";
import MoodSelector from "./MoodSelector";

const PROMPTS = [
  "What made you smile today? ✨",
  "What are you truly grateful for right now? 🙏",
  "Describe a moment that felt meaningful today…",
  "What's been on your mind lately?",
  "What challenge did you face — and how did you handle it?",
  "What do you want to remember about today?",
  "If today had a title, what would it be?",
];

const JournalEditor = ({
  initialJournal,
  onSave,
  onCancel,
  saving,
}) => {
  const [title, setTitle] = useState(initialJournal?.title || "");
  const [content, setContent] = useState(initialJournal?.content || "");
  const [mood, setMood] = useState(initialJournal?.mood || "calm");

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;
    onSave({
      title: title.trim() || "Untitled Reflection",
      content: content.trim(),
      mood,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/80 dark:border-zinc-800 shadow-xl shadow-purple-950/5 dark:shadow-black/30 flex flex-col gap-6"
    >
      {/* Top Header & Actions */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Timeline</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || (!title.trim() && !content.trim())}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-purple-600 to-amber-500 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-purple-600/30 disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>{saving ? "Saving Reflection…" : initialJournal ? "Update Entry" : "Save Story"}</span>
          </button>
        </div>
      </div>

      {/* Inspirational Prompts Chips */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block mb-2">
          ✨ Need Inspiration?
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {PROMPTS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (!content) setContent(p + "\n\n");
                else setContent((prev) => prev + "\n" + p + "\n");
              }}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium bg-purple-500/10 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20 transition-colors whitespace-nowrap"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Title Input */}
      <input
        type="text"
        placeholder="Give this reflection a title…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
        className="w-full font-serif text-2xl sm:text-3xl font-bold bg-transparent text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none border-b border-zinc-200/60 dark:border-zinc-800 pb-3"
      />

      {/* Mood Selector Row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Current Mood:
        </span>
        <MoodSelector selectedMood={mood} onSelectMood={setMood} />
      </div>

      {/* Reflection Content Textarea */}
      <div className="relative flex flex-col flex-1">
        <textarea
          rows={12}
          placeholder="Write freely… What happened today? How did you feel? What gave you peace?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-4 rounded-2xl bg-zinc-50/70 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 text-sm sm:text-base text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition-all resize-y leading-relaxed"
        />

        {/* Live Word / Character Stats */}
        <div className="flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500 mt-2 px-1">
          <span>{wordCount} words</span>
          <span>{content.length} characters</span>
        </div>
      </div>
    </form>
  );
};

export default JournalEditor;
