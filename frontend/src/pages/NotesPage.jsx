import { useState, useMemo } from "react";
import { C, FONTS } from "../shared/styles/tokens";
import {
  Glass,
  Btn,
  Badge,
  FInput,
  FTextarea,
  FSelect,
  InlineLoader,
} from "../shared/components/ui/Atoms";
import { Confirm } from "../shared/components/ui/Modal";
import { uid } from "../shared/utils/helpers";

// ── Constants ──────────────────────────────────────────────
const NOTE_TAGS = ["Study", "Personal", "Reading", "Career", "Ideas", "Health"];
const NOTE_COLS = [
  "#7C3AED",
  "#3b82f6",
  "#f59e0b",
  "#22c55e",
  "#ec4899",
  "#6366f1",
];

const TAG_ICONS = {
  Study: "📚",
  Personal: "🌿",
  Reading: "📖",
  Career: "💼",
  Ideas: "💡",
  Health: "🏃",
};

// ── Seed ───────────────────────────────────────────────────
const SEED = [
  {
    id: "n1",
    title: "Data Structures Notes",
    color: "#7C3AED",
    tag: "Study",
    updatedAt: "2h ago",
    createdAt: "",
    userId: "u1",
    pinned: true,
    content:
      "Binary trees:\n- Each node has at most 2 children\n- AVL trees maintain balance factor ∈ {-1,0,1}\n\nAVL Rotations:\n1. LL → Right rotation\n2. RR → Left rotation\n3. LR → Left-Right rotation\n4. RL → Right-Left rotation\n\nHeap Sort:\n- Build max heap: O(n)\n- Extract max n times: O(n log n)\n- Total: O(n log n)\n\nKey insight: Always maintain the BST property while balancing.",
  },
  {
    id: "n2",
    title: "Project Ideas 2025",
    color: "#3b82f6",
    tag: "Personal",
    updatedAt: "Yesterday",
    createdAt: "",
    userId: "u1",
    pinned: true,
    content:
      "1. AI journal app with mood analysis\n2. Expense tracker with ML predictions\n3. Collaborative whiteboard tool\n4. Habit tracker with streaks\n5. Voice-to-text notes with smart tagging\n\nPriority: Start with #1 and #4 — both are achievable in a month.",
  },
  {
    id: "n3",
    title: "Atomic Habits — Summary",
    color: "#f59e0b",
    tag: "Reading",
    updatedAt: "Mar 9",
    createdAt: "",
    userId: "u1",
    content:
      "1% Rule: Tiny improvements compound. 1% better daily = 37× better in a year.\n\nHabit Loop: Cue → Craving → Response → Reward\n\nHabit Stacking: After [CURRENT], I will [NEW]\n\nEnvironment Design: Make good habits obvious, attractive, easy, satisfying.\n\nFour Laws of Behavior Change:\n1. Make it obvious\n2. Make it attractive\n3. Make it easy\n4. Make it satisfying\n\nKey quote: You do not rise to the level of your goals. You fall to the level of your systems.",
  },
  {
    id: "n4",
    title: "Interview Prep Checklist",
    color: "#22c55e",
    tag: "Career",
    updatedAt: "Mar 8",
    createdAt: "",
    userId: "u1",
    content:
      "System Design:\n☑ Load balancing\n☐ Database sharding\n☑ CAP theorem\n☐ Microservices\n☐ Event-driven architecture\n\nDSA Must-do:\n☑ Arrays & strings\n☑ Trees & graphs\n☐ DP patterns\n☐ Sliding window\n☐ Two pointers\n\nBehavioral:\n☐ STAR format stories\n☐ Strengths & weaknesses\n☐ Why this company?",
  },
  {
    id: "n5",
    title: "Startup Ideas",
    color: "#ec4899",
    tag: "Ideas",
    updatedAt: "Mar 5",
    createdAt: "",
    userId: "u1",
    content:
      "1. AI-powered study planner for students\n2. Peer-to-peer skill exchange platform\n3. Micro-journaling for developers\n4. Budget tracker specifically for hostel students\n5. Campus carpool matcher\n\nValidation steps for #1:\n- Survey 50 students\n- Build MVP in 2 weeks\n- Get 10 beta users",
  },
  {
    id: "n6",
    title: "Workout Plan",
    color: "#6366f1",
    tag: "Health",
    updatedAt: "Mar 3",
    createdAt: "",
    userId: "u1",
    content:
      "Weekly Split:\nMonday: Chest + Triceps\nTuesday: Back + Biceps\nWednesday: Rest / Active recovery\nThursday: Legs\nFriday: Shoulders + Traps\nSat/Sun: Cardio OR rest\n\nCore every day: 3 sets of plank (1 min), 20 crunches, 20 leg raises\n\nProtein goal: 120g/day\nSleep: 7-8 hrs minimum",
  },
];

