import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  ArrowLeft,
  CalendarDays,
  Search,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  Flame,
  PenLine,
  Clock,
  ChevronRight,
  Sparkles,
  Menu,
  Hash,
  Smile,
  Lock,
  LockKeyholeOpen,
  Shield,
} from "lucide-react";
import { useLock } from "../context/LockContext";

import journalApi from "../api/journal.api";
import {
  setJournals,
  appendJournals,
  addJournal,
  updateJournal,
  removeJournal,
  setCurrentJournal,
  setLoading,
  setSaving,
  setDeleting,
  setSkip,
  setHasMore,
} from "../store/features/journalSlice";

/* ═══════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════ */
const PAGE_LIMIT = 15;

const MOODS = [
  {
    id: "happy",
    emoji: "😊",
    label: "Happy",
    accent: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
  },
  {
    id: "calm",
    emoji: "🌿",
    label: "Calm",
    accent: "#10b981",
    bg: "rgba(16,185,129,0.1)",
  },
  {
    id: "sad",
    emoji: "😔",
    label: "Sad",
    accent: "#3b82f6",
    bg: "rgba(59,130,246,0.1)",
  },
  {
    id: "excited",
    emoji: "⚡",
    label: "Excited",
    accent: "#f97316",
    bg: "rgba(249,115,22,0.1)",
  },
  {
    id: "grateful",
    emoji: "🙏",
    label: "Grateful",
    accent: "#8b5cf6",
    bg: "rgba(139,92,246,0.1)",
  },
  {
    id: "reflective",
    emoji: "🤔",
    label: "Reflective",
    accent: "#ec4899",
    bg: "rgba(236,72,153,0.1)",
  },
  {
    id: "tired",
    emoji: "😴",
    label: "Tired",
    accent: "#6b7280",
    bg: "rgba(107,114,128,0.1)",
  },
  {
    id: "anxious",
    emoji: "😰",
    label: "Anxious",
    accent: "#dc2626",
    bg: "rgba(220,38,38,0.1)",
  },
];

const PROMPTS = [
  "What made you smile today? ✨",
  "What are you truly grateful for right now? 🙏",
  "Describe a moment that felt meaningful today…",
  "What's been on your mind lately?",
  "What challenge did you face — and how did you handle it?",
  "What do you want to remember about today?",
  "How are you really feeling, right now?",
  "What would you tell your past self today? 📮",
  "What small win deserves celebrating today?",
  "What's one thing you learned or discovered? 📚",
  "Who or what brought you energy today?",
  "If today had a title, what would it be?",
];

/* ═══════════════════════════════════════
   HELPERS
═══════════════════════════════════════ */
const wordCount = (t = "") => t.trim().split(/\s+/).filter(Boolean).length;
const readTime = (t = "") => Math.max(1, Math.ceil(wordCount(t) / 200));
const truncate = (t = "", n = 150) => (t.length > n ? t.slice(0, n) + "…" : t);

const formatFull = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatShort = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const ms = now - d;
  if (ms < 60000) return "Just now";
  if (ms < 3600000) return `${Math.floor(ms / 60000)}m ago`;
  if (ms < 86400000)
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  if (ms < 172800000) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const groupByDate = (list) => {
  const groups = new Map();
  const now = new Date();
  const sod = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const todayMs = sod(now);
  const yesterdayMs = todayMs - 86400000;
  const weekMs = todayMs - now.getDay() * 86400000;
  const monthMs = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  list.forEach((j) => {
    const d = new Date(j.createdAt);
    const dMs = sod(d);
    let g;
    if (dMs >= todayMs) g = "Today";
    else if (dMs >= yesterdayMs) g = "Yesterday";
    else if (dMs >= weekMs) g = "This Week";
    else if (dMs >= monthMs) g = "This Month";
    else g = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(j);
  });
  return groups;
};

