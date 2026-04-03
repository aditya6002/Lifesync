import { useState, useMemo, useRef, useEffect, useCallback } from "react";

// ── Design tokens (inline since this is a standalone artifact) ──
const C = {
  bg: "#0f0e17",
  surface: "#1a1827",
  glass: "rgba(255,255,255,.05)",
  glassBorder: "rgba(255,255,255,.10)",
  text: "#f0eeff",
  textMid: "#a89ec9",
  textDim: "#5e5878",
  violet: "#7c3aed",
  violetLight: "#a78bfa",
  yellow: "#f59e0b",
  green: "#10b981",
  blue: "#3b82f6",
  red: "#ef4444",
};
const FONTS = { display: "'Inter',sans-serif", body: "'Inter',sans-serif" };

// ── Mood data ──
const MOODS = [
  "😴",
  "🥱",
  "😟",
  "😞",
  "😐",
  "🙂",
  "😊",
  "😄",
  "😁",
  "🤩",
  "🔥",
  "💪",
];
const MOOD_LBL = [
  "Exhausted",
  "Sleepy",
  "Worried",
  "Low",
  "Neutral",
  "Good",
  "Content",
  "Happy",
  "Confident",
  "Amazing",
  "On Fire",
  "Unstoppable",
];
const MOOD_CLR = [
  C.textDim,
  "#94a3b8",
  C.blue,
  "#60a5fa",
  C.textMid,
  C.yellow,
  "#facc15",
  C.green,
  "#22c55e",
  "#c4b5fd",
  "#f97316",
  "#ef4444",
];

// ── Helpers ──
const uid = () => Math.random().toString(36).slice(2);
const today = () => new Date().toISOString().slice(0, 10);
const fmtDate = (d) =>
  new Date(d + "T12:00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
const monthKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
const monthLabel = (key) => {
  const [y, m] = key.split("-");
  return new Date(+y, +m - 1, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
};
const prevMonth = (key) => {
  const [y, m] = key.split("-").map(Number);
  return monthKey(new Date(y, m - 2, 1));
};
const nextMonth = (key) => {
  const [y, m] = key.split("-").map(Number);
  return monthKey(new Date(y, m, 1));
};
const daysInMonth = (key) => {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m, 0).getDate();
};
const dayOfWeek = (key, day) => {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, day).getDay();
};
const CURRENT_MONTH = monthKey(new Date());
const CURRENT_DAY = new Date().getDate();

// ── SEED ──
const SEED = [
  {
    id: "j1",
    date: "2026-03-11",
    mood: 4,
    title: "Productive Wednesday",
    content:
      "<p>Had a really productive day today. Finished two assignments and finally understood <strong>AVL trees</strong>. Went for a 30-min walk in the evening.</p><p>Feeling <em>optimistic</em> about the upcoming exam.</p>",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "j2",
    date: "2026-03-10",
    mood: 2,
    title: "Distracted day",
    content:
      "<p>Couldn't focus much. Scrolled social media for <strong>3 hours</strong> straight.</p><ul><li>Need to fix sleep schedule</li><li>Will try sleeping by 11 PM tonight</li></ul>",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "j3",
    date: "2026-03-09",
    mood: 3,
    title: "Steady progress",
    content:
      "<p>Good gym session today. Started reading <em>Atomic Habits</em> again from Chapter 3.</p><blockquote>Small habits compound into remarkable results.</blockquote>",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "j4",
    date: "2026-03-08",
    mood: 1,
    title: "Rough Sunday",
    content:
      "<p>Failed the weekly quiz. Score was <strong>4/10</strong>. Feeling low but trying to stay motivated.</p><p>Going to make a proper study plan this week.</p>",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "j5",
    date: "2026-03-06",
    mood: 4,
    title: "Friday win",
    content:
      "<p>Submitted the project <strong>before the deadline</strong> 🎉 Feeling really proud.</p><p>Celebrated with friends at the cafeteria.</p>",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "j6",
    date: "2026-02-28",
    mood: 5,
    title: "February wrap-up",
    content:
      "<p>What a month! Completed the DSA challenge, read 2 books and maintained budget.</p><ul><li>DSA challenge ✓</li><li>Read 2 books ✓</li><li>Budget maintained ✓</li></ul>",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "j7",
    date: "2026-01-01",
    mood: 5,
    title: "Happy New Year 🎉",
    content:
      "<h2>2026 Goals</h2><ul><li>Get a great internship</li><li>Build something meaningful</li><li>Stay healthy</li><li>Read more books</li></ul>",
    userId: "u1",
    createdAt: "",
  },
];

