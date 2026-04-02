import { useState, useMemo } from "react";
import { C, FONTS } from "../shared/styles/tokens";
import {
  Glass,
  Btn,
  FInput,
  FSelect,
  InlineLoader,
} from "../shared/components/ui/Atoms";
import { Modal, Confirm } from "../shared/components/ui/Modal";
import { uid } from "../shared/utils/helpers";

// ── Types ──────────────────────────────────────────────────

// ── Constants ──────────────────────────────────────────────
const HOURS = Array.from({ length: 19 }, (_, i) => i + 5); // 5:00 → 23:00

const TASK_ICONS = [
  { icon: "💻", label: "Work/Dev" },
  { icon: "📚", label: "Study" },
  { icon: "🏃", label: "Exercise" },
  { icon: "🍜", label: "Food" },
  { icon: "😴", label: "Sleep/Rest" },
  { icon: "📞", label: "Call" },
  { icon: "✍️", label: "Write" },
  { icon: "🎯", label: "Focus" },
  { icon: "🚶", label: "Walk" },
  { icon: "💬", label: "Meeting" },
  { icon: "🎵", label: "Music" },
  { icon: "🛒", label: "Errands" },
];

const BLOCK_COLORS = [
  "#f97316",
  "#7C3AED",
  "#22c55e",
  "#3b82f6",
  "#ec4899",
  "#f59e0b",
  "#06b6d4",
  "#6366f1",
];

