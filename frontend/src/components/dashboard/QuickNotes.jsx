import { useState, useEffect } from "react";
import { StickyNote, Plus, Trash2, FileText, Loader2 } from "lucide-react";
import noteApi from "../../api/note.api";

const INITIAL_NOTES = [
  {
    id: "1",
    title: "LifeSync Vision",
    content:
      "Minimalist personal dashboard blending productivity, financial clarity, and mindful journaling into one seamless routine.",
    tag: "Life",
    date: "Today",
  },
  {
    id: "2",
    title: "Atomic Habits Insight",
    content:
      "Every action you take is a vote for the type of person you wish to become. Small positive votes compound quietly.",
    tag: "Reading",
    date: "Yesterday",
  },
  {
    id: "3",
    title: "Design Philosophy",
    content:
      "Quiet editorial aesthetics, Marcellus serif typography, subtle pastel accents, and effortless interactions.",
    tag: "Ideas",
    date: "Nov 12",
  },
  {
    id: "4",
    title: "Sprint Goals",
    content:
      "Polish responsive layout, finalize dashboard views, verify local storage persistence, and test build.",
    tag: "Work",
    date: "Nov 11",
  },
];

const TAG_STYLES = {
  Life: "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800/40",
  Reading: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800/40",
  Ideas: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800/40",
  Work: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40",
  Personal: "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800/40",
};

const QuickNotes = () => {
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem("lifesync_notes");
      return saved ? JSON.parse(saved) : INITIAL_NOTES;
    } catch {
      return INITIAL_NOTES;
    }
  });

  const [showAddNote, setShowAddNote] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftContent, setDraftContent] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchNotes = async () => {
      try {
        const data = await noteApi.getNotes();
        if (isMounted && Array.isArray(data?.notes)) {
          setNotes(data.notes);
          localStorage.setItem("lifesync_notes", JSON.stringify(data.notes));
        }
      } catch (err) {
        console.warn("Could not fetch notes from backend, using cached state:", err?.message);
      }
    };
    fetchNotes();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("lifesync_notes", JSON.stringify(notes));
    } catch (err) {
      console.error("Failed to save notes:", err);
    }
  }, [notes]);

  const handleDeleteNote = async (id) => {
    setNotes((prev) => prev.filter((note) => note.id !== id && note._id !== id));
    try {
      await noteApi.deleteNote(id);
    } catch (err) {
      console.warn("Failed to delete note on backend:", err?.message);
    }
  };

  const handleCreateNote = async (event) => {
    event.preventDefault();
    const title = draftTitle.trim();
    const content = draftContent.trim();
    if (!title || !content) return;

    const localId = `local-${Date.now()}`;
    const localNote = {
      id: localId,
      title,
      content,
      tag: "Ideas",
      date: "Today",
    };

    setNotes((prev) => [localNote, ...prev]);
    setDraftTitle("");
    setDraftContent("");
    setShowAddNote(false);
    setSavingNote(true);

    try {
      const response = await noteApi.createNote({
        title,
        content,
        tag: "Ideas",
      });
      const savedNote = response?.note || response;
      if (savedNote && (savedNote.id || savedNote._id)) {
        setNotes((prev) =>
          prev.map((note) => (note.id === localId ? savedNote : note))
        );
      }
    } catch (err) {
      console.warn("Note saved locally; backend sync failed:", err?.message);
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <section
      className="p-6 sm:p-7 rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/80 dark:border-zinc-800 shadow-xl shadow-purple-950/5 dark:shadow-black/20 flex flex-col gap-5 relative transition-all"
      aria-label="Quick Notes"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
            <StickyNote size={22} strokeWidth={2.2} />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-white leading-tight">
              Quick Notes
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Capture thoughts & memos
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAddNote((prev) => !prev)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 active:scale-95 transition-all"
        >
          <Plus size={14} strokeWidth={2.4} />
          <span>Add Note</span>
        </button>
      </div>

      {/* Note Composer Form */}
      {showAddNote && (
        <form
          onSubmit={handleCreateNote}
          className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700/60 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <input
            autoFocus
            type="text"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            placeholder="Note title"
            aria-label="Note title"
            maxLength={70}
            className="w-full px-3 py-2 text-sm font-semibold rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-amber-500/30"
          />
          <textarea
            value={draftContent}
            onChange={(e) => setDraftContent(e.target.value)}
            placeholder="Write a quick thought..."
            aria-label="Note content"
            rows={3}
            maxLength={500}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-amber-500/30 resize-none"
          />
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddNote(false)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!draftTitle.trim() || !draftContent.trim()}
              className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/20 hover:brightness-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
              Save note
            </button>
          </div>
        </form>
      )}

      {savingNote && (
        <span className="absolute right-6 bottom-4 text-[10px] text-zinc-400 flex items-center gap-1">
          <Loader2 size={10} className="animate-spin text-amber-500" /> Syncing note…
        </span>
      )}

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center text-zinc-400 dark:text-zinc-500">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center mb-3 text-zinc-400 dark:text-zinc-500">
            <FileText size={32} strokeWidth={1.5} />
          </div>
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            No notes saved yet
          </p>
          <span className="text-xs text-zinc-400 mt-1 max-w-xs">
            Jot down your thoughts, ideas or reminders anytime.
          </span>
          <div className="mt-4 text-[11px] font-medium px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500">
            0 total saved notes
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1">
            {notes.map((note) => {
              const noteId = note.id || note._id;
              const tagStyle = TAG_STYLES[note.tag] || TAG_STYLES.Personal;
              return (
                <article
                  key={noteId}
                  className="group p-4 rounded-2xl bg-white/50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800 hover:border-amber-500/40 dark:hover:border-amber-500/30 hover:bg-white dark:hover:bg-zinc-800/70 transition-all flex flex-col gap-2 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${tagStyle}`}
                    >
                      {note.tag || "Note"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteNote(noteId)}
                      aria-label="Delete note"
                      className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-rose-500 transition-all p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white leading-snug">
                    {note.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-3 leading-relaxed">
                    {note.content}
                  </p>
                </article>
              );
            })}
          </div>
          <div className="pt-2 text-[11px] font-medium text-zinc-400 dark:text-zinc-500 text-center">
            {notes.length} total saved {notes.length === 1 ? "note" : "notes"}
          </div>
        </>
      )}
    </section>
  );
};

export default QuickNotes;