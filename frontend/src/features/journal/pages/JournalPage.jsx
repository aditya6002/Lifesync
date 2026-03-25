// src/features/journal/pages/JournalPage.tsx
import { useState, useMemo } from "react";
import { C, FONTS } from "../../../shared/styles/tokens";
import {
  Glass,
  Btn,
  FInput,
  FTextarea,
  InlineLoader,
} from "../../../shared/components/ui/Atoms";
import { Modal, ViewModal, Confirm } from "../../../shared/components/ui/Modal";
import { fmtDate, today, uid } from "../../../shared/utils/helpers";

// ── constants ──────────────────────────────────────────────
// const MOODS = ["😴", "😟", "😐", "🙂", "😄", "🤩"];
// const MOOD_LBL = ["Exhausted", "Sad", "Neutral", "Good", "Happy", "Amazing"];
// const MOOD_CLR = [C.textDim, C.blue, C.textMid, C.yellow, C.green, "#c4b5fd"];
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
  C.textDim, // Exhausted
  "#94a3b8", // Sleepy (soft gray-blue)
  C.blue, // Worried
  "#60a5fa", // Low (lighter blue)
  C.textMid, // Neutral
  C.yellow, // Good
  "#facc15", // Content (warm yellow)
  C.green, // Happy
  "#22c55e", // Confident (strong green)
  "#c4b5fd", // Amazing (violet)
  "#f97316", // On Fire (orange)
  "#ef4444", // Unstoppable (red)
];
// ── demo seed ──────────────────────────────────────────────
const SEED = [
  // March 2026
  {
    id: "j1",
    date: "2026-03-11",
    mood: 4,
    title: "Productive Wednesday",
    content:
      "Had a really productive day today. Finished two assignments and finally understood AVL trees. Went for a 30-min walk in the evening. Feeling optimistic about the upcoming exam.",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "j2",
    date: "2026-03-10",
    mood: 2,
    title: "Distracted day",
    content:
      "Couldn't focus much. Scrolled social media for 3 hours straight. Need to fix my sleep schedule. Will try sleeping by 11 PM tonight.",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "j3",
    date: "2026-03-09",
    mood: 3,
    title: "Steady progress",
    content:
      "Good gym session today. Started reading Atomic Habits again from Chapter 3. Had a decent study session in the evening.",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "j4",
    date: "2026-03-08",
    mood: 1,
    title: "Rough Sunday",
    content:
      "Failed the weekly quiz. Score was 4/10. Feeling low but trying to stay motivated. Going to make a proper study plan this week.",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "j5",
    date: "2026-03-06",
    mood: 4,
    title: "Friday win",
    content:
      "Submitted the project before the deadline Feeling really proud. Celebrated with friends at the cafeteria.",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "j6",
    date: "2026-03-04",
    mood: 3,
    title: "New week energy",
    content:
      "Started the week with a clear plan. Completed 3 tasks before noon. Small wins matter.",
    userId: "u1",
    createdAt: "",
  },
  // February 2026
  {
    id: "j7",
    date: "2026-02-28",
    mood: 5,
    title: "February wrap-up",
    content:
      "What a month Completed the DSA challenge, read 2 books and maintained budget. Feeling amazing heading into March.",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "j8",
    date: "2026-02-20",
    mood: 3,
    title: "Mid-month check-in",
    content:
      "Halfway through Feb. Progress is steady. Need to push harder on the DSA practice. Exercise routine is consistent though.",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "j9",
    date: "2026-02-14",
    mood: 4,
    title: "Valentine's day",
    content:
      "Spent the day studying but treated myself to a nice dinner. Sometimes self-care is the best care.",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "j10",
    date: "2026-02-07",
    mood: 2,
    title: "Tough week",
    content:
      "Two assignment deadlines clashed. Didn't sleep well. Need to plan better next time.",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "j11",
    date: "2026-02-01",
    mood: 3,
    title: "February begins",
    content:
      "New month, new goals. Set 4 targets: read 2 books, maintain workout, save ₹1500, practice DSA daily.",
    userId: "u1",
    createdAt: "",
  },
  // January 2026
  {
    id: "j12",
    date: "2026-01-31",
    mood: 4,
    title: "January review",
    content:
      "Completed 80% of my January goals. Missed the reading target but crushed DSA practice. Overall solid month.",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "j13",
    date: "2026-01-15",
    mood: 3,
    title: "Midway January",
    content:
      "Semester starting soon. Have mixed feelings — excited but anxious. Spending more time organizing my notes.",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "j14",
    date: "2026-01-01",
    mood: 5,
    title: "Happy New Year 🎉",
    content:
      "2026 starts today Goals this year: get a great internship, build something meaningful, stay healthy and read more.",
    userId: "u1",
    createdAt: "",
  },
  // December 2025
  {
    id: "j15",
    date: "2025-12-25",
    mood: 5,
    title: "Merry Christmas 🎄",
    content:
      "Wonderful day with family. Received some nice books as gifts. Feeling grateful and recharged.",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "j16",
    date: "2025-12-20",
    mood: 2,
    title: "Exam stress",
    content:
      "Semester exams next week. Feeling overwhelmed. Trying to stay calm and stick to the study plan.",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "j17",
    date: "2025-12-10",
    mood: 3,
    title: "December vibes",
    content:
      "December always feels slower and warmer somehow. Had a long chai break and journaled old memories.",
    userId: "u1",
    createdAt: "",
  },
];