// ══════════════════════════════════════════════════════════════
// Rich Text Editor Component
// ══════════════════════════════════════════════════════════════
function RichTextEditor({ value, onChange, placeholder }) {
  const editorRef = useRef(null);
  const [activeFormats, setActiveFormats] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, []);

  const updateActiveFormats = useCallback(() => {
    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      strikeThrough: document.queryCommandState("strikeThrough"),
      insertOrderedList: document.queryCommandState("insertOrderedList"),
      insertUnorderedList: document.queryCommandState("insertUnorderedList"),
    });
  }, []);

  const exec = (cmd, value = null) => {
    editorRef.current.focus();
    document.execCommand(cmd, false, value);
    onChange(editorRef.current.innerHTML);
    updateActiveFormats();
  };

  const insertHeading = (tag) => {
    editorRef.current.focus();
    document.execCommand("formatBlock", false, tag);
    onChange(editorRef.current.innerHTML);
  };

  const insertBlockquote = () => {
    editorRef.current.focus();
    document.execCommand("formatBlock", false, "blockquote");
    onChange(editorRef.current.innerHTML);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      editorRef.current.focus();
      document.execCommand(
        "insertHTML",
        false,
        `<img src="${ev.target.result}" style="max-width:100%;border-radius:10px;margin:8px 0;display:block;" />`,
      );
      onChange(editorRef.current.innerHTML);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const insertLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) exec("createLink", url);
  };

  const toolbarGroups = [
    [
      { cmd: "bold", icon: "B", label: "Bold", style: { fontWeight: 700 } },
      {
        cmd: "italic",
        icon: "I",
        label: "Italic",
        style: { fontStyle: "italic" },
      },
      {
        cmd: "underline",
        icon: "U",
        label: "Underline",
        style: { textDecoration: "underline" },
      },
      {
        cmd: "strikeThrough",
        icon: "S",
        label: "Strikethrough",
        style: { textDecoration: "line-through" },
      },
    ],
    [
      { action: () => insertHeading("h1"), icon: "H1", label: "Heading 1" },
      { action: () => insertHeading("h2"), icon: "H2", label: "Heading 2" },
      { action: () => insertHeading("p"), icon: "P", label: "Paragraph" },
    ],
    [
      { cmd: "insertUnorderedList", icon: "•≡", label: "Bullet list" },
      { cmd: "insertOrderedList", icon: "1≡", label: "Numbered list" },
      { action: insertBlockquote, icon: "❝", label: "Blockquote" },
    ],
    [
      { cmd: "justifyLeft", icon: "⬛◻◻", label: "Align left" },
      { cmd: "justifyCenter", icon: "◻⬛◻", label: "Center" },
      { cmd: "justifyRight", icon: "◻◻⬛", label: "Align right" },
    ],
    [
      { action: insertLink, icon: "🔗", label: "Insert link", emoji: true },
      {
        action: () => fileInputRef.current.click(),
        icon: "🖼",
        label: "Insert image",
        emoji: true,
      },
      { cmd: "removeFormat", icon: "✕f", label: "Clear format" },
    ],
  ];

  const btnStyle = (active) => ({
    padding: "5px 8px",
    minWidth: 32,
    height: 30,
    borderRadius: 7,
    background: active ? "rgba(124,58,237,.35)" : "rgba(255,255,255,.05)",
    border: active
      ? "1px solid rgba(124,58,237,.6)"
      : `1px solid ${C.glassBorder}`,
    color: active ? C.violetLight : C.textMid,
    cursor: "pointer",
    fontSize: 11,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all .12s",
    lineHeight: 1,
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 0,
        borderRadius: 12,
        overflow: "hidden",
        border: `1px solid ${C.glassBorder}`,
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          background: "rgba(255,255,255,.04)",
          borderBottom: `1px solid ${C.glassBorder}`,
          padding: "8px 10px",
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          alignItems: "center",
        }}
      >
        {toolbarGroups.map((group, gi) => (
          <div
            key={gi}
            style={{ display: "flex", gap: 3, alignItems: "center" }}
          >
            {gi > 0 && (
              <div
                style={{
                  width: 1,
                  height: 20,
                  background: C.glassBorder,
                  margin: "0 3px",
                }}
              />
            )}
            {group.map((btn, bi) => {
              const isActive = btn.cmd ? activeFormats[btn.cmd] : false;
              return (
                <button
                  key={bi}
                  title={btn.label}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    btn.cmd ? exec(btn.cmd) : btn.action();
                  }}
                  style={btnStyle(isActive)}
                >
                  <span
                    style={{
                      ...(btn.style || {}),
                      fontSize: btn.emoji ? 14 : 11,
                    }}
                  >
                    {btn.icon}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Editor area */}
      <div style={{ position: "relative" }}>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => {
            onChange(e.currentTarget.innerHTML);
            updateActiveFormats();
          }}
          onKeyUp={updateActiveFormats}
          onMouseUp={updateActiveFormats}
          style={{
            minHeight: 220,
            padding: "14px 16px",
            background: "rgba(255,255,255,.03)",
            color: C.text,
            fontSize: 14,
            lineHeight: 1.85,
            outline: "none",
            wordBreak: "break-word",
            fontFamily: FONTS.body,
          }}
        />
        {/* Placeholder */}
        {(!value || value === "<br>" || value === "") && (
          <div
            style={{
              position: "absolute",
              top: 14,
              left: 16,
              pointerEvents: "none",
              color: C.textDim,
              fontSize: 14,
              lineHeight: 1.85,
            }}
          >
            {placeholder}
          </div>
        )}
      </div>

      {/* Rich text CSS */}
      <style>{`
        [contenteditable] h1 { font-size: 20px; font-weight: 700; color: ${C.text}; margin: 8px 0 4px; }
        [contenteditable] h2 { font-size: 16px; font-weight: 700; color: ${C.text}; margin: 6px 0 4px; }
        [contenteditable] p { margin: 4px 0; }
        [contenteditable] ul { padding-left: 20px; margin: 6px 0; list-style: disc; }
        [contenteditable] ol { padding-left: 20px; margin: 6px 0; list-style: decimal; }
        [contenteditable] li { margin: 3px 0; color: ${C.textMid}; }
        [contenteditable] blockquote {
          border-left: 3px solid ${C.violet}; margin: 10px 0;
          padding: 6px 14px; background: rgba(124,58,237,.08);
          border-radius: 0 8px 8px 0; color: ${C.textMid}; font-style: italic;
        }
        [contenteditable] a { color: ${C.violetLight}; text-decoration: underline; }
        [contenteditable] img { max-width: 100%; border-radius: 10px; margin: 8px 0; display: block; }
        [contenteditable] strong { color: ${C.text}; }
        [contenteditable]:focus { outline: none; }
      `}</style>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageUpload}
      />
    </div>
  );
}

