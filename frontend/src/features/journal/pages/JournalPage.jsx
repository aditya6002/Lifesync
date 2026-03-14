// src/modules/journal/JournalPage.jsx
import { useState } from "react";
import { C, FONTS } from "../../../shared/styles/tokens";
import {
  Glass,
  Btn,
  FInput,
  FTextarea,
} from "../../../shared/components/ui/Atoms";
import { Modal, ViewModal } from "../../../shared/components/ui/Modal";
import { MOODS, MOOD_LBL } from "../../../data/constants";
import { DEMO_JOURNAL } from "../../../data/demo";
import { uid, fmtDate } from "../../../shared/utils/helpers";

export default function JournalPage({ toast }) {
  const [entries, setEntries] = useState(DEMO_JOURNAL);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    mood: 3,
    date: new Date().toISOString().slice(0, 10),
  });

  const f = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const openAdd = () => {
    setForm({
      title: "",
      content: "",
      mood: 3,
      date: new Date().toISOString().slice(0, 10),
    });
    setModal({ t: "add" });
  };
  const openEdit = (e) => {
    setForm({ ...e });
    setModal({ t: "edit", d: e });
  };
  const openView = (e) => setModal({ t: "view", d: e });

  const save = () => {
    if (!form.content) return;
    if (modal.t === "add") {
      setEntries((es) => [{ ...form, id: uid() }, ...es]);
      toast("Entry saved ✓");
    } else {
      setEntries((es) =>
        es.map((e) => (e.id === modal.d.id ? { ...form, id: e.id } : e)),
      );
      toast("Updated ✓");
    }
    setModal(null);
  };

  const del = (id) => {
    setEntries((es) => es.filter((e) => e.id !== id));
    setModal(null);
    toast("Deleted");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontFamily: FONTS.display, fontSize: 22, color: C.text }}>
          Daily Journal
        </h2>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
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
            🔥 {entries.length} entries
          </div>
          <Btn onClick={openAdd}>+ Write Today</Btn>
        </div>
      </div>

      {/* Calendar strip */}
      <Glass style={{ padding: 16 }}>
        <div
          style={{
            fontSize: 11,
            color: C.textDim,
            marginBottom: 12,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          March 2026
        </div>
        <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
          {Array.from({ length: 11 }, (_, i) => i + 1).map((d) => {
            const entry = entries.find(
              (e) => e.date === `2026-03-${String(d).padStart(2, "0")}`,
            );
            const isToday = d === 11;
            return (
              <div
                key={d}
                onClick={() => entry && openView(entry)}
                style={{
                  flexShrink: 0,
                  width: 38,
                  height: 46,
                  borderRadius: 10,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  background: isToday
                    ? `linear-gradient(135deg,${C.violet},${C.violetLight})`
                    : entry
                      ? "rgba(124,58,237,.1)"
                      : "rgba(255,255,255,.03)",
                  border: isToday
                    ? "none"
                    : entry
                      ? "1px solid rgba(124,58,237,.3)"
                      : `1px solid ${C.glassBorder}`,
                  cursor: entry ? "pointer" : "default",
                  transition: "all .2s",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: isToday ? "#fff" : C.textMid,
                    fontWeight: isToday ? 700 : 400,
                  }}
                >
                  {d}
                </span>
                {entry && (
                  <span style={{ fontSize: 10 }}>{MOODS[entry.mood]}</span>
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
              "Summarize my week",
              "Find mood patterns",
              "Write reflection",
              "What made me happy?",
            ].map((x, i) => (
              <Btn key={i} variant="ai" small>
                {x}
              </Btn>
            ))}
          </div>
        </div>
      </Glass>

      {/* Entry list */}
      {entries.length === 0 && (
        <Glass style={{ padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>✦</div>
          <div style={{ color: C.textDim }}>No journal entries yet.</div>
          <div style={{ marginTop: 14 }}>
            <Btn onClick={openAdd}>+ Write First Entry</Btn>
          </div>
        </Glass>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {entries.map((e) => (
          <Glass
            key={e.id}
            className="hov-card"
            onClick={() => openView(e)}
            style={{ padding: 16, cursor: "pointer", transition: "all .2s" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "rgba(124,58,237,.15)",
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
                <div style={{ fontSize: 11, color: C.textDim, marginTop: 3 }}>
                  {MOOD_LBL[e.mood]} · {e.content.slice(0, 80)}...
                </div>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
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
                    del(e.id);
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

      {/* Add / Edit Modal */}
      {(modal?.t === "add" || modal?.t === "edit") && (
        <Modal
          title={modal.t === "add" ? "New Journal Entry" : "Edit Entry"}
          onClose={() => setModal(null)}
          wide
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <FInput
              label="Date"
              type="date"
              value={form.date}
              onChange={(v) => f("date", v)}
            />
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
              <div style={{ display: "flex", gap: 10 }}>
                {MOODS.map((m, i) => (
                  <button
                    key={i}
                    onClick={() => f("mood", i)}
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      fontSize: 22,
                      border:
                        form.mood === i
                          ? `2px solid ${C.violet}`
                          : `1px solid ${C.glassBorder}`,
                      background:
                        form.mood === i
                          ? "rgba(124,58,237,.2)"
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
              <div style={{ fontSize: 11, color: C.violet, marginTop: 6 }}>
                {MOOD_LBL[form.mood]}
              </div>
            </div>
            <FInput
              label="Title (optional)"
              value={form.title}
              onChange={(v) => f("title", v)}
              placeholder="Give this entry a title..."
            />
            <FTextarea
              label="What's on your mind?"
              value={form.content}
              onChange={(v) => f("content", v)}
              placeholder="Write freely..."
              rows={7}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={save} disabled={!form.content}>
                {modal.t === "add" ? "Save Entry" : "Update Entry"}
              </Btn>
              <Btn variant="ghost" onClick={() => setModal(null)}>
                Cancel
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* View Modal */}
      {modal?.t === "view" && (
        <ViewModal
          title={modal.d.title || fmtDate(modal.d.date)}
          onClose={() => setModal(null)}
          onEdit={() => openEdit(modal.d)}
          onDelete={() => del(modal.d.id)}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 34 }}>{MOODS[modal.d.mood]}</span>
            <div>
              <div style={{ fontSize: 15, color: C.text, fontWeight: 600 }}>
                {MOOD_LBL[modal.d.mood]}
              </div>
              <div style={{ fontSize: 12, color: C.textDim }}>
                {fmtDate(modal.d.date)}
              </div>
            </div>
          </div>
          <div
            style={{
              fontSize: 14,
              color: C.textMid,
              lineHeight: 1.85,
              whiteSpace: "pre-wrap",
              marginBottom: 16,
            }}
          >
            {modal.d.content}
          </div>
          <Btn variant="ai">⟡ AI Insights on this entry</Btn>
        </ViewModal>
      )}
    </div>
  );
}
