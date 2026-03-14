// src/modules/tasks/TasksPage.jsx
import { useState } from "react";
import { C, FONTS } from "../../../shared/styles/tokens";
import {
  Glass,
  Btn,
  Badge,
  FInput,
  FSelect,
} from "../../../shared/components/ui/Atoms";
import { Modal, ViewModal } from "../../../shared/components/ui/Modal";
import { PRI_CFG } from "../../../data/constants";
import { DEMO_TASKS } from "../../../data/demo";
import { uid, fmtDate } from "../../../shared/utils/helpers";

const GROUPS = [
  { key: "today", label: "Today" },
  { key: "tomorrow", label: "Tomorrow" },
  { key: "upcoming", label: "Upcoming" },
];

export default function TasksPage({ toast }) {
  const [tasks, setTasks] = useState(DEMO_TASKS);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    title: "",
    priority: "medium",
    due: new Date().toISOString().slice(0, 10),
    group: "today",
    note: "",
    done: false,
  });

  const f = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const openAdd = () => {
    setForm({
      title: "",
      priority: "medium",
      due: new Date().toISOString().slice(0, 10),
      group: "today",
      note: "",
      done: false,
    });
    setModal({ t: "add" });
  };
  const openEdit = (t) => {
    setForm({ ...t });
    setModal({ t: "edit", d: t });
  };
  const openView = (t) => setModal({ t: "view", d: t });

  const save = () => {
    if (!form.title) return;
    if (modal.t === "add") {
      setTasks((ts) => [...ts, { ...form, id: uid() }]);
      toast("Task added ✓");
    } else {
      setTasks((ts) =>
        ts.map((t) => (t.id === modal.d.id ? { ...form, id: t.id } : t)),
      );
      toast("Updated ✓");
    }
    setModal(null);
  };

  const toggle = (id) =>
    setTasks((ts) =>
      ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  const del = (id) => {
    setTasks((ts) => ts.filter((t) => t.id !== id));
    setModal(null);
    toast("Deleted");
  };

  const done = tasks.filter((t) => t.done).length;
  const pct = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;

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
          Tasks
        </h2>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div
            style={{
              padding: "6px 14px",
              borderRadius: 12,
              background: "rgba(124,58,237,.15)",
              border: "1px solid rgba(124,58,237,.3)",
              fontSize: 12,
              color: "#c4b5fd",
            }}
          >
            🔥 5 day streak
          </div>
          <Btn onClick={openAdd}>+ Add Task</Btn>
        </div>
      </div>

      {/* Progress bar */}
      <Glass style={{ padding: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 13, color: C.textMid }}>
            Overall Progress
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
            {pct}% · {done}/{tasks.length} done
          </span>
        </div>
        <div
          style={{
            height: 8,
            background: "rgba(255,255,255,.07)",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: "100%",
              background: `linear-gradient(90deg,${C.violet},${C.violetLight})`,
              borderRadius: 4,
              transition: "width .5s",
            }}
          />
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
              "Prioritize tasks",
              "Focus for today",
              "Create study plan",
              "Break down tasks",
            ].map((x, i) => (
              <Btn key={i} variant="ai" small>
                {x}
              </Btn>
            ))}
          </div>
        </div>
      </Glass>

      {/* Task groups */}
      {GROUPS.map((g) => {
        const gt = tasks.filter((t) => t.group === g.key);
        if (!gt.length) return null;
        return (
          <div key={g.key}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 13, color: C.textMid, fontWeight: 600 }}>
                {g.label}
              </span>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(255,255,255,.06)",
                }}
              />
              <span style={{ fontSize: 11, color: C.textDim }}>
                {gt.filter((t) => !t.done).length} left
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {gt.map((task) => (
                <Glass
                  key={task.id}
                  className="hov-card"
                  onClick={() => openView(task)}
                  style={{
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    opacity: task.done ? 0.55 : 1,
                    transition: "all .2s",
                    cursor: "pointer",
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle(task.id);
                    }}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 7,
                      border: task.done
                        ? "none"
                        : "2px solid rgba(255,255,255,.2)",
                      background: task.done ? C.green : "transparent",
                      cursor: "pointer",
                      fontSize: 12,
                      color: "#fff",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {task.done ? "✓" : ""}
                  </button>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 13,
                        color: C.text,
                        textDecoration: task.done ? "line-through" : "none",
                      }}
                    >
                      {task.title}
                    </div>
                    {task.note && (
                      <div
                        style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}
                      >
                        {task.note}
                      </div>
                    )}
                  </div>
                  <Badge
                    label={PRI_CFG[task.priority].label}
                    color={PRI_CFG[task.priority].color}
                  />
                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(task);
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
                      onClick={(e) => {
                        e.stopPropagation();
                        del(task.id);
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
                </Glass>
              ))}
            </div>
          </div>
        );
      })}

      {/* Add / Edit Modal */}
      {(modal?.t === "add" || modal?.t === "edit") && (
        <Modal
          title={modal.t === "add" ? "New Task" : "Edit Task"}
          onClose={() => setModal(null)}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <FInput
              label="Task Title"
              value={form.title}
              onChange={(v) => f("title", v)}
              placeholder="What needs to be done?"
              required
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <FSelect
                label="Priority"
                value={form.priority}
                onChange={(v) => f("priority", v)}
                options={[
                  { value: "high", label: "🔴 High" },
                  { value: "medium", label: "🟡 Medium" },
                  { value: "low", label: "🟢 Low" },
                ]}
              />
              <FSelect
                label="Group"
                value={form.group}
                onChange={(v) => f("group", v)}
                options={[
                  { value: "today", label: "Today" },
                  { value: "tomorrow", label: "Tomorrow" },
                  { value: "upcoming", label: "Upcoming" },
                ]}
              />
            </div>
            <FInput
              label="Due Date"
              type="date"
              value={form.due}
              onChange={(v) => f("due", v)}
            />
            <FInput
              label="Note (optional)"
              value={form.note}
              onChange={(v) => f("note", v)}
              placeholder="Any details..."
            />
            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={save} disabled={!form.title}>
                {modal.t === "add" ? "Add Task" : "Save Changes"}
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
          title={modal.d.title}
          onClose={() => setModal(null)}
          onEdit={() => openEdit(modal.d)}
          onDelete={() => del(modal.d.id)}
        >
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 12,
            }}
          >
            <Badge
              label={PRI_CFG[modal.d.priority].label}
              color={PRI_CFG[modal.d.priority].color}
            />
            <Badge label={modal.d.group} color={C.violet} />
            <Badge
              label={modal.d.done ? "✓ Completed" : "Pending"}
              color={modal.d.done ? C.green : C.yellow}
            />
          </div>
          <div style={{ fontSize: 13, color: C.textMid, marginBottom: 12 }}>
            Due: {fmtDate(modal.d.due)}
          </div>
          {modal.d.note && (
            <div
              style={{
                padding: 14,
                background: "rgba(255,255,255,.03)",
                borderRadius: 10,
                fontSize: 13,
                color: C.textMid,
                marginBottom: 14,
              }}
            >
              {modal.d.note}
            </div>
          )}
          <Btn
            variant="ghost"
            onClick={() => {
              toggle(modal.d.id);
              setModal(null);
            }}
          >
            {modal.d.done ? "↩ Mark Incomplete" : "✓ Mark Complete"}
          </Btn>
        </ViewModal>
      )}
    </div>
  );
}
