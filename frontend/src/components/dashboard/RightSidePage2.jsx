import { BookOpen, StickyNote, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import noteApi from "../../api/note.api";
import journalApi from "../../api/journal.api";

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

const NOTE_TAGS = [
  { label: "Ideas", color: "bg-amber-100 text-amber-800 border-amber-200" },
  {
    label: "Reading",
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  { label: "Life", color: "bg-rose-100 text-rose-800 border-rose-200" },
  { label: "Work", color: "bg-sky-100 text-sky-800 border-sky-200" },
];

const DEFAULT_LAST_JOURNAL = {
  title: "Finding Stillness in the Chaos",
  date: "Today, 9:45 PM",
  mood: "Calm 🌿",
  tag: "Reflection",
  wordCount: 248,
  content:
    "Today was a grounding reminder that progress isn't about rushing through a checklist. Taking an hour to disconnect and write brought immediate clarity on what truly matters for tomorrow. Gratitude for the quiet wins.",
};

const RightSidePage2 = () => {
  // Notes State
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem("lifesync_notes");
      return saved ? JSON.parse(saved) : INITIAL_NOTES;
    } catch {
      return INITIAL_NOTES;
    }
  });

  // Last Journal State
  const [lastJournal, setLastJournal] = useState(() => {
    try {
      const saved = localStorage.getItem("lifesync_last_journal");
      return saved ? JSON.parse(saved) : DEFAULT_LAST_JOURNAL;
    } catch {
      return DEFAULT_LAST_JOURNAL;
    }
  });

  // Fetch Notes from Backend
  useEffect(() => {
    let isMounted = true;
    const fetchNotes = async () => {
      try {
        const data = await noteApi.getNotes();
        if (isMounted && data?.notes && data.notes.length > 0) {
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

  // Fetch Last Journal from Backend
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
        console.warn("Could not fetch last journal from backend, using cached state:", err?.message);
      }
    };

    fetchLastJournal();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem("lifesync_notes", JSON.stringify(notes));
    } catch (e) {
      console.error("Failed to save notes:", e);
    }
  }, [notes]);

  const handleDeleteNote = async (id) => {
    // Optimistic UI update
    setNotes((prev) => prev.filter((n) => n.id !== id && n._id !== id));

    // Call backend API
    try {
      await noteApi.deleteNote(id);
    } catch (err) {
      console.warn("Failed to delete note on backend:", err?.message);
    }
  };

  const getTagStyle = (tag) => {
    const match = NOTE_TAGS.find((t) => t.label === tag);
    return match?.color || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="h-10/12 w-[40%] flex flex-col justify-between select-none">
      {/* Top Section (60%): Quick Notes & Ideas */}
      <div className="bg-white h-[61%] w-full rounded-4xl p-6 flex flex-col justify-between overflow-hidden shadow-xs">
        {/* Notes Header */}
        <div className="flex items-center justify-between pb-3 border-b border-black/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700">
              <StickyNote size={17} />
            </div>
            <div>
              <h2 className="text-xl font-semibold select-none text-black leading-tight">
                Quick Notes
              </h2>
              <p className="text-[11px] text-black/50">
                Capture thoughts & memos
              </p>
            </div>
          </div>
        </div>

        {/* Notes Body: Cards List */}
        <div className="flex-1 overflow-y-auto py-3">
          {notes.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-black/40">
              <p className="text-sm font-medium">No notes saved yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {notes.map((n) => {
                const noteId = n.id || n._id;
                return (
                  <div
                    key={noteId}
                    className="group relative bg-[#f9f9f9] hover:bg-[#f1f1f1] border border-black/5 rounded-2xl p-3 flex flex-col justify-between transition min-h-27.5"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`text-[9px] px-2 py-0.2 rounded-full border font-medium ${getTagStyle(
                            n.tag
                          )}`}
                        >
                          {n.tag}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteNote(noteId)}
                          className="opacity-0 group-hover:opacity-100 text-black/40 hover:text-red-600 transition cursor-pointer p-0.5"
                          title="Delete note"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <h3 className="text-xs font-semibold text-black line-clamp-1 leading-snug">
                        {n.title}
                      </h3>
                      <p className="text-[11px] text-black/60 line-clamp-2 mt-1 leading-relaxed">
                        {n.content}
                      </p>
                    </div>
                    <span className="text-[9px] text-black/40 mt-2 block">
                      {n.date}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Notes Footer */}
        <div className="pt-2 border-t border-black/5 flex items-center justify-between text-xs text-black/50">
          <span>{notes.length} total saved notes</span>
        </div>
      </div>

      {/* Bottom Section (34%): Last Journal Entry */}
      <div className="bg-white h-[35%] w-full rounded-4xl p-6 flex flex-col justify-between overflow-hidden shadow-xs">
        {/* Journal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
              <BookOpen size={15} />
            </div>
            <div>
              <h2 className="text-base font-semibold select-none text-black leading-tight">
                Last Journal Entry
              </h2>
              <p className="text-[10px] text-black/45">{lastJournal.date || "Today"}</p>
            </div>
          </div>

          {lastJournal.tag && (
            <span className="px-2.5 py-0.5 bg-purple-50 border border-purple-200/80 rounded-full text-[11px] font-medium text-purple-800 flex items-center gap-1 select-none">
              <span>✦</span>
              <span>{lastJournal.tag}</span>
            </span>
          )}
        </div>

        {/* Journal Body */}
        <div className="py-1">
          <h3 className="font-serif text-xs font-semibold text-black tracking-tight line-clamp-1 mb-1">
            {lastJournal.title}
          </h3>
          <p className="text-[11px] text-black/75 font-serif leading-relaxed line-clamp-2 italic">
            "{lastJournal.content}"
          </p>
        </div>

        {/* Journal Footer */}
        <div className="pt-2 border-t border-black/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[11px] text-black/50">
            <span>{lastJournal.wordCount || 0} words</span>
            {lastJournal.mood && (
              <>
                <span>•</span>
                <span>Mood: {lastJournal.mood}</span>
              </>
            )}
          </div>

          <span className="text-[11px] font-medium text-purple-700 hover:text-purple-900 transition cursor-pointer select-none">
            View in Journal →
          </span>
        </div>
      </div>
    </div>
  );
};

export default RightSidePage2;
