import {
  BookOpen,
  StickyNote,
  Trash2,
  Plus,
  FileText,
  CalendarDays,
  Smile,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem("lifesync_notes");
      return saved ? JSON.parse(saved) : INITIAL_NOTES;
    } catch {
      return INITIAL_NOTES;
    }
  });
  const [lastJournal, setLastJournal] = useState(() => {
    try {
      const saved = localStorage.getItem("lifesync_last_journal");
      return saved ? JSON.parse(saved) : DEFAULT_LAST_JOURNAL;
    } catch {
      return DEFAULT_LAST_JOURNAL;
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
        console.warn(
          "Could not fetch notes from backend, using cached state:",
          err?.message,
        );
      }
    };
    fetchNotes();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchLastJournal = async () => {
      try {
        const data = await journalApi.getLastJournal();
        if (isMounted && data?.journal) {
          setLastJournal(data.journal);
          localStorage.setItem(
            "lifesync_last_journal",
            JSON.stringify(data.journal),
          );
        }
      } catch (err) {
        console.warn(
          "Could not fetch last journal from backend, using cached state:",
          err?.message,
        );
      }
    };
    fetchLastJournal();
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
    setNotes((prev) =>
      prev.filter((note) => note.id !== id && note._id !== id),
    );
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
          prev.map((note) => (note.id === localId ? savedNote : note)),
        );
      }
    } catch (err) {
      console.warn("Note saved locally; backend sync failed:", err?.message);
    } finally {
      setSavingNote(false);
    }
  };

  const journalDate = lastJournal.date || "Today";
  const journalTitle = lastJournal.title || "Your latest reflection";
  const journalContent =
    lastJournal.content ||
    "Your latest journal entry will appear here when it is ready.";

  return (
    <aside className="side-stack" aria-label="Notes and journal">
      <section className="glass-card card-hover notes-card">
        <div className="panel-head">
          <div className="panel-title-wrap">
            <div className="panel-icon">
              <StickyNote size={23} />
            </div>
            <div>
              <h2 className="panel-title">Quick Notes</h2>
              <p className="panel-subtitle">Capture thoughts &amp; memos</p>
            </div>
          </div>
          <button
            type="button"
            className="soft-action"
            aria-label="Add note"
            onClick={() => setShowAddNote(true)}
          >
            <Plus size={16} />
            Add Note
          </button>
        </div>

        {showAddNote && (
          <form className="note-composer" onSubmit={handleCreateNote}>
            <input
              autoFocus
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              placeholder="Note title"
              aria-label="Note title"
              maxLength={70}
            />
            <textarea
              value={draftContent}
              onChange={(event) => setDraftContent(event.target.value)}
              placeholder="Write a quick thought..."
              aria-label="Note content"
              rows={3}
              maxLength={500}
            />
            <div>
              <button type="button" onClick={() => setShowAddNote(false)}>
                Cancel
              </button>
              <button
                type="submit"
                disabled={!draftTitle.trim() || !draftContent.trim()}
              >
                Save note
              </button>
            </div>
          </form>
        )}
        {savingNote && (
          <span
            style={{
              position: "absolute",
              right: 22,
              bottom: 13,
              color: "#9a7c88",
              fontSize: 10,
            }}
          >
            Syncing note…
          </span>
        )}

        {notes.length === 0 ? (
          <div className="notes-empty">
            <div className="empty-art">
              <FileText size={62} strokeWidth={1.35} />
            </div>
            <strong>No notes saved yet</strong>
            <span>Jot down your thoughts, ideas or reminders.</span>
            <div className="notes-count">0 total saved notes</div>
          </div>
        ) : (
          <>
            <div className="notes-list">
              {notes.map((note) => {
                const noteId = note.id || note._id;
                return (
                  <article className="note-item" key={noteId}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 6,
                      }}
                    >
                      <span className="category-chip Personal">
                        {note.tag || "Note"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteNote(noteId)}
                        aria-label="Delete note"
                        style={{
                          border: 0,
                          background: "transparent",
                          color: "#a58e93",
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <h3>{note.title}</h3>
                    <p>{note.content}</p>
                  </article>
                );
              })}
            </div>
            <div className="notes-count">{notes.length} total saved notes</div>
          </>
        )}
      </section>

      <section id="journal" className="glass-card card-hover journal-card">
        <div className="panel-head">
          <div className="panel-title-wrap">
            <div className="panel-icon purple">
              <BookOpen size={24} />
            </div>
            <div>
              <h2 className="panel-title">Last Journal Entry</h2>
              <p className="panel-subtitle">{journalDate}</p>
            </div>
          </div>
          {lastJournal.tag && (
            <span
              className="soft-action"
              style={{
                color: "#793bc6",
                background: "linear-gradient(145deg,#f7eaff,#e8d4ff)",
              }}
            >
              <Plus size={14} />
              {lastJournal.tag}
            </span>
          )}
        </div>
        <div className="journal-body">
          <div className="quote-bubble">“</div>
          <div className="journal-copy">
            <h3>{journalTitle}</h3>
            <p>“{journalContent}”</p>
          </div>
          <div
            aria-hidden="true"
            style={{
              alignSelf: "center",
              color: "#a879e5",
              opacity: 0.65,
              animation: "float 5s ease-in-out infinite",
            }}
          >
            <BookOpen size={52} strokeWidth={1.1} />
          </div>
        </div>
        <div className="journal-footer">
          <div className="journal-meta">
            <CalendarDays size={14} />
            <span>{lastJournal.wordCount || 0} words</span>
            <span>·</span>
            <Smile size={15} />
            <span>Mood: {lastJournal.mood || "Not set"}</span>
          </div>
          <Link className="journal-link" to="/journal">
            View in Journal →
          </Link>
        </div>
      </section>
    </aside>
  );
};

export default RightSidePage2;