const calcStreak = (journals) => {
  if (!journals.length) return 0;
  const days = [
    ...new Set(journals.map((j) => new Date(j.createdAt).toDateString())),
  ].sort((a, b) => new Date(b) - new Date(a));
  const todayStr = new Date().toDateString();
  const yesterdayStr = new Date(Date.now() - 86400000).toDateString();
  if (days[0] !== todayStr && days[0] !== yesterdayStr) return 0;
  let streak = 0;
  for (let i = 0; i < days.length; i++) {
    if (days[i] === new Date(Date.now() - i * 86400000).toDateString())
      streak++;
    else break;
  }
  return streak;
};

/* ─── LocalStorage mood meta ─── */
const META_KEY = "lifesync_jmeta";
const getAllMeta = () => {
  try {
    return JSON.parse(localStorage.getItem(META_KEY) || "{}");
  } catch {
    return {};
  }
};
const getEntryMeta = (id) => getAllMeta()[id] ?? null;
const saveEntryMeta = (id, data) => {
  localStorage.setItem(
    META_KEY,
    JSON.stringify({ ...getAllMeta(), [id]: data }),
  );
};
const getMoodObj = (id) => {
  const meta = getEntryMeta(id);
  return meta?.mood ? (MOODS.find((m) => m.id === meta.mood) ?? null) : null;
};

/* ═══════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════ */

/* ── Toast ── */
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3400);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div
      className={`jnl-toast jnl-toast--${type}`}
      role="alert"
      aria-live="polite"
    >
      {type === "success" ? (
        <CheckCircle size={15} />
      ) : (
        <AlertCircle size={15} />
      )}
      <span>{message}</span>
      <button
        type="button"
        className="jnl-toast__x"
        onClick={onClose}
        aria-label="Dismiss"
      >
        <X size={13} />
      </button>
    </div>
  );
};

/* ── Confirm Delete Dialog ── */
const ConfirmDelete = ({ entry, onConfirm, onCancel, loading }) => (
  <div
    className="jnl-overlay"
    role="dialog"
    aria-modal="true"
    aria-label="Confirm delete"
  >
    <div className="jnl-dialog" onClick={(e) => e.stopPropagation()}>
      <div className="jnl-dialog__icon">
        <Trash2 size={22} />
      </div>
      <h3 className="jnl-dialog__title">Delete Entry?</h3>
      <p className="jnl-dialog__msg">
        <em>"{entry?.title}"</em> will be permanently removed. This cannot be
        undone.
      </p>
      <div className="jnl-dialog__btns">
        <button
          className="jnl-btn jnl-btn--ghost"
          onClick={onCancel}
          disabled={loading}
        >
          <X size={14} /> Cancel
        </button>
        <button
          className="jnl-btn jnl-btn--danger"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? (
            <Loader2 size={14} className="jnl-spin" />
          ) : (
            <Trash2 size={14} />
          )}
          {loading ? "Deleting…" : "Yes, Delete"}
        </button>
      </div>
    </div>
  </div>
);

/* ── Mood Picker ── */
const MoodPicker = ({ value, onChange }) => (
  <div className="jnl-moodpicker" role="group" aria-label="Select your mood">
    {MOODS.map((m) => (
      <button
        key={m.id}
        type="button"
        title={m.label}
        aria-pressed={value === m.id}
        className={`jnl-moodpicker__btn ${value === m.id ? "active" : ""}`}
        style={
          value === m.id
            ? { background: m.bg, borderColor: m.accent, color: m.accent }
            : {}
        }
        onClick={() => onChange(value === m.id ? null : m.id)}
      >
        <span className="jnl-moodpicker__emoji">{m.emoji}</span>
        <span className="jnl-moodpicker__label">{m.label}</span>
      </button>
    ))}
  </div>
);