// ── Week helpers ───────────────────────────────────────────
function getWeekDays(anchor) {
  const d = new Date(anchor);
  const dow = d.getDay(); // 0=Sun
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((dow + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const x = new Date(monday);
    x.setDate(monday.getDate() + i);
    return x;
  });
}
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const fmtHM = (h, m) =>
  `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
const dateKey = (d) => d.toISOString().slice(0, 10);
const today = () => new Date();

// ── Seed data ──────────────────────────────────────────────
const todayStr = today().toISOString().slice(0, 10);
// const [ty, tm, td] = todayStr.split("-").map(Number);

function makeSeed() {
  const base = [
    {
      id: "b1",
      title: "Morning routine",
      icon: "☀️",
      color: "#f59e0b",
      startH: 6,
      startM: 0,
      duration: 2,
      note: "Exercise + breakfast",
      done: true,
      energy: 2,
    },
    {
      id: "b2",
      title: "DSA Practice",
      icon: "💻",
      color: "#7C3AED",
      startH: 8,
      startM: 0,
      duration: 4,
      note: "LeetCode medium",
      done: true,
      energy: 3,
    },
    {
      id: "b3",
      title: "DBMS Lecture",
      icon: "📚",
      color: "#3b82f6",
      startH: 10,
      startM: 0,
      duration: 2,
      note: "Chapter 7",
      done: true,
      energy: 2,
    },
    {
      id: "b4",
      title: "Lunch",
      icon: "🍜",
      color: "#f97316",
      startH: 12,
      startM: 30,
      duration: 1,
      done: true,
      energy: 1,
    },
    {
      id: "b5",
      title: "Web dev",
      icon: "💻",
      color: "#f97316",
      startH: 16,
      startM: 0,
      duration: 4,
      note: "Lumina project",
      done: false,
      energy: 3,
    },
    {
      id: "b6",
      title: "Walk",
      icon: "🚶",
      color: "#22c55e",
      startH: 18,
      startM: 0,
      duration: 2,
      done: false,
      energy: 1,
    },
    {
      id: "b7",
      title: "Spoken English",
      icon: "💬",
      color: "#3b82f6",
      startH: 19,
      startM: 0,
      duration: 2,
      done: false,
      energy: 2,
    },
    {
      id: "b8",
      title: "Dinner",
      icon: "🍜",
      color: "#ec4899",
      startH: 20,
      startM: 0,
      duration: 2,
      done: false,
      energy: 1,
    },
    {
      id: "b9",
      title: "Sleep",
      icon: "😴",
      color: "#6366f1",
      startH: 22,
      startM: 0,
      duration: 6,
      done: false,
      energy: 1,
      repeat: true,
    },
  ];
  const result = {};
  // Spread blocks across current week
  const week = getWeekDays(today());
  week.forEach((d, i) => {
    const key = dateKey(d);
    result[key] = base
      .map((b) => ({
        ...b,
        id: `${b.id}_${key}`,
        done: key < todayStr ? true : key === todayStr ? b.done : false,
      }))
      .filter((_, j) => {
        // Vary blocks per day for realism
        if (i === 5 || i === 6) return [0, 3, 5, 7, 8].includes(j); // weekend: lighter
        return true;
      });
  });
  return result;
}

const SEED_BLOCKS = makeSeed();

const emptyForm = () => ({
  title: "",
  icon: "💻",
  color: BLOCK_COLORS[0],
  startH: 9,
  startM: 0,
  duration: 2,
  note: "",
  energy: 2,
  repeat: false,
});

// ── Component ──────────────────────────────────────────────
export default function TasksPage() {
  const [anchor, setAnchor] = useState(today());
  const [blocks, setBlocks] = useState(SEED_BLOCKS);
  const [activeDay, setActiveDay] = useState(todayStr);
  let type = "";
  const [modal, setModal] = useState({ type: "none" });
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const sf = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const weekDays = useMemo(() => getWeekDays(anchor), [anchor]);
  const dayBlocks = useMemo(
    () =>
      (blocks[activeDay] || []).sort(
        (a, b) => a.startH * 60 + a.startM - (b.startH * 60 + b.startM),
      ),
    [blocks, activeDay],
  );

  const goWeek = (dir) => {
    const d = new Date(anchor);
    d.setDate(d.getDate() + dir * 7);
    setAnchor(d);
  };

  const toggleDone = (id) =>
    setBlocks((p) => ({
      ...p,
      [activeDay]: (p[activeDay] || []).map((b) =>
        b.id === id ? { ...b, done: !b.done } : b,
      ),
    }));

  const openAdd = () => {
    setForm(emptyForm());
    setModal({ type: "add" });
  };
  const openEdit = (b) => {
    setForm({
      title: b.title,
      icon: b.icon,
      color: b.color,
      startH: b.startH,
      startM: b.startM,
      duration: b.duration,
      note: b.note ?? "",
      energy: b.energy,
      repeat: b.repeat ?? false,
    });
    setModal({ type: "edit", data: b });
  };
  const openView = (b) => setModal({ type: "view", data: b });

  const handleSave = async () => {
    if (!form.title) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    if (modal.type === "add") {
      const nb = { ...form, id: uid(), done: false };
      setBlocks((p) => ({ ...p, [activeDay]: [...(p[activeDay] || []), nb] }));
    } else if (modal.type === "edit" && modal.data) {
      setBlocks((p) => ({
        ...p,
        [activeDay]: (p[activeDay] || []).map((b) =>
          b.id === modal.data.id ? { ...b, ...form } : b,
        ),
      }));
    }
    setSaving(false);
    setModal({ type });
  };

  const handleDelete = async (id) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 300));
    setBlocks((p) => ({
      ...p,
      [activeDay]: (p[activeDay] || []).filter((b) => b.id == id),
    }));
    setSaving(false);
    setModal({ type });
  };

  // Stats for active day
  const totalBlocks = dayBlocks.length;
  const doneBlocks = dayBlocks.filter((b) => b.done).length;
  const totalHrs = dayBlocks.reduce((s, b) => s + b.duration * 0.5, 0);

  // Format active day label
  const activeDateObj = new Date(activeDay + "T00:00:00");
  const activeDayLabel = activeDateObj.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div
      className="screen-in"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 0,
        height: "calc(100vh - 100px)",
        overflow: "hidden",
      }}
    >
      {/* ── TOP: Week header ── */}
      <div
        style={{
          background: "rgba(10,14,22,.98)",
          borderBottom: `1px solid ${C.glassBorder}`,
          flexShrink: 0,
        }}
      >
        {/* Month + nav */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 20px 8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h2
              style={{
                fontFamily: FONTS.display,
                fontSize: 18,
                color: C.text,
                fontWeight: 700,
              }}
            >
              {anchor.toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <div style={{ display: "flex", gap: 4 }}>
              <button
                onClick={() => goWeek(-1)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 7,
                  background: "rgba(255,255,255,.05)",
                  border: `1px solid ${C.glassBorder}`,
                  color: C.textMid,
                  cursor: "pointer",
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ‹
              </button>
              <button
                onClick={() => goWeek(1)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 7,
                  background: "rgba(255,255,255,.05)",
                  border: `1px solid ${C.glassBorder}`,
                  color: C.textMid,
                  cursor: "pointer",
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ›
              </button>
            </div>
            <button
              onClick={() => {
                setAnchor(today());
                setActiveDay(todayStr);
              }}
              style={{
                fontSize: 11,
                padding: "3px 10px",
                borderRadius: 20,
                background: "rgba(124,58,237,.15)",
                border: "1px solid rgba(124,58,237,.3)",
                color: "#c4b5fd",
                cursor: "pointer",
              }}
            >
              Today
            </button>
          </div>
          <Btn onClick={openAdd} small>
            + Add Block
          </Btn>
        </div>

        {/* 7-day strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7,1fr)",
            gap: 0,
            padding: "0 8px 10px",
          }}
        >
          {weekDays.map((d, i) => {
            const key = dateKey(d);
            const isToday = key === todayStr;
            const isActive = key === activeDay;
            const dayBs = blocks[key] || [];
            const doneCnt = dayBs.filter((b) => b.done).length;
            const colors = [...new Set(dayBs.map((b) => b.color))].slice(0, 5);

            return (
              <div
                key={key}
                onClick={() => setActiveDay(key)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  padding: "8px 4px",
                  borderRadius: 12,
                  cursor: "pointer",
                  background: isActive ? "rgba(124,58,237,.15)" : "transparent",
                  border: isActive
                    ? `1px solid rgba(124,58,237,.4)`
                    : "1px solid transparent",
                  transition: "all .15s",
                }}
              >
                {/* Day label */}
                <span
                  style={{
                    fontSize: 11,
                    color: isActive ? "#c4b5fd" : C.textDim,
                    fontWeight: 600,
                  }}
                >
                  {DAY_LABELS[i]}
                </span>

                {/* Date number */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isToday
                      ? `linear-gradient(135deg,${C.violet},${C.violetLight})`
                      : "transparent",
                    border:
                      isActive && !isToday ? `2px solid ${C.violet}` : "none",
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      color: isToday
                        ? "#fff"
                        : isActive
                          ? "#c4b5fd"
                          : C.textMid,
                      fontWeight: isToday || isActive ? 700 : 400,
                    }}
                  >
                    {d.getDate()}
                  </span>
                </div>

                {/* Color dots for tasks */}
                <div
                  style={{
                    display: "flex",
                    gap: 2,
                    height: 8,
                    alignItems: "center",
                  }}
                >
                  {colors.map((c, j) => (
                    <div
                      key={j}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: c,
                        opacity: 0.85,
                      }}
                    />
                  ))}
                </div>

                {/* Done count */}
                {dayBs.length > 0 && (
                  <span style={{ fontSize: 9, color: C.textDim }}>
                    {doneCnt}/{dayBs.length}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── MAIN: Time planner ── */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex" }}>
        {/* Time axis */}
        <div style={{ width: 56, flexShrink: 0, paddingTop: 16 }}>
          {HOURS.map((h) => (
            <div
              key={h}
              style={{
                height: 60,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-end",
                paddingRight: 10,
                paddingTop: 2,
              }}
            >
              <span style={{ fontSize: 11, color: C.textDim }}>
                {String(h).padStart(2, "0")}:00
              </span>
            </div>
          ))}
        </div>

        {/* Timeline column */}
        <div
          style={{
            flex: 1,
            position: "relative",
            borderLeft: `1px solid ${C.glassBorder}`,
            paddingTop: 16,
            paddingRight: 16,
          }}
        >
          {/* Hour lines */}
          {HOURS.map((h) => (
            <div
              key={h}
              style={{
                position: "absolute",
                left: 0,
                right: 16,
                height: 1,
                background: "rgba(255,255,255,.05)",
                top: 16 + (h - 5) * 60,
              }}
            />
          ))}
          {/* Half-hour lines */}
          {HOURS.map((h) => (
            <div
              key={`h${h}`}
              style={{
                position: "absolute",
                left: 0,
                right: 16,
                height: 1,
                background: "rgba(255,255,255,.02)",
                top: 16 + (h - 5) * 60 + 30,
              }}
            />
          ))}

          {/* Current time indicator */}
          {activeDay === todayStr &&
            (() => {
              const now = new Date();
              const topPx = 16 + (now.getHours() - 5) * 60 + now.getMinutes();
              return topPx > 0 ? (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 16,
                    top: topPx,
                    zIndex: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: C.green,
                      flexShrink: 0,
                      boxShadow: `0 0 8px ${C.green}`,
                    }}
                  />
                  <div
                    style={{
                      flex: 1,
                      height: 1,
                      background: C.green,
                      opacity: 0.6,
                    }}
                  />
                </div>
              ) : null;
            })()}

          {/* Time blocks */}
          {dayBlocks.map((block) => {
            const topPx = 16 + (block.startH - 5) * 60 + block.startM;
            const heightPx = block.duration * 30 - 4;
            const endH =
              block.startH +
              Math.floor((block.startM + block.duration * 30) / 60);
            const endM = (block.startM + block.duration * 30) % 60;
            const hrs = block.duration * 0.5;
            const flames = Array.from({ length: block.energy }, (_, i) => i);

            return (
              <div
                key={block.id}
                onClick={() => openView(block)}
                style={{
                  position: "absolute",
                  left: 12,
                  right: 16,
                  top: topPx,
                  height: heightPx,
                  borderRadius: 16,
                  background: block.done
                    ? "rgba(255,255,255,.04)"
                    : block.color + "18",
                  border: `1px solid ${block.done ? "rgba(255,255,255,.08)" : block.color + "50"}`,
                  cursor: "pointer",
                  overflow: "hidden",
                  transition: "all .2s",
                  display: "flex",
                  alignItems: "stretch",
                }}
              >
                {/* Left color bar */}
                <div
                  style={{
                    width: 4,
                    flexShrink: 0,
                    background: block.done
                      ? `rgba(255,255,255,.15)`
                      : block.color,
                    borderRadius: "12px 0 0 12px",
                    opacity: block.done ? 0.4 : 1,
                  }}
                />

                {/* Content */}
                <div
                  style={{
                    flex: 1,
                    padding: "8px 10px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minWidth: 0,
                    opacity: block.done ? 0.55 : 1,
                  }}
                >
                  {/* Top row */}
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        color: C.textDim,
                        marginBottom: 3,
                      }}
                    >
                      {fmtHM(block.startH, block.startM)} – {fmtHM(endH, endM)}{" "}
                      ({hrs} hr{hrs == 1 ? "s" : ""})
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <span style={{ fontSize: 16 }}>{block.icon}</span>
                      <span
                        style={{
                          fontSize: 14,
                          color: C.text,
                          fontWeight: 700,
                          textDecoration: block.done ? "line-through" : "none",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {block.title}
                      </span>
                      {block.repeat && (
                        <span style={{ fontSize: 10, color: C.textDim }}>
                          ↺
                        </span>
                      )}
                    </div>
                    {block.note && heightPx > 60 && (
                      <div
                        style={{
                          fontSize: 11,
                          color: C.textDim,
                          marginTop: 3,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {block.note}
                      </div>
                    )}
                  </div>

                  {/* Bottom: energy flames + done circle */}
                  {heightPx > 50 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        {flames.map((i) => (
                          <span key={i} style={{ fontSize: 11, opacity: 0.7 }}>
                            🔥
                          </span>
                        ))}
                        <span
                          style={{
                            fontSize: 11,
                            color: C.textDim,
                            marginLeft: 2,
                          }}
                        >
                          {block.energy}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: C.textDim }}>→</div>
                    </div>
                  )}
                </div>

                {/* Done circle (right side) */}
                <div
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDone(block.id);
                    }}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      border: `2px solid ${block.done ? block.color : block.color + "80"}`,
                      background: block.done ? block.color : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      color: "#fff",
                      cursor: "pointer",
                      transition: "all .2s",
                    }}
                  >
                    {block.done ? "✓" : ""}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Empty state for day */}
          {dayBlocks.length === 0 && (
            <div
              style={{
                position: "absolute",
                top: "40%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 10 }}>📅</div>
              <div style={{ fontSize: 13, color: C.textDim }}>
                No blocks for {activeDayLabel.split(",")[0]}
              </div>
              <div style={{ marginTop: 12 }}>
                <Btn onClick={openAdd}>+ Add Time Block</Btn>
              </div>
            </div>
          )}
        </div>

        {/* Right: Day summary sidebar */}
        <div
          style={{
            width: 180,
            flexShrink: 0,
            padding: "16px 12px",
            borderLeft: `1px solid ${C.glassBorder}`,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: 13,
              color: C.text,
              fontWeight: 700,
            }}
          >
            {activeDayLabel}
          </div>

          {/* Stats */}
          <Glass style={{ padding: 12 }}>
            <div style={{ fontSize: 11, color: C.textDim, marginBottom: 8 }}>
              Today's plan
            </div>
            <div
              style={{
                fontFamily: FONTS.display,
                fontSize: 20,
                color: C.text,
                fontWeight: 700,
              }}
            >
              {doneBlocks}/{totalBlocks}
            </div>
            <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>
              blocks done
            </div>
            <div
              style={{
                height: 4,
                background: "rgba(255,255,255,.07)",
                borderRadius: 4,
                overflow: "hidden",
                marginTop: 8,
              }}
            >
              <div
                style={{
                  width: `${totalBlocks > 0 ? (doneBlocks / totalBlocks) * 100 : 0}%`,
                  height: "100%",
                  background: `linear-gradient(90deg,${C.violet},${C.violetLight})`,
                  borderRadius: 4,
                  transition: "width .5s",
                }}
              />
            </div>
            <div style={{ fontSize: 11, color: C.textDim, marginTop: 6 }}>
              ⏱ {totalHrs}h planned
            </div>
          </Glass>

          {/* Block list mini */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {dayBlocks.map((b) => (
              <div
                key={b.id}
                onClick={() => openView(b)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 8px",
                  borderRadius: 8,
                  background: b.done ? "rgba(255,255,255,.03)" : b.color + "12",
                  border: `1px solid ${b.done ? "rgba(255,255,255,.06)" : b.color + "30"}`,
                  cursor: "pointer",
                  transition: "all .15s",
                  opacity: b.done ? 0.6 : 1,
                }}
              >
                <span style={{ fontSize: 13 }}>{b.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 11,
                      color: C.text,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      textDecoration: b.done ? "line-through" : "none",
                    }}
                  >
                    {b.title}
                  </div>
                  <div style={{ fontSize: 9, color: C.textDim }}>
                    {fmtHM(b.startH, b.startM)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI helper */}
          <Glass
            style={{
              padding: 10,
              background: "rgba(124,58,237,.1)",
              border: "1px solid rgba(124,58,237,.25)",
              marginTop: "auto",
            }}
          >
            <div style={{ fontSize: 11, color: "#c4b5fd", marginBottom: 8 }}>
              ⟡ AI
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {["Plan tomorrow", "Optimize schedule", "Add study block"].map(
                (t, i) => (
                  <button
                    key={i}
                    style={{
                      textAlign: "left",
                      padding: "4px 8px",
                      borderRadius: 6,
                      background: "rgba(124,58,237,.2)",
                      border: "1px solid rgba(124,58,237,.3)",
                      color: "#c4b5fd",
                      cursor: "pointer",
                      fontSize: 10,
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  >
                    {t}
                  </button>
                ),
              )}
            </div>
          </Glass>
        </div>
      </div>

      {/* ── ADD / EDIT MODAL ── */}
      {(modal.type === "add" || modal.type === "edit") && (
        <Modal
          title={modal.type === "add" ? "New Time Block" : "Edit Block"}
          onClose={() => setModal({ type })}
          wide
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Icon picker */}
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
                Icon
              </label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {TASK_ICONS.map(({ icon, label }) => (
                  <button
                    key={icon}
                    onClick={() => sf("icon", icon)}
                    title={label}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 9,
                      fontSize: 20,
                      border:
                        form.icon === icon
                          ? `2px solid ${C.violet}`
                          : `1px solid ${C.glassBorder}`,
                      background:
                        form.icon === icon
                          ? "rgba(124,58,237,.2)"
                          : "rgba(255,255,255,.04)",
                      cursor: "pointer",
                      transition: "all .15s",
                    }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <FInput
              label="Title"
              value={form.title}
              onChange={(v) => sf("title", v)}
              placeholder="e.g. DSA Practice"
              required
            />

            {/* Time + duration */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 12,
              }}
            >
              <FSelect
                label="Start Hour"
                value={String(form.startH)}
                onChange={(v) => sf("startH", Number(v))}
                options={HOURS.map((h) => ({
                  value: String(h),
                  label: `${String(h).padStart(2, "0")}:00`,
                }))}
              />
              <FSelect
                label="Start Min"
                value={String(form.startM)}
                onChange={(v) => sf("startM", Number(v))}
                options={[
                  { value: "0", label: "00" },
                  { value: "30", label: "30" },
                ]}
              />
              <FSelect
                label="Duration"
                value={String(form.duration)}
                onChange={(v) => sf("duration", Number(v))}
                options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 16].map((n) => ({
                  value: String(n),
                  label:
                    n % 2 === 0
                      ? `${n / 2} hr${n / 2 > 1 ? "s" : ""}`
                      : `${n * 30} min`,
                }))}
              />
            </div>

            {/* Color picker */}
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
                Color
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                {BLOCK_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => sf("color", c)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 7,
                      background: c,
                      border:
                        form.color === c
                          ? "3px solid #fff"
                          : "2px solid transparent",
                      cursor: "pointer",
                      transition: "border .15s",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Energy */}
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
                Energy required
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                {[1, 2, 3].map((e) => (
                  <button
                    key={e}
                    onClick={() => sf("energy", e)}
                    style={{
                      padding: "6px 16px",
                      borderRadius: 9,
                      border:
                        form.energy === e
                          ? `2px solid ${C.violet}`
                          : `1px solid ${C.glassBorder}`,
                      background:
                        form.energy === e
                          ? "rgba(124,58,237,.2)"
                          : "rgba(255,255,255,.04)",
                      cursor: "pointer",
                      fontSize: 13,
                    }}
                  >
                    {"🔥".repeat(e)} {e}
                  </button>
                ))}
              </div>
            </div>

            <FInput
              label="Note (optional)"
              value={form.note}
              onChange={(v) => sf("note", v)}
              placeholder="Any details..."
            />

            {/* Repeat toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                onClick={() => sf("repeat", !form.repeat)}
                style={{
                  width: 40,
                  height: 22,
                  borderRadius: 11,
                  background: form.repeat
                    ? `linear-gradient(135deg,${C.violet},${C.violetLight})`
                    : "rgba(255,255,255,.08)",
                  cursor: "pointer",
                  position: "relative",
                  transition: "background .2s",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 2,
                    left: form.repeat ? 20 : 2,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "#fff",
                    transition: "left .2s",
                  }}
                />
              </div>
              <span style={{ fontSize: 13, color: C.textMid }}>
                Repeat daily
              </span>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleSave}
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
                ) : modal.type === "add" ? (
                  "Add Block"
                ) : (
                  "Save Changes"
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
      {modal.type === "view" &&
        modal.data &&
        (() => {
          const b = modal.data;
          const endH = b.startH + Math.floor((b.startM + b.duration * 30) / 60);
          const endM = (b.startM + b.duration * 30) % 60;
          return (
            <Modal title={b.title} onClose={() => setModal({ type })} wide>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: 16,
                    borderRadius: 14,
                    background: b.color + "15",
                    border: `1px solid ${b.color}40`,
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: b.color + "25",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 28,
                    }}
                  >
                    {b.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 18,
                        color: C.text,
                        fontWeight: 700,
                        fontFamily: FONTS.display,
                      }}
                    >
                      {b.title}
                    </div>
                    <div
                      style={{ fontSize: 12, color: C.textDim, marginTop: 4 }}
                    >
                      {fmtHM(b.startH, b.startM)} – {fmtHM(endH, endM)} ·{" "}
                      {b.duration * 0.5} hr{b.duration * 0.5 == 1 ? "s" : ""}
                    </div>
                    <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                      {"🔥"
                        .repeat(b.energy)
                        .split("")
                        .map((_, i) => (
                          <span key={i} style={{ fontSize: 12 }}>
                            🔥
                          </span>
                        ))}
                      <span style={{ fontSize: 11, color: C.textDim }}>
                        {b.energy} energy
                      </span>
                    </div>
                  </div>
                </div>
                {b.note && (
                  <div
                    style={{
                      padding: 14,
                      background: "rgba(255,255,255,.03)",
                      borderRadius: 10,
                      fontSize: 13,
                      color: C.textMid,
                    }}
                  >
                    {b.note}
                  </div>
                )}
                {b.repeat && (
                  <div style={{ fontSize: 12, color: C.textDim }}>
                    ↺ Repeats daily
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    paddingTop: 16,
                    borderTop: `1px solid ${C.glassBorder}`,
                  }}
                >
                  <Btn onClick={() => openEdit(b)}>✏️ Edit</Btn>
                  <Btn
                    variant="ghost"
                    onClick={() => {
                      toggleDone(b.id);
                      setModal({ type });
                    }}
                  >
                    {b.done ? "↩ Mark Pending" : "✓ Mark Done"}
                  </Btn>
                  <div style={{ flex: 1 }} />
                  <Btn
                    variant="danger"
                    onClick={() => setModal({ type: "confirm", data: b })}
                  >
                    🗑 Delete
                  </Btn>
                </div>
              </div>
            </Modal>
          );
        })()}

      {/* ── CONFIRM ── */}
      {modal.type === "confirm" && modal.data && (
        <Confirm
          message={`Delete "${modal.data.title}"?`}
          onConfirm={() => handleDelete(modal.data.id)}
          onCancel={() => setModal({ type })}
        />
      )}
    </div>
  );
}