// ── Full-screen note editor/viewer ─────────────────────────
function NoteFullScreen({ note, onClose, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    onSave(note.id, title, content);
    setSaving(false);
    setEditing(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(7,9,15,.96)",
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        animation: "fadeIn .2s ease",
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          height: 56,
          borderBottom: `1px solid ${C.glassBorder}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          flexShrink: 0,
          background: "rgba(13,17,23,.98)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "none",
              border: "none",
              color: C.textMid,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            ← Back
          </button>
          <div style={{ width: 1, height: 20, background: C.glassBorder }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 3,
                background: note.color,
              }}
            />
            <Badge label={note.tag} color={note.color} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: C.textDim }}>
            {wordCount} words · Updated {note.updatedAt}
          </span>
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 16px",
                  borderRadius: 9,
                  background: `linear-gradient(135deg,${C.violet},${C.violetLight})`,
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {saving ? (
                  <>
                    <InlineLoader size={13} color="#fff" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </button>
              <Btn
                variant="ghost"
                small
                onClick={() => {
                  setEditing(false);
                  setTitle(note.title);
                  setContent(note.content);
                }}
              >
                Cancel
              </Btn>
            </>
          ) : (
            <>
              <Btn small onClick={() => setEditing(true)}>
                ✏️ Edit
              </Btn>
              <Btn variant="ai" small>
                ⟡ AI Summarize
              </Btn>
              <Btn variant="danger" small onClick={() => setConfirm(true)}>
                🗑
              </Btn>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 720 }}>
          {editing ? (
            <>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title..."
                style={{
                  width: "100%",
                  fontSize: 28,
                  fontFamily: FONTS.display,
                  fontWeight: 700,
                  background: "transparent",
                  border: "none",
                  borderBottom: `1px solid ${C.glassBorder}`,
                  color: C.text,
                  outline: "none",
                  paddingBottom: 12,
                  marginBottom: 24,
                }}
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note..."
                style={{
                  width: "100%",
                  minHeight: "60vh",
                  background: "transparent",
                  border: "none",
                  color: C.textMid,
                  fontSize: 15,
                  lineHeight: 1.85,
                  outline: "none",
                  resize: "none",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              />
            </>
          ) : (
            <>
              <h1
                style={{
                  fontFamily: FONTS.display,
                  fontSize: 28,
                  color: C.text,
                  fontWeight: 700,
                  marginBottom: 16,
                  lineHeight: 1.3,
                }}
              >
                {title}
              </h1>
              <div
                style={{
                  fontSize: 15,
                  color: C.textMid,
                  lineHeight: 1.85,
                  whiteSpace: "pre-wrap",
                }}
              >
                {content}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete confirm */}
      {confirm && (
        <Confirm
          message={`Delete "${note.title}"? This cannot be undone.`}
          onConfirm={() => {
            onDelete(note.id);
            onClose();
          }}
          onCancel={() => setConfirm(false)}
        />
      )}
    </div>
  );
}

// ── Main NotesPage ──────────────────────────────────────────
export default function NotesPage() {
  const [notes, setNotes] = useState(SEED);
  const [vm, setVm] = useState("grid");
  const [folder, setFolder] = useState("All");
  const [search, setSearch] = useState("");
  const [fullNote, setFullNote] = useState(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    tag: "Study",
    color: NOTE_COLS[0],
  });
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const sf = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  // Sorted: pinned first, then by updatedAt
  const filtered = useMemo(() => {
    let list = notes
      .filter((n) => folder === "All" || n.tag === folder)
      .filter(
        (n) =>
          !search ||
          n.title.toLowerCase().includes(search.toLowerCase()) ||
          n.content.toLowerCase().includes(search.toLowerCase()),
      );
    return [...list.filter((n) => n.pinned), ...list.filter((n) => !n.pinned)];
  }, [notes, folder, search]);

  const togglePin = (id, e) => {
    e.stopPropagation();
    setNotes((p) =>
      p.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)),
    );
  };

  const handleAdd = async () => {
    if (!form.title) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    const n = {
      ...form,
      id: uid(),
      updatedAt: "Just now",
      createdAt: new Date().toISOString(),
      userId: "u1",
    };
    setNotes((p) => [n, ...p]);
    setSaving(false);
    setAdding(false);
    setForm({ title: "", content: "", tag: "Study", color: NOTE_COLS[0] });
  };

  const handleSave = (id, title, content) => {
    setNotes((p) =>
      p.map((n) =>
        n.id === id ? { ...n, title, content, updatedAt: "Just now" } : n,
      ),
    );
  };

  const handleDelete = (id) => {
    setNotes((p) => p.filter((n) => n.id == id));
    setConfirm(null);
  };

  const counts = useMemo(() => {
    const m = { All: notes.length };
    NOTE_TAGS.forEach((t) => {
      m[t] = notes.filter((n) => n.tag === t).length;
    });
    return m;
  }, [notes]);

  return (
    <div
      className="screen-in"
      style={{
        display: "flex",
        gap: 0,
        height: "calc(100vh - 100px)",
        overflow: "hidden",
      }}
    >
      {/* ── LEFT SIDEBAR ── */}
      <div
        style={{
          width: 200,
          flexShrink: 0,
          borderRight: `1px solid ${C.glassBorder}`,
          display: "flex",
          flexDirection: "column",
          padding: "16px 0",
          overflowY: "auto",
        }}
      >
        {/* Logo section */}
        <div
          style={{
            padding: "0 16px 16px",
            borderBottom: `1px solid ${C.glassBorder}`,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: 16,
              color: C.text,
              fontWeight: 700,
              marginBottom: 4,
            }}
          >
            Notes
          </div>
          <div style={{ fontSize: 11, color: C.textDim }}>
            {notes.length} notes total
          </div>
        </div>

        {/* Folders */}
        <div style={{ padding: "0 8px", flex: 1 }}>
          <div
            style={{
              fontSize: 10,
              color: C.textDim,
              textTransform: "uppercase",
              letterSpacing: 1,
              padding: "0 8px",
              marginBottom: 8,
            }}
          >
            Folders
          </div>
          {["All", ...NOTE_TAGS].map((f) => (
            <button
              key={f}
              onClick={() => setFolder(f)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 10px",
                borderRadius: 9,
                cursor: "pointer",
                background:
                  folder === f ? "rgba(124,58,237,.15)" : "transparent",
                border: "none",
                marginBottom: 2,
                transition: "all .15s",
              }}
            >
              <span style={{ fontSize: 15 }}>
                {f === "All" ? "📂" : TAG_ICONS[f]}
              </span>
              <span
                style={{
                  flex: 1,
                  textAlign: "left",
                  fontSize: 12,
                  color: folder === f ? "#c4b5fd" : C.textDim,
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                {f}
              </span>
              <span
                style={{
                  fontSize: 10,
                  color: folder === f ? C.violet : C.textDim,
                  background: "rgba(255,255,255,.06)",
                  padding: "1px 6px",
                  borderRadius: 20,
                }}
              >
                {counts[f] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Add note button */}
        <div
          style={{
            padding: "12px 16px",
            borderTop: `1px solid ${C.glassBorder}`,
          }}
        >
          <Btn onClick={() => setAdding(true)} style={{ width: "100%" }}>
            + New Note
          </Btn>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            padding: "12px 16px",
            borderBottom: `1px solid ${C.glassBorder}`,
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          {/* Search */}
          <div style={{ flex: 1, position: "relative" }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${folder === "All" ? "all notes" : folder.toLowerCase() + " notes"}...`}
              style={{
                width: "100%",
                background: "rgba(255,255,255,.05)",
                border: `1px solid ${C.glassBorder}`,
                borderRadius: 10,
                padding: "8px 12px 8px 34px",
                color: C.text,
                fontSize: 13,
                outline: "none",
              }}
            />
            <span
              style={{
                position: "absolute",
                left: 11,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 14,
                color: C.textDim,
              }}
            >
              🔍
            </span>
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: C.textDim,
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                ✕
              </button>
            )}
          </div>
          {/* View toggle */}
          <div
            style={{
              display: "flex",
              gap: 4,
              background: "rgba(255,255,255,.03)",
              border: `1px solid ${C.glassBorder}`,
              borderRadius: 9,
              padding: 3,
            }}
          >
            {["grid", "list"].map((v) => (
              <button
                key={v}
                onClick={() => setVm(v)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 7,
                  border: "none",
                  cursor: "pointer",
                  background:
                    vm === v
                      ? `linear-gradient(135deg,${C.violet},${C.violetLight})`
                      : "transparent",
                  color: vm === v ? "#fff" : C.textMid,
                  fontSize: 12,
                  fontWeight: vm === v ? 600 : 400,
                  transition: "all .15s",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                {v === "grid" ? "⊞" : "☰"}
              </button>
            ))}
          </div>
          <span style={{ fontSize: 12, color: C.textDim }}>
            {filtered.length} {filtered.length === 1 ? "note" : "notes"}
          </span>
        </div>

        {/* Notes grid/list */}
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          {/* Pinned section */}
          {filtered.some((n) => n.pinned) && (
            <div style={{ marginBottom: 20 }}>
              <div
                style={{
                  fontSize: 11,
                  color: C.textDim,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 10,
                }}
              >
                📌 Pinned
              </div>
              <div
                style={{
                  display: vm === "grid" ? "grid" : "flex",
                  gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {filtered
                  .filter((n) => n.pinned)
                  .map((n) => (
                    <NoteCard
                      key={n.id}
                      note={n}
                      vm={vm}
                      onOpen={() => setFullNote(n)}
                      onPin={togglePin}
                      onDelete={(e) => {
                        e.stopPropagation();
                        setConfirm(n);
                      }}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Other notes */}
          {filtered.some((n) => !n.pinned) && (
            <div>
              {filtered.some((n) => n.pinned) && (
                <div
                  style={{
                    fontSize: 11,
                    color: C.textDim,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: 10,
                  }}
                >
                  All Notes
                </div>
              )}
              <div
                style={{
                  display: vm === "grid" ? "grid" : "flex",
                  gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {filtered
                  .filter((n) => !n.pinned)
                  .map((n) => (
                    <NoteCard
                      key={n.id}
                      note={n}
                      vm={vm}
                      onOpen={() => setFullNote(n)}
                      onPin={togglePin}
                      onDelete={(e) => {
                        e.stopPropagation();
                        setConfirm(n);
                      }}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Empty */}
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", paddingTop: 60 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>◇</div>
              <div style={{ color: C.textDim, fontSize: 14 }}>
                {search
                  ? `No notes matching "${search}"`
                  : `No notes in ${folder}`}
              </div>
              <div style={{ marginTop: 16 }}>
                <Btn onClick={() => setAdding(true)}>+ New Note</Btn>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── ADD NOTE PANEL (slide-in from right) ── */}
      {adding && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.6)",
            zIndex: 900,
            display: "flex",
            justifyContent: "flex-end",
          }}
          onClick={(e) => e.target === e.currentTarget && setAdding(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 480,
              background: "#0d1117",
              borderLeft: `1px solid ${C.glassBorder}`,
              display: "flex",
              flexDirection: "column",
              animation: "slideUp .25s ease",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: `1px solid ${C.glassBorder}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontFamily: FONTS.display,
                  fontSize: 17,
                  color: C.text,
                  fontWeight: 700,
                }}
              >
                New Note
              </span>
              <button
                onClick={() => setAdding(false)}
                style={{
                  background: "rgba(255,255,255,.06)",
                  border: "none",
                  color: C.textMid,
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                ✕
              </button>
            </div>
            <div
              style={{
                flex: 1,
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 14,
                overflowY: "auto",
              }}
            >
              {/* Color + tag row */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {NOTE_COLS.map((c) => (
                  <button
                    key={c}
                    onClick={() => sf("color", c)}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      background: c,
                      border:
                        form.color === c
                          ? "3px solid #fff"
                          : "2px solid transparent",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
              <FSelect
                label="Tag"
                value={form.tag}
                onChange={(v) => sf("tag", v)}
                options={NOTE_TAGS.map((t) => ({
                  value: t,
                  label: `${TAG_ICONS[t]} ${t}`,
                }))}
              />
              <FInput
                label="Title"
                value={form.title}
                onChange={(v) => sf("title", v)}
                placeholder="Note title..."
                required
              />
              <FTextarea
                label="Content"
                value={form.content}
                onChange={(v) => sf("content", v)}
                placeholder="Write your note..."
                rows={12}
              />
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={handleAdd}
                  disabled={!form.title || saving}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 22px",
                    borderRadius: 10,
                    background:
                      !form.title || saving
                        ? "rgba(124,58,237,.4)"
                        : `linear-gradient(135deg,${C.violet},${C.violetLight})`,
                    border: "none",
                    color: "#fff",
                    cursor: !form.title || saving ? "not-allowed" : "pointer",
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  {saving ? (
                    <>
                      <InlineLoader size={14} color="#fff" />
                      Saving...
                    </>
                  ) : (
                    "Save Note"
                  )}
                </button>
                <Btn variant="ghost" onClick={() => setAdding(false)}>
                  Cancel
                </Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FULL-SCREEN NOTE ── */}
      {fullNote && (
        <NoteFullScreen
          note={fullNote}
          onClose={() => setFullNote(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}

      {/* ── DELETE CONFIRM ── */}
      {confirm && (
        <Confirm
          message={`Delete "${confirm.title}"? This cannot be undone.`}
          onConfirm={() => handleDelete(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}

// ── Note Card Component ────────────────────────────────────
function NoteCard({ note, vm, onOpen, onPin, onDelete }) {
  const wc = note.content.trim().split(/\s+/).filter(Boolean).length;
  const preview = note.content.slice(0, 120);

  return (
    <div
      onClick={onOpen}
      className="hov-card"
      style={{
        padding: 16,
        borderRadius: 14,
        background: note.pinned ? "rgba(255,255,255,.05)" : C.glass,
        border: `1px solid ${note.pinned ? note.color + "40" : C.glassBorder}`,
        cursor: "pointer",
        transition: "all .2s",
        display: "flex",
        flexDirection: vm === "list" ? "row" : "column",
        gap: vm === "list" ? 12 : 0,
      }}
    >
      {/* Color bar (grid) / dot (list) */}
      {vm === "grid" ? (
        <div
          style={{
            height: 3,
            borderRadius: 4,
            background: note.color,
            marginBottom: 12,
          }}
        />
      ) : (
        <div
          style={{
            width: 4,
            borderRadius: 4,
            background: note.color,
            flexShrink: 0,
          }}
        />
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: vm === "grid" ? 8 : 4,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 14,
                color: C.text,
                fontWeight: 700,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                marginBottom: 4,
              }}
            >
              {note.title}
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 12 }}>{TAG_ICONS[note.tag]}</span>
              <Badge label={note.tag} color={note.color} />
              {note.pinned && (
                <span style={{ fontSize: 10, color: note.color }}>📌</span>
              )}
            </div>
          </div>
          <div
            style={{ display: "flex", gap: 4, marginLeft: 8, flexShrink: 0 }}
          >
            <button
              onClick={(e) => onPin(note.id, e)}
              title={note.pinned ? "Unpin" : "Pin"}
              style={{
                padding: "3px 6px",
                borderRadius: 6,
                background: "rgba(255,255,255,.04)",
                border: "none",
                color: note.pinned ? note.color : C.textDim,
                cursor: "pointer",
                fontSize: 11,
              }}
            >
              📌
            </button>
            <button
              onClick={onDelete}
              style={{
                padding: "3px 6px",
                borderRadius: 6,
                background: "rgba(239,68,68,.06)",
                border: "none",
                color: C.red,
                cursor: "pointer",
                fontSize: 11,
              }}
            >
              🗑
            </button>
          </div>
        </div>

        {/* Preview */}
        {vm === "grid" ? (
          <div
            style={{
              fontSize: 12,
              color: C.textDim,
              lineHeight: 1.6,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {preview}
            {note.content.length > 120 ? "..." : ""}
          </div>
        ) : (
          <div
            style={{
              fontSize: 12,
              color: C.textDim,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {preview}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: vm === "grid" ? 12 : 6,
          }}
        >
          <span style={{ fontSize: 10, color: C.textDim }}>
            {note.updatedAt}
          </span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 10, color: C.textDim }}>{wc}w</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
              }}
              style={{
                fontSize: 10,
                padding: "2px 8px",
                borderRadius: 6,
                background: "rgba(124,58,237,.15)",
                border: "1px solid rgba(124,58,237,.3)",
                color: "#c4b5fd",
                cursor: "pointer",
              }}
            >
              ⟡ AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