/* ── Entry Card ── */
const EntryCard = ({ journal, onRead, onEdit, onDelete }) => {
  const id = journal._id || journal.id;
  const mood = getMoodObj(id);

  return (
    <article
      className="jnl-card"
      role="button"
      tabIndex={0}
      aria-label={`Journal entry: ${journal.title}`}
      onClick={() => onRead(journal)}
      onKeyDown={(e) => e.key === "Enter" && onRead(journal)}
      style={mood ? { "--jcard-accent": mood.accent } : {}}
    >
      {/* Left: mood badge + time */}
      <div className="jnl-card__left">
        <div
          className="jnl-card__mood-badge"
          style={
            mood
              ? { background: mood.bg, borderColor: mood.accent + "55" }
              : {
                  background: "rgba(136,69,232,0.08)",
                  borderColor: "rgba(136,69,232,0.15)",
                }
          }
          aria-hidden="true"
        >
          {mood ? (
            mood.emoji
          ) : (
            <BookOpen size={16} style={{ color: "#8845e8" }} />
          )}
        </div>
        <span className="jnl-card__time">{formatShort(journal.createdAt)}</span>
      </div>

      {/* Body */}
      <div className="jnl-card__body">
        <h3 className="jnl-card__title">{journal.title}</h3>
        <p className="jnl-card__preview">{truncate(journal.content)}</p>
        <div className="jnl-card__meta">
          <span>
            <FileText size={11} />
            {wordCount(journal.content)} words
          </span>
          <span>
            <Clock size={11} />
            {readTime(journal.content)} min
          </span>
          {mood && (
            <span className="jnl-card__mood-tag" style={{ color: mood.accent }}>
              {mood.emoji} {mood.label}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="jnl-card__actions" onClick={(e) => e.stopPropagation()}>
        <button
          className="jnl-icon-btn"
          title="Edit entry"
          onClick={() => onEdit(journal)}
          aria-label="Edit entry"
        >
          <Pencil size={14} />
        </button>
        <button
          className="jnl-icon-btn jnl-icon-btn--del"
          title="Delete entry"
          onClick={() => onDelete(journal)}
          aria-label="Delete entry"
        >
          <Trash2 size={14} />
        </button>
        <ChevronRight
          size={16}
          className="jnl-card__chevron"
          aria-hidden="true"
        />
      </div>
    </article>
  );
};

/* ── Timeline View ── */
const TimelineView = ({
  journals,
  loading,
  hasMore,
  search,
  onRead,
  onEdit,
  onDelete,
  onLoadMore,
}) => {
  const filtered = useMemo(() => {
    if (!search.trim()) return journals;
    const q = search.toLowerCase();
    return journals.filter(
      (j) =>
        j.title?.toLowerCase().includes(q) ||
        j.content?.toLowerCase().includes(q),
    );
  }, [journals, search]);

  const groups = useMemo(() => groupByDate(filtered), [filtered]);

  if (loading && journals.length === 0) {
    return (
      <div className="jnl-timeline">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="jnl-skeleton"
            style={{ animationDelay: `${i * 0.08}s` }}
          />
        ))}
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="jnl-empty" aria-label="No entries">
        <div className="jnl-empty__art" aria-hidden="true">
          {search ? (
            <Search size={62} strokeWidth={1.2} />
          ) : (
            <BookOpen size={72} strokeWidth={1.1} />
          )}
        </div>
        <strong className="jnl-empty__h">
          {search ? `No results for "${search}"` : "Your journal is empty"}
        </strong>
        <p className="jnl-empty__p">
          {search
            ? "Try different keywords or clear the search."
            : "Start capturing your thoughts, feelings, and moments — privately and beautifully."}
        </p>
        {search && (
          <button className="jnl-btn jnl-btn--ghost" onClick={() => {}}>
            Clear search
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="jnl-timeline">
      {[...groups.entries()].map(([label, items]) => (
        <section key={label} className="jnl-group">
          <div
            className="jnl-group__label"
            aria-label={`Entries from ${label}`}
          >
            <span>{label}</span>
            <span className="jnl-group__count">{items.length}</span>
          </div>
          <div className="jnl-group__cards">
            {items.map((j) => (
              <EntryCard
                key={j._id || j.id}
                journal={j}
                onRead={onRead}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </section>
      ))}

      {hasMore && !search && (
        <div className="jnl-loadmore">
          <button
            className="jnl-btn jnl-btn--outline"
            onClick={onLoadMore}
            disabled={loading}
          >
            {loading && <Loader2 size={14} className="jnl-spin" />}
            {loading ? "Loading…" : "Load older entries"}
          </button>
        </div>
      )}
    </div>
  );
};

/* ── Editor View ── */
const EditorView = ({ initial, onSave, onBack, saving }) => {
  const isEdit = Boolean(initial?._id || initial?.id);
  const id = initial?._id || initial?.id;
  const initMeta = id ? (getEntryMeta(id) ?? {}) : {};
  const promptIdx = useRef(Math.floor(Math.random() * PROMPTS.length));

  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [mood, setMood] = useState(initMeta.mood ?? null);
  const [dirty, setDirty] = useState(false);

  const titleRef = useRef(null);
  const textareaRef = useRef(null);

  /* Focus title on mount, auto-grow textarea */
  useEffect(() => {
    titleRef.current?.focus();
    const ta = textareaRef.current;
    if (ta && initial?.content) {
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    }
  }, []);

  const autoGrow = () => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    }
  };

  const wc = wordCount(content);
  const rt = readTime(content);
  const tLeft = 120 - title.length;
  const valid = title.trim().length > 0 && content.trim().length > 0;

  const handleSave = useCallback(() => {
    if (!valid || saving) return;
    // Store mood meta locally
    const entryId = id ?? "pending";
    if (mood) saveEntryMeta(entryId, { mood });
    onSave({ title: title.trim(), content: content.trim(), mood });
  }, [title, content, mood, valid, saving, id, onSave]);

  /* Cmd/Ctrl + S shortcut */
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleSave]);

  return (
    <div className="jnl-editor">
      {/* Top bar */}
      <div className="jnl-editor__bar">
        <button
          className="jnl-btn jnl-btn--ghost jnl-btn--sm"
          onClick={onBack}
          disabled={saving}
        >
          <ArrowLeft size={15} /> Back
        </button>

        <div className="jnl-editor__stats">
          {wc > 0 && (
            <>
              <span>
                <Hash size={11} />
                {wc} words
              </span>
              <span>
                <Clock size={11} />
                {rt} min read
              </span>
            </>
          )}
          {dirty && !saving && (
            <span className="jnl-editor__unsaved">● Unsaved</span>
          )}
          {saving && (
            <span className="jnl-editor__saving">
              <Loader2 size={12} className="jnl-spin" /> Saving…
            </span>
          )}
        </div>

        <button
          className="jnl-btn jnl-btn--primary jnl-btn--sm"
          onClick={handleSave}
          disabled={!valid || saving}
        >
          {saving ? (
            <Loader2 size={14} className="jnl-spin" />
          ) : (
            <Save size={14} />
          )}
          {isEdit ? "Update" : "Save Entry"}
        </button>
      </div>

      {/* Date stamp */}
      <div className="jnl-editor__datestamp">
        <CalendarDays size={13} />
        {formatFull(initial?.createdAt || new Date().toISOString())}
      </div>

      {/* Title */}
      <div className="jnl-editor__title-wrap">
        <input
          ref={titleRef}
          className="jnl-editor__title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value.slice(0, 120));
            setDirty(true);
          }}
          placeholder="Give your entry a title…"
          maxLength={120}
          aria-label="Entry title"
        />
        {title.length > 90 && (
          <span
            className="jnl-editor__tleft"
            style={{ color: tLeft < 10 ? "#ef4444" : undefined }}
          >
            {tLeft} left
          </span>
        )}
      </div>

      {/* Mood row */}
      <div className="jnl-editor__mood-row">
        <span className="jnl-editor__mood-label">
          <Smile size={14} /> How are you feeling?
        </span>
        <MoodPicker value={mood} onChange={setMood} />
      </div>

      {/* Divider */}
      <div className="jnl-editor__rule" />

      {/* Writing prompt hint */}
      {!content && (
        <div className="jnl-editor__prompt">
          <Sparkles size={13} />
          {PROMPTS[promptIdx.current]}
        </div>
      )}

      {/* Content */}
      <textarea
        ref={textareaRef}
        className="jnl-editor__body"
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setDirty(true);
          autoGrow();
        }}
        placeholder="Start writing freely…"
        aria-label="Entry content"
        rows={14}
      />

      {/* Keyboard hint */}
      <div className="jnl-editor__hint">
        Press <kbd>⌘ S</kbd> to save quickly
      </div>
    </div>
  );
};