// ── strip HTML for preview ──
function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

// ── Glass card ──
const Glass = ({ children, style, ...rest }) => (
  <div
    style={{
      background: C.glass,
      border: `1px solid ${C.glassBorder}`,
      borderRadius: 16,
      ...style,
    }}
    {...rest}
  >
    {children}
  </div>
);

// ── Button ──
const Btn = ({ children, onClick, variant = "primary", small, disabled }) => {
  const styles = {
    primary: {
      background: `linear-gradient(135deg,${C.violet},${C.violetLight})`,
      color: "#fff",
      border: "none",
    },
    ghost: {
      background: "rgba(255,255,255,.06)",
      color: C.textMid,
      border: `1px solid ${C.glassBorder}`,
    },
    ai: {
      background: "rgba(124,58,237,.15)",
      color: C.violetLight,
      border: "1px solid rgba(124,58,237,.3)",
    },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[variant],
        padding: small ? "5px 12px" : "9px 18px",
        borderRadius: 10,
        fontSize: small ? 12 : 13,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "all .15s",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      {children}
    </button>
  );
};

// ── Modal ──
function Modal({ title, onClose, children }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,.65)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 700,
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#1a1827",
          borderRadius: 20,
          border: `1px solid ${C.glassBorder}`,
          padding: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h3
            style={{
              color: C.text,
              fontFamily: FONTS.display,
              fontSize: 17,
              fontWeight: 700,
              margin: 0,
            }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "rgba(255,255,255,.08)",
              border: "none",
              color: C.textMid,
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── View Modal ──
function ViewModal({ title, onClose, onEdit, onDelete, children }) {
  return (
    <Modal title={title} onClose={onClose}>
      {children}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 16,
          paddingTop: 16,
          borderTop: `1px solid ${C.glassBorder}`,
        }}
      >
        <Btn onClick={onEdit}>✏️ Edit</Btn>
        <Btn variant="ghost" onClick={onDelete}>
          🗑 Delete
        </Btn>
        <div style={{ flex: 1 }} />
        <Btn variant="ghost" onClick={onClose}>
          Close
        </Btn>
      </div>
    </Modal>
  );
}