// ── month helpers ──────────────────────────────────────────
function monthKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function monthLabel(key) {
  const [y, m] = key.split("-");
  return new Date(+y, +m - 1, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}
function prevMonth(key) {
  const [y, m] = key.split("-").map(Number);
  return monthKey(new Date(y, m - 2, 1));
}
function nextMonth(key) {
  const [y, m] = key.split("-").map(Number);
  return monthKey(new Date(y, m, 1));
}
function daysInMonth(key) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m, 0).getDate();
}
function dayOfWeek(key, day) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, day).getDay(); // 0=Sun
}

const CURRENT_MONTH = monthKey(new Date());
const CURRENT_DAY = new Date().getDate();

const emptyForm = (date) => ({
  title: "",
  content: "",
  mood: 3,
  date,
});

// ══════════════════════════════════════════════════════════
export default function JournalPage() {
  const [entries, setEntries] = useState(SEED);
  const [activeMonth, setActiveMonth] = useState(CURRENT_MONTH);
  const [modal, setModal] = useState({ type: "" });
  const [form, setForm] = useState(emptyForm(today()));
  const [saving, setSaving] = useState(false);
  const sf = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  // ── Month list ─────────────────────────────────────────
  const monthList = useMemo(() => {
    const keys = new Set(entries.map((e) => e.date.slice(0, 7)));
    keys.add(CURRENT_MONTH);
    return [...keys].sort((a, b) => b.localeCompare(a));
  }, [entries]);

  // ── Entries for active month ───────────────────────────
  const monthEntries = useMemo(
    () => entries.filter((e) => e.date.startsWith(activeMonth)),
    [entries, activeMonth],
  );

  // ── Entry lookup by date ───────────────────────────────
  const entryByDate = useMemo(() => {
    const m = {};
    monthEntries.forEach((e) => {
      m[e.date] = e;
    });
    return m;
  }, [monthEntries]);

  const days = daysInMonth(activeMonth);
  const startDow = dayOfWeek(activeMonth, 1); // 0=Sun
  const isCurrentMonth = activeMonth === CURRENT_MONTH;

  // ── Streak calc ────────────────────────────────────────
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

  // ── Mood stats for the month ───────────────────────────
  const avgMood = monthEntries.length
    ? (
        monthEntries.reduce((s, e) => s + e.mood, 0) / monthEntries.length
      ).toFixed(1)
    : "—";

  // ── CRUD ──────────────────────────────────────────────
  const openAdd = (date) => {
    const d = date ?? (isCurrentMonth ? today() : `${activeMonth}-01`);
    setForm(emptyForm(d));
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
    if (!form.content) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
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
    await new Promise((r) => setTimeout(r, 400));
    setEntries((p) => p.filter((e) => e.id !== id));
    setSaving(false);
    setModal({ type: "" });
  };

  return (
    <div
      className="screen-in"
      style={{ display: "flex", flexDirection: "column", gap: 18 }}
    >
      {/* ── HEADER ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <h2 style={{ fontFamily: FONTS.display, fontSize: 22, color: C.text }}>
          Daily Journal
        </h2>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {streak > 0 && (
            <div
              style={{
                fontSize: 13,
                color: C.violet,
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

      {/* ── MONTH NAVIGATOR ── */}
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
              cursor:
                activeMonth === monthList[monthList.length - 1]
                  ? "not-allowed"
                  : "pointer",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
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
              cursor: activeMonth === CURRENT_MONTH ? "not-allowed" : "pointer",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              opacity: activeMonth === CURRENT_MONTH ? 0.4 : 1,
            }}
          >
            ▶
          </button>
        </div>
      </Glass>

      {/* ── MONTH STATS ── */}
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

      {/* ── CALENDAR GRID ── */}
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

        {/* Day headers */}
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

        {/* Calendar cells */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7,1fr)",
            gap: 4,
          }}
        >
          {/* Empty cells for offset */}
          {Array.from({ length: startDow }).map((_, i) => (
            <div key={`e${i}`} />
          ))}

          {/* Day cells */}
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
                title={
                  entry
                    ? `${MOOD_LBL[entry.mood]}: ${entry.title || "View entry"}`
                    : isFuture
                      ? "Future date"
                      : "Click to write"
                }
                style={{
                  height: 44,
                  borderRadius: 10,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
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
                  cursor: isFuture ? "default" : "pointer",
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

        {/* Legend */}
        <div
          style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" }}
        >
          {MOODS.map((m, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: 5 }}
            >
              <span style={{ fontSize: 12 }}>{m}</span>
              <span style={{ fontSize: 10, color: C.textDim }}>
                {MOOD_LBL[i]}
              </span>
            </div>
          ))}
        </div>
      </Glass>

      {/* ── AI HELPERS ── */}
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
              `Summarize ${isCurrentMonth ? "this week" : monthLabel(activeMonth)}`,
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

      {/* ── ENTRY LIST ── */}
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
                className="hov-card"
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
                      {e.content.slice(0, 70)}...
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

      {/* ── ADD / EDIT MODAL ── */}
      {(modal.type === "add" || modal.type === "edit") && (
        <Modal
          title={modal.type === "add" ? "New Journal Entry" : "Edit Entry"}
          onClose={() => setModal({ type })}
          wide
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <FInput
              label="Date"
              type="date"
              value={form.date}
              onChange={(v) => sf("date", v)}
            />

            {/* Mood selector */}
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
              <div style={{ display: "flex", gap: 8 }}>
                {MOODS.map((m, i) => (
                  <button
                    key={i}
                    onClick={() => sf("mood", i)}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 11,
                      fontSize: 24,
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

            <FInput
              label="Title (optional)"
              value={form.title ?? ""}
              onChange={(v) => sf("title", v)}
              placeholder="Give this entry a title..."
            />
            <FTextarea
              label="What's on your mind?"
              value={form.content}
              onChange={(v) => sf("content", v)}
              placeholder="Write freely — thoughts, feelings, what happened today..."
              rows={8}
            />

            {/* Warn if date is in different month */}
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
                disabled={!form.content || saving}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 22px",
                  borderRadius: 10,
                  background:
                    saving || !form.content
                      ? "rgba(124,58,237,.4)"
                      : `linear-gradient(135deg,${C.violet},${C.violetLight})`,
                  border: "none",
                  color: "#fff",
                  cursor: saving || !form.content ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                {saving ? (
                  <>
                    <InlineLoader size={14} color="#fff" /> Saving...
                  </>
                ) : modal.type === "add" ? (
                  "Save Entry"
                ) : (
                  "Update Entry"
                )}
              </button>
              <Btn variant="ghost" onClick={() => setModal({ type })}>
                Cancel
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* ── VIEW MODAL ── */}
      {modal.type === "view" && modal.data && (
        <ViewModal
          title={modal.data.title || fmtDate(modal.data.date)}
          onClose={() => setModal({ type })}
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
            style={{
              fontSize: 14,
              color: C.textMid,
              lineHeight: 1.9,
              whiteSpace: "pre-wrap",
              marginBottom: 16,
            }}
          >
            {modal.data.content}
          </div>
          <Btn variant="ai">⟡ AI Insights on this entry</Btn>
        </ViewModal>
      )}

      {/* ── DELETE CONFIRM ── */}
      {modal.type === "confirm" && modal.data && (
        <Confirm
          message={`Delete "${modal.data.title || fmtDate(modal.data.date)}"? This cannot be undone.`}
          onConfirm={() => handleDelete(modal.data.id)}
          onCancel={() => setModal({ type })}
        />
      )}
    </div>
  );
}