/* ── Reader View ── */
const ReaderView = ({ journal, onEdit, onDelete, onBack }) => {
  const id = journal._id || journal.id;
  const mood = getMoodObj(id);
  const wc = wordCount(journal.content);
  const rt = readTime(journal.content);

  return (
    <div className="jnl-reader">
      {/* Top bar */}
      <div className="jnl-reader__bar">
        <button className="jnl-btn jnl-btn--ghost jnl-btn--sm" onClick={onBack}>
          <ArrowLeft size={15} /> All Entries
        </button>
        <div className="jnl-reader__actions">
          <button
            className="jnl-btn jnl-btn--outline jnl-btn--sm"
            onClick={() => onEdit(journal)}
          >
            <Pencil size={14} /> Edit
          </button>
          <button
            className="jnl-btn jnl-btn--danger jnl-btn--sm"
            onClick={() => onDelete(journal)}
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      {/* Meta row */}
      <div className="jnl-reader__meta">
        {mood && (
          <span
            className="jnl-reader__mood-pill"
            style={{
              background: mood.bg,
              borderColor: mood.accent + "55",
              color: mood.accent,
            }}
          >
            {mood.emoji} {mood.label}
          </span>
        )}
        <span>
          <CalendarDays size={12} /> {formatFull(journal.createdAt)}
        </span>
        <span>
          <FileText size={12} /> {wc} words · {rt} min read
        </span>
      </div>

      {/* Title */}
      <h1 className="jnl-reader__title">{journal.title}</h1>

      {/* Accent rule */}
      <div
        className="jnl-reader__rule"
        style={
          mood
            ? {
                background: `linear-gradient(90deg, ${mood.accent}88, transparent)`,
              }
            : {}
        }
      />

      {/* Content */}
      <div className="jnl-reader__body">
        <span className="jnl-reader__openquote" aria-hidden="true">
          "
        </span>
        <div className="jnl-reader__text">{journal.content}</div>
      </div>

      {/* Footer */}
      {journal.updatedAt && journal.updatedAt !== journal.createdAt && (
        <div className="jnl-reader__edited">
          Last edited {formatShort(journal.updatedAt)}
        </div>
      )}
    </div>
  );
};