// ── Confirm Modal ──
function Confirm({ message, onConfirm, onCancel }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <Glass style={{ padding: 28, maxWidth: 400, width: "100%" }}>
        <div style={{ fontSize: 14, color: C.textMid, marginBottom: 20 }}>
          {message}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={onConfirm}>Delete</Btn>
          <Btn variant="ghost" onClick={onCancel}>
            Cancel
          </Btn>
        </div>
      </Glass>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
export default function JournalPage() {
  const [entries, setEntries] = useState(SEED);
  const [activeMonth, setActiveMonth] = useState(CURRENT_MONTH);
  const [modal, setModal] = useState({ type: "" });
  const [form, setForm] = useState({
    title: "",
    content: "",
    mood: 3,
    date: today(),
  });
  const [saving, setSaving] = useState(false);
  const sf = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const monthList = useMemo(() => {
    const keys = new Set(entries.map((e) => e.date.slice(0, 7)));
    keys.add(CURRENT_MONTH);
    return [...keys].sort((a, b) => b.localeCompare(a));
  }, [entries]);

  const monthEntries = useMemo(
    () => entries.filter((e) => e.date.startsWith(activeMonth)),
    [entries, activeMonth],
  );
  const entryByDate = useMemo(() => {
    const m = {};
    monthEntries.forEach((e) => {
      m[e.date] = e;
    });
    return m;
  }, [monthEntries]);

  const days = daysInMonth(activeMonth);
  const startDow = dayOfWeek(activeMonth, 1);
  const isCurrentMonth = activeMonth === CURRENT_MONTH;

  const streak = useMemo(() => {
    const dates = new Set(entries.map((e) => e.date));
    let count = 0;
    const d = new Date();
    while (dates.has(d.toISOString().slice(0, 10))) {
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  }, [entries]);

  const avgMood = monthEntries.length
    ? (
        monthEntries.reduce((s, e) => s + e.mood, 0) / monthEntries.length
      ).toFixed(1)
    : "—";

  const openAdd = (date) => {
    const d = date ?? (isCurrentMonth ? today() : `${activeMonth}-01`);
    setForm({ title: "", content: "", mood: 3, date: d });
    setModal({ type: "add", date: d });
  };
  const openEdit = (e) => {
    setForm({
      title: e.title ?? "",
      content: e.content,
      mood: e.mood,
      date: e.date,
    });
    setModal({ type: "edit", data: e });
  };
  const openView = (e) => setModal({ type: "view", data: e });

  const handleSave = async () => {
    if (!form.content || form.content === "<br>") return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    if (modal.type === "add") {
      const entry = {
        ...form,
        id: uid(),
        userId: "u1",
        createdAt: new Date().toISOString(),
      };
      setEntries((p) => [entry, ...p]);
      setActiveMonth(entry.date.slice(0, 7));
    } else if (modal.type === "edit" && modal.data) {
      setEntries((p) =>
        p.map((e) => (e.id === modal.data.id ? { ...e, ...form } : e)),
      );
    }
    setSaving(false);
    setModal({ type: "" });
  };

  const handleDelete = async (id) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 300));
    setEntries((p) => p.filter((e) => e.id !== id));
    setSaving(false);
    setModal({ type: "" });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        padding: 20,
        fontFamily: FONTS.body,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <h2
          style={{
            fontFamily: FONTS.display,
            fontSize: 22,
            color: C.text,
            margin: 0,
          }}
        >
          Daily Journal
        </h2>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {streak > 0 && (
            <div
              style={{
                fontSize: 13,
                color: "#c4b5fd",
                background: "rgba(124,58,237,.15)",
                padding: "6px 14px",
                borderRadius: 20,
                border: "1px solid rgba(124,58,237,.3)",
              }}
            >
              🔥 {streak} day streak
            </div>
          )}
          <Btn onClick={() => openAdd()}>+ Write Today</Btn>
        </div>
      </div>

      {/* Month navigator */}
      <Glass style={{ padding: "12px 16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <button
            onClick={() => setActiveMonth(prevMonth(activeMonth))}
            disabled={activeMonth === monthList[monthList.length - 1]}
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "rgba(255,255,255,.05)",
              border: `1px solid ${C.glassBorder}`,
              color: C.textMid,
              cursor: "pointer",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity:
                activeMonth === monthList[monthList.length - 1] ? 0.4 : 1,
            }}
          >
            ◀
          </button>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                fontFamily: FONTS.display,
                fontSize: 17,
                color: C.text,
                fontWeight: 700,
              }}
            >
              {monthLabel(activeMonth)}
              {isCurrentMonth && (
                <span
                  style={{
                    fontSize: 11,
                    color: "#c4b5fd",
                    marginLeft: 8,
                    background: "rgba(124,58,237,.15)",
                    border: "1px solid rgba(124,58,237,.3)",
                    padding: "2px 8px",
                    borderRadius: 20,
                  }}
                >
                  Current
                </span>
              )}
            </div>
            <div
              style={{
                display: "flex",
                gap: 6,
                overflowX: "auto",
                maxWidth: "100%",
                paddingBottom: 2,
              }}
            >
              {monthList.map((mk) => (
                <button
                  key={mk}
                  onClick={() => setActiveMonth(mk)}
                  style={{
                    flexShrink: 0,
                    padding: "4px 12px",
                    borderRadius: 20,
                    fontSize: 11,
                    cursor: "pointer",
                    background:
                      activeMonth === mk ? C.violet : "rgba(255,255,255,.05)",
                    border:
                      activeMonth === mk
                        ? "none"
                        : `1px solid ${C.glassBorder}`,
                    color: activeMonth === mk ? "#fff" : C.textMid,
                    transition: "all .15s",
                    fontWeight: activeMonth === mk ? 600 : 400,
                  }}
                >
                  {new Date(`${mk}-01`).toLocaleDateString("en-IN", {
                    month: "short",
                    year: "2-digit",
                  })}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveMonth(nextMonth(activeMonth))}
            disabled={activeMonth === CURRENT_MONTH}
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "rgba(255,255,255,.05)",
              border: `1px solid ${C.glassBorder}`,
              color: C.textMid,
              cursor: "pointer",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: activeMonth === CURRENT_MONTH ? 0.4 : 1,
            }}
          >
            ▶
          </button>
        </div>
      </Glass>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 12,
        }}
      >
        {[
          { l: "Entries", v: String(monthEntries.length), c: C.violet },
          {
            l: "Avg Mood",
            v: `${MOODS[Math.round(+avgMood) || 3]} ${avgMood}`,
            c: C.yellow,
          },
          {
            l: "Days written",
            v: `${monthEntries.length} / ${days}`,
            c: C.blue,
          },
        ].map((s, i) => (
          <Glass key={i} style={{ padding: 14, textAlign: "center" }}>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: s.c,
                fontFamily: FONTS.display,
              }}
            >
              {s.v}
            </div>
            <div style={{ fontSize: 11, color: C.textDim, marginTop: 3 }}>
              {s.l}
            </div>
          </Glass>
        ))}
      </div>

      {/* Calendar */}
      <Glass style={{ padding: 18 }}>
        <div
          style={{
            fontSize: 12,
            color: C.textDim,
            marginBottom: 12,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          {monthLabel(activeMonth)}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7,1fr)",
            gap: 4,
            marginBottom: 6,
          }}
        >
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
                fontSize: 10,
                color: C.textDim,
                fontWeight: 600,
              }}
            >
              {d}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7,1fr)",
            gap: 4,
          }}
        >
          {Array.from({ length: startDow }).map((_, i) => (
            <div key={`e${i}`} />
          ))}
          {Array.from({ length: days }, (_, i) => {
            const day = i + 1;
            const dateStr = `${activeMonth}-${String(day).padStart(2, "0")}`;
            const entry = entryByDate[dateStr];
            const isToday = isCurrentMonth && day === CURRENT_DAY;
            const isFuture = isCurrentMonth && day > CURRENT_DAY;
            return (
              <div
                key={day}
                onClick={() =>
                  !isFuture && (entry ? openView(entry) : openAdd(dateStr))
                }
                style={{
                  height: 44,
                  borderRadius: 10,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  cursor: isFuture ? "default" : "pointer",
                  background: isToday
                    ? `linear-gradient(135deg,${C.violet},${C.violetLight})`
                    : entry
                      ? `${MOOD_CLR[entry.mood]}18`
                      : "rgba(255,255,255,.02)",
                  border: isToday
                    ? "none"
                    : entry
                      ? `1px solid ${MOOD_CLR[entry.mood]}40`
                      : `1px solid ${C.glassBorder}`,
                  opacity: isFuture ? 0.3 : 1,
                  transition: "all .15s",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: isToday ? "#fff" : C.textMid,
                    fontWeight: isToday ? 700 : 400,
                  }}
                >
                  {day}
                </span>
                {entry && (
                  <span style={{ fontSize: 13 }}>{MOODS[entry.mood]}</span>
                )}
                {!entry && !isFuture && !isToday && (
                  <span style={{ fontSize: 8, color: C.textDim }}>+</span>
                )}
              </div>
            );
          })}
        </div>
      </Glass>

      {/* AI helpers */}
      <Glass
        style={{
          padding: 14,
          background: "rgba(124,58,237,.1)",
          border: "1px solid rgba(124,58,237,.25)",
        }}
      >
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 18 }}>⟡</span>
          <div style={{ flex: 1, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              "Summarize this week",
              "Find mood patterns",
              "What made me happy?",
              "Suggest reflection prompt",
            ].map((t, i) => (
              <Btn key={i} variant="ai" small>
                {t}
              </Btn>
            ))}
          </div>
        </div>
      </Glass>

      {/* Entry list */}
      {monthEntries.length === 0 ? (
        <Glass style={{ padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>✦</div>
          <div style={{ color: C.textDim, fontSize: 13 }}>
            No entries in {monthLabel(activeMonth)} yet.
          </div>
          {!activeMonth.localeCompare(CURRENT_MONTH) && (
            <div style={{ marginTop: 14 }}>
              <Btn onClick={() => openAdd()}>+ Write Today</Btn>
            </div>
          )}
        </Glass>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 12, color: C.textDim, marginBottom: 2 }}>
            {monthEntries.length} entr{monthEntries.length === 1 ? "y" : "ies"}{" "}
            in {monthLabel(activeMonth)}
          </div>
          {[...monthEntries]
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((e) => (
              <Glass
                key={e.id}
                onClick={() => openView(e)}
                style={{
                  padding: 16,
                  cursor: "pointer",
                  transition: "all .2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: MOOD_CLR[e.mood] + "18",
                      border: `1px solid ${MOOD_CLR[e.mood]}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                      flexShrink: 0,
                    }}
                  >
                    {MOODS[e.mood]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{ fontSize: 13, color: C.text, fontWeight: 600 }}
                      >
                        {e.title || fmtDate(e.date)}
                      </span>
                      <span style={{ fontSize: 11, color: C.textDim }}>
                        {fmtDate(e.date)}
                      </span>
                    </div>
                    <div
                      style={{ fontSize: 11, color: C.textDim, marginTop: 3 }}
                    >
                      <span style={{ color: MOOD_CLR[e.mood] }}>
                        {MOOD_LBL[e.mood]}
                      </span>
                      {" · "}
                      {stripHtml(e.content).slice(0, 70)}...
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                    <button
                      onClick={(ev) => {
                        ev.stopPropagation();
                        openEdit(e);
                      }}
                      style={{
                        padding: "4px 8px",
                        borderRadius: 7,
                        background: "rgba(255,255,255,.05)",
                        border: "none",
                        color: C.textMid,
                        cursor: "pointer",
                        fontSize: 12,
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(ev) => {
                        ev.stopPropagation();
                        setModal({ type: "confirm", data: e });
                      }}
                      style={{
                        padding: "4px 8px",
                        borderRadius: 7,
                        background: "rgba(239,68,68,.08)",
                        border: "none",
                        color: C.red,
                        cursor: "pointer",
                        fontSize: 12,
                      }}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </Glass>
            ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {(modal.type === "add" || modal.type === "edit") && (
        <Modal
          title={modal.type === "add" ? "New Journal Entry" : "Edit Entry"}
          onClose={() => setModal({ type: "" })}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Date */}
            <div>
              <label
                style={{
                  fontSize: 12,
                  color: C.textMid,
                  fontWeight: 500,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => sf("date", e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,.06)",
                  border: `1px solid ${C.glassBorder}`,
                  color: C.text,
                  fontSize: 13,
                  outline: "none",
                }}
              />
            </div>

            {/* Mood */}
            <div>
              <label
                style={{
                  fontSize: 12,
                  color: C.textMid,
                  fontWeight: 500,
                  display: "block",
                  marginBottom: 8,
                }}
              >
                How are you feeling?
              </label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {MOODS.map((m, i) => (
                  <button
                    key={i}
                    onClick={() => sf("mood", i)}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      fontSize: 22,
                      border:
                        form.mood === i
                          ? `2px solid ${C.violet}`
                          : `1px solid ${C.glassBorder}`,
                      background:
                        form.mood === i
                          ? `${MOOD_CLR[i]}22`
                          : "rgba(255,255,255,.04)",
                      cursor: "pointer",
                      transform: form.mood === i ? "scale(1.15)" : "scale(1)",
                      transition: "all .15s",
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: MOOD_CLR[form.mood],
                  marginTop: 6,
                  fontWeight: 500,
                }}
              >
                {MOOD_LBL[form.mood]}
              </div>
            </div>

            {/* Title */}
            <div>
              <label
                style={{
                  fontSize: 12,
                  color: C.textMid,
                  fontWeight: 500,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Title (optional)
              </label>
              <input
                value={form.title ?? ""}
                onChange={(e) => sf("title", e.target.value)}
                placeholder="Give this entry a title..."
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,.06)",
                  border: `1px solid ${C.glassBorder}`,
                  color: C.text,
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Rich Text Editor */}
            <div>
              <label
                style={{
                  fontSize: 12,
                  color: C.textMid,
                  fontWeight: 500,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                What's on your mind?
                <span
                  style={{
                    fontSize: 10,
                    color: C.textDim,
                    marginLeft: 8,
                    fontWeight: 400,
                  }}
                >
                  Bold · Italic · Headings · Lists · Images supported
                </span>
              </label>
              <RichTextEditor
                value={form.content}
                onChange={(v) => sf("content", v)}
                placeholder="Write freely — thoughts, feelings, what happened today..."
              />
            </div>

            {form.date && !form.date.startsWith(activeMonth) && (
              <div
                style={{
                  fontSize: 11,
                  color: C.yellow,
                  background: "rgba(245,158,11,.08)",
                  border: "1px solid rgba(245,158,11,.2)",
                  padding: "8px 12px",
                  borderRadius: 8,
                }}
              >
                ⚠ This entry will appear in {monthLabel(form.date.slice(0, 7))}.
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleSave}
                disabled={!form.content || form.content === "<br>" || saving}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 22px",
                  borderRadius: 10,
                  background:
                    saving || !form.content
                      ? `rgba(124,58,237,.4)`
                      : `linear-gradient(135deg,${C.violet},${C.violetLight})`,
                  border: "none",
                  color: "#fff",
                  cursor: saving || !form.content ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                {saving
                  ? "Saving…"
                  : modal.type === "add"
                    ? "Save Entry"
                    : "Update Entry"}
              </button>
              <Btn variant="ghost" onClick={() => setModal({ type: "" })}>
                Cancel
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* View Modal */}
      {modal.type === "view" && modal.data && (
        <ViewModal
          title={modal.data.title || fmtDate(modal.data.date)}
          onClose={() => setModal({ type: "" })}
          onEdit={() => openEdit(modal.data)}
          onDelete={() => setModal({ type: "confirm", data: modal.data })}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: MOOD_CLR[modal.data.mood] + "18",
                border: `1px solid ${MOOD_CLR[modal.data.mood]}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
              }}
            >
              {MOODS[modal.data.mood]}
            </div>
            <div>
              <div style={{ fontSize: 15, color: C.text, fontWeight: 600 }}>
                {MOOD_LBL[modal.data.mood]}
              </div>
              <div style={{ fontSize: 12, color: C.textDim, marginTop: 2 }}>
                {fmtDate(modal.data.date)}
              </div>
            </div>
          </div>
          <div
            style={{ fontSize: 14, color: C.textMid, lineHeight: 1.9 }}
            dangerouslySetInnerHTML={{ __html: modal.data.content }}
          />
          <style>{`
            .view-content h1 { font-size:20px;font-weight:700;color:${C.text};margin:8px 0 4px; }
            .view-content h2 { font-size:16px;font-weight:700;color:${C.text};margin:6px 0 4px; }
            .view-content ul { padding-left:20px;list-style:disc;margin:6px 0; }
            .view-content ol { padding-left:20px;list-style:decimal;margin:6px 0; }
            .view-content li { margin:3px 0;color:${C.textMid}; }
            .view-content blockquote { border-left:3px solid ${C.violet};margin:10px 0;padding:6px 14px;background:rgba(124,58,237,.08);border-radius:0 8px 8px 0;color:${C.textMid};font-style:italic; }
            .view-content a { color:${C.violetLight};text-decoration:underline; }
            .view-content img { max-width:100%;border-radius:10px;margin:8px 0;display:block; }
            .view-content strong { color:${C.text}; }
          `}</style>
          <div style={{ marginTop: 16 }}>
            <Btn variant="ai">⟡ AI Insights on this entry</Btn>
          </div>
        </ViewModal>
      )}

      {/* Delete confirm */}
      {modal.type === "confirm" && modal.data && (
        <Confirm
          message={`Delete "${modal.data.title || fmtDate(modal.data.date)}"? This cannot be undone.`}
          onConfirm={() => handleDelete(modal.data.id)}
          onCancel={() => setModal({ type: "" })}
        />
      )}
    </div>
  );
}