/* ── Sidebar Panel ── */
const SidebarPanel = ({
  journals,
  onNew,
  moodFilter,
  onMoodFilter,
  search,
  onSearch,
}) => {
  const {
    isLockEnabled,
    hasPasscode,
    lockApp,
    setShowSettingsModal,
    setShowSetupModal,
  } = useLock();
  const streak = useMemo(() => calcStreak(journals), [journals]);
  const totalWords = useMemo(
    () => journals.reduce((s, j) => s + wordCount(j.content), 0),
    [journals],
  );
  const thisMonthCount = useMemo(() => {
    const m = new Date().getMonth();
    return journals.filter((j) => new Date(j.createdAt).getMonth() === m)
      .length;
  }, [journals]);

  return (
    <aside className="jnl-sidebar" aria-label="Journal sidebar">
      {/* Brand */}
      <div className="jnl-sidebar__brand">
        <div className="jnl-sidebar__brand-icon" aria-hidden="true">
          <BookOpen size={21} />
        </div>
        <div>
          <h2 className="jnl-sidebar__title">Journal</h2>
          <p className="jnl-sidebar__count">
            {journals.length} {journals.length === 1 ? "entry" : "entries"}
          </p>
        </div>
      </div>

      {/* New Entry CTA */}
      <button className="jnl-btn jnl-btn--primary jnl-new-btn" onClick={onNew}>
        <Plus size={16} /> New Entry
      </button>

      {/* Search */}
      <div className="jnl-sidebar__search">
        <Search size={13} />
        <input
          type="search"
          placeholder="Search entries…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          aria-label="Search journal entries"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearch("")}
            aria-label="Clear search"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Overview stats */}
      <div className="jnl-sidebar__section">
        <span className="jnl-sidebar__section-label">Overview</span>
        <div className="jnl-stats-grid">
          <div
            className="jnl-stat-tile"
            style={{
              "--tile-color": "#ef6c00",
              "--tile-bg": "rgba(249,115,22,0.08)",
            }}
          >
            <Flame size={18} className="jnl-stat-tile__icon" />
            <strong className="jnl-stat-tile__val">{streak}</strong>
            <span className="jnl-stat-tile__label">
              {streak === 1 ? "day" : "days"} streak
            </span>
          </div>
          <div
            className="jnl-stat-tile"
            style={{
              "--tile-color": "#10b981",
              "--tile-bg": "rgba(16,185,129,0.08)",
            }}
          >
            <PenLine size={18} className="jnl-stat-tile__icon" />
            <strong className="jnl-stat-tile__val">
              {totalWords >= 1000
                ? `${(totalWords / 1000).toFixed(1)}k`
                : totalWords}
            </strong>
            <span className="jnl-stat-tile__label">words written</span>
          </div>
          <div
            className="jnl-stat-tile"
            style={{
              "--tile-color": "#8845e8",
              "--tile-bg": "rgba(136,69,232,0.08)",
            }}
          >
            <CalendarDays size={18} className="jnl-stat-tile__icon" />
            <strong className="jnl-stat-tile__val">{thisMonthCount}</strong>
            <span className="jnl-stat-tile__label">this month</span>
          </div>
          <div
            className="jnl-stat-tile"
            style={{
              "--tile-color": "#3b82f6",
              "--tile-bg": "rgba(59,130,246,0.08)",
            }}
          >
            <FileText size={18} className="jnl-stat-tile__icon" />
            <strong className="jnl-stat-tile__val">{journals.length}</strong>
            <span className="jnl-stat-tile__label">total entries</span>
          </div>
        </div>
      </div>

      {/* Mood filter */}
      <div className="jnl-sidebar__section">
        <span className="jnl-sidebar__section-label">
          Filter by Mood
          {moodFilter && (
            <button
              className="jnl-sidebar__clear"
              onClick={() => onMoodFilter(null)}
              type="button"
            >
              clear
            </button>
          )}
        </span>
        <div className="jnl-mood-filter">
          {MOODS.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`jnl-mf-btn ${moodFilter === m.id ? "active" : ""}`}
              style={
                moodFilter === m.id
                  ? { background: m.bg, borderColor: m.accent, color: m.accent }
                  : {}
              }
              onClick={() => onMoodFilter(moodFilter === m.id ? null : m.id)}
              title={m.label}
              aria-pressed={moodFilter === m.id}
            >
              {m.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Apple Journal Lock Control */}
      <div className="jnl-sidebar__section">
        <span className="jnl-sidebar__section-label">Privacy & Lock</span>
        <div className="jnl-lock-box">
          <div className="jnl-lock-box__info">
            <div className="jnl-lock-box__icon">
              {isLockEnabled ? (
                <Lock size={15} />
              ) : (
                <LockKeyholeOpen size={15} />
              )}
            </div>
            <div>
              <span className="jnl-lock-box__title">
                {isLockEnabled ? "Journal Protected" : "App Lock Off"}
              </span>
              <span className="jnl-lock-box__sub">
                {hasPasscode
                  ? isLockEnabled
                    ? "Passcode required"
                    : "Passcode configured"
                  : "No passcode set"}
              </span>
            </div>
          </div>
          <div className="jnl-lock-box__btns">
            {isLockEnabled && (
              <button
                type="button"
                className="jnl-btn jnl-btn--outline jnl-btn--sm"
                onClick={lockApp}
                title="Lock Journal now"
              >
                <Lock size={13} /> Lock
              </button>
            )}
            <button
              type="button"
              className="jnl-btn jnl-btn--ghost jnl-btn--sm"
              onClick={() => {
                if (!hasPasscode) setShowSetupModal(true);
                else setShowSettingsModal(true);
              }}
              title="Lock Settings"
            >
              <Shield size={13} /> {hasPasscode ? "Settings" : "Set Up"}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
const JournalPage = () => {
  const dispatch = useDispatch();
  const {
    isLockEnabled,
    hasPasscode,
    lockApp,
    setShowSettingsModal,
    setShowSetupModal,
  } = useLock();
  const { journals, loading, saving, deleting, skip, hasMore } = useSelector(
    (s) => s.journal,
  );

  const [view, setView] = useState("timeline"); // timeline | editor | reader
  const [editorTarget, setEditorTarget] = useState(null); // null = new, obj = edit
  const [readerEntry, setReaderEntry] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [moodFilter, setMoodFilter] = useState(null);
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const mainRef = useRef(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, key: Date.now() });
  }, []);

  /* Scroll main to top on view change */
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  /* ── Initial load ── */
  useEffect(() => {
    const load = async () => {
      dispatch(setLoading(true));
      try {
        const data = await journalApi.getAllJournals(0, PAGE_LIMIT);
        dispatch(setJournals(data.journals || []));
        dispatch(setSkip(data.journals?.length ?? 0));
        dispatch(setHasMore((data.journals?.length ?? 0) >= PAGE_LIMIT));
      } catch {
        showToast("Could not load journals", "error");
      } finally {
        dispatch(setLoading(false));
      }
    };
    load();
  }, [dispatch]);

  /* ── Mood-filtered journals ── */
  const displayJournals = useMemo(() => {
    if (!moodFilter) return journals;
    const meta = getAllMeta();
    return journals.filter((j) => meta[j._id || j.id]?.mood === moodFilter);
  }, [journals, moodFilter]);

  /* ── Load more ── */
  const loadMore = async () => {
    if (!hasMore || loading) return;
    dispatch(setLoading(true));
    try {
      const data = await journalApi.getAllJournals(skip, PAGE_LIMIT);
      const batch = data.journals || [];
      dispatch(appendJournals(batch));
      dispatch(setSkip(skip + batch.length));
      dispatch(setHasMore(batch.length >= PAGE_LIMIT));
    } catch {
      showToast("Could not load more entries", "error");
    } finally {
      dispatch(setLoading(false));
    }
  };

  /* ── Save (create / update) ── */
  const handleSave = async ({ title, content, mood }) => {
    dispatch(setSaving(true));
    try {
      if (editorTarget) {
        const id = editorTarget._id || editorTarget.id;
        const data = await journalApi.editJournal(id, { title, content });
        dispatch(updateJournal(data.journal));
        if (mood) saveEntryMeta(id, { mood });
        showToast("Entry updated ✏️");
      } else {
        const data = await journalApi.addJournal({ title, content });
        const newEntry = data.journal;
        const newId = newEntry._id || newEntry.id;
        if (mood) saveEntryMeta(newId, { mood });
        dispatch(addJournal(newEntry));
        showToast("Entry saved ✨");
      }
      setView("timeline");
      setEditorTarget(null);
    } catch (e) {
      showToast(e?.response?.data?.message ?? "Failed to save", "error");
    } finally {
      dispatch(setSaving(false));
    }
  };

  /* ── Open reader ── */
  const handleRead = async (journal) => {
    const id = journal._id || journal.id;
    dispatch(setLoading(true));
    try {
      const data = await journalApi.getJournal(id);
      setReaderEntry(data.journal);
      dispatch(setCurrentJournal(data.journal));
    } catch {
      setReaderEntry(journal);
    } finally {
      dispatch(setLoading(false));
      setView("reader");
    }
  };

  /* ── Edit ── */
  const handleEdit = (journal) => {
    setEditorTarget(journal);
    setView("editor");
  };

  /* ── Delete ── */
  const handleDeleteClick = (journal) => setDeleteTarget(journal);
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget._id || deleteTarget.id;
    dispatch(setDeleting(true));
    try {
      await journalApi.deleteJournal(id);
      dispatch(removeJournal(id));
      setDeleteTarget(null);
      if (view !== "timeline") setView("timeline");
      showToast("Entry deleted");
    } catch (e) {
      showToast(e?.response?.data?.message ?? "Failed to delete", "error");
    } finally {
      dispatch(setDeleting(false));
    }
  };

  const goTimeline = () => {
    setView("timeline");
    setEditorTarget(null);
    setReaderEntry(null);
  };
  const goNew = () => {
    setEditorTarget(null);
    setView("editor");
    setSidebarOpen(false);
  };

  /* ═══════ RENDER ═══════ */
  return (
    <div className="jnl-page">
      {/* Toast */}
      {toast && (
        <Toast
          key={toast.key}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <ConfirmDelete
          entry={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="jnl-sidebar-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Journal sidebar"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="jnl-sidebar-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="jnl-sidebar-sheet__close"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
            <SidebarPanel
              journals={journals}
              onNew={goNew}
              moodFilter={moodFilter}
              onMoodFilter={setMoodFilter}
              search={search}
              onSearch={setSearch}
            />
          </div>
        </div>
      )}

      {/* ── Desktop Sidebar ── */}
      <SidebarPanel
        journals={journals}
        onNew={goNew}
        moodFilter={moodFilter}
        onMoodFilter={setMoodFilter}
        search={search}
        onSearch={setSearch}
      />

      {/* ── Main Panel ── */}
      <main className="jnl-main" ref={mainRef} aria-label="Journal content">
        {/* Mobile top bar */}
        <div className="jnl-mobile-bar">
          <button
            className="jnl-icon-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={19} />
          </button>
          <span className="jnl-mobile-bar__title">
            {view === "editor"
              ? editorTarget
                ? "Edit Entry"
                : "New Entry"
              : view === "reader"
                ? "Entry"
                : "Journal"}
          </span>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <button
              type="button"
              className="jnl-icon-btn"
              onClick={() => {
                if (!hasPasscode) setShowSetupModal(true);
                else if (isLockEnabled) lockApp();
                else setShowSettingsModal(true);
              }}
              title="Lock Journal"
              aria-label="App Lock"
            >
              {isLockEnabled ? (
                <Lock size={16} />
              ) : (
                <LockKeyholeOpen size={16} />
              )}
            </button>
            {view === "timeline" && (
              <button
                className="jnl-btn jnl-btn--primary jnl-btn--sm"
                onClick={goNew}
                aria-label="New entry"
              >
                <Plus size={15} />
              </button>
            )}
            {view !== "timeline" && (
              <button
                className="jnl-btn jnl-btn--ghost jnl-btn--sm"
                onClick={goTimeline}
              >
                <ArrowLeft size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Loading inline indicator */}
        {loading && journals.length > 0 && (
          <div className="jnl-loading-bar" aria-hidden="true" />
        )}

        {/* Views */}
        {view === "timeline" && (
          <TimelineView
            journals={displayJournals}
            loading={loading}
            hasMore={hasMore}
            search={search}
            onRead={handleRead}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onLoadMore={loadMore}
          />
        )}

        {view === "editor" && (
          <EditorView
            initial={editorTarget}
            onSave={handleSave}
            onBack={goTimeline}
            saving={saving}
          />
        )}

        {view === "reader" && readerEntry && (
          <ReaderView
            journal={readerEntry}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onBack={goTimeline}
          />
        )}
      </main>

      {/* Mobile FAB (only on timeline) */}
      {view === "timeline" && (
        <button
          className="jnl-fab"
          onClick={goNew}
          aria-label="Write new journal entry"
        >
          <Plus size={24} />
        </button>
      )}
    </div>
  );
};

export default JournalPage;
