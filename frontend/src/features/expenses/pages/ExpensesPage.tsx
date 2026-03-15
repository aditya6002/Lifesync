// src/features/expenses/pages/ExpensesPage.tsx
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
import {
  BarChart,
  CategoryBars,
} from "../../../shared/components/charts/Charts";
import { useExpenses } from "../expenses.context";
import { useExpenseForm } from "../hooks/useExpenseForm";
import { useOutletToast } from "../../../shared/hooks/useOutletToast";
import { fmtDate } from "../../../shared/utils/helpers";
import type { ExpenseCategory } from "../../../shared/types";

const CAT_CFG: Record<string, { icon: string; color: string }> = {
  Food: { icon: "🍜", color: "#f97316" },
  Travel: { icon: "🚇", color: "#3b82f6" },
  Study: { icon: "📚", color: "#a855f7" },
  Health: { icon: "🏋️", color: "#ec4899" },
  Entertainment: { icon: "🎬", color: "#6366f1" },
  Shopping: { icon: "🛍️", color: "#06b6d4" },
  Income: { icon: "💰", color: "#22c55e" },
  Other: { icon: "📦", color: "#475569" },
};
const CATS = [
  "All",
  "Food",
  "Travel",
  "Study",
  "Health",
  "Entertainment",
  "Income",
];

export default function ExpensesPage() {
  const toast = useOutletToast();
  const { expenses, create, update, remove, total, income } = useExpenses();
  const {
    modal,
    form,
    isValid,
    openAdd,
    openEdit,
    openView,
    closeModal,
    setField,
    buildAmount,
  } = useExpenseForm();
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All" ? expenses : expenses.filter((e) => e.cat === filter);

  const handleSave = async () => {
    const amt = buildAmount();
    const icon = CAT_CFG[form.cat]?.icon ?? "📦";
    if (modal.type === "add") {
      await create({ ...form, amount: amt });
      toast("Expense added ✓");
    } else if (modal.type === "edit" && modal.data) {
      await update(modal.data.id, { ...form, amount: amt });
      toast("Updated ✓");
    }
    closeModal();
  };

  const handleDelete = async (id: string) => {
    await remove(id);
    closeModal();
    toast("Deleted");
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div
      className="screen-in"
      style={{ display: "flex", flexDirection: "column", gap: 18 }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontFamily: FONTS.display, fontSize: 22, color: C.text }}>
          Expense Manager
        </h2>
        <div style={{ gap: 20, display: "flex", alignItems: "center" }}>
          <div
            style={{
              fontSize: 12,
              color: C.textDim,
              display: "flex",
              gap: 6,
              alignItems: "center",
            }}
          >
            <div className="">Prev</div>
            <div style={{ fontSize: 20 }}>
              {monthNames[new Date().getMonth()] +
                ", " +
                new Date().getFullYear()}
            </div>
            <div className="">Next</div>
          </div>
          <Btn onClick={openAdd}>+ Add Expense</Btn>
        </div>
      </div>

      {/* Summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 12,
        }}
      >
        {[
          { l: "Total Spent", v: `₹${total.toLocaleString()}`, c: C.red },
          { l: "Income", v: `₹${income.toLocaleString()}`, c: C.green },
          {
            l: "Balance",
            v: `₹${(income - total).toLocaleString()}`,
            c: income - total >= 0 ? C.green : C.red,
          },
        ].map((s, i) => (
          <Glass key={i} style={{ padding: 16 }}>
            <div style={{ fontSize: 11, color: C.textDim }}>{s.l}</div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: s.c,
                marginTop: 4,
                fontFamily: FONTS.display,
              }}
            >
              {s.v}
            </div>
          </Glass>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Glass style={{ padding: 18 }}>
          <div style={{ fontSize: 12, color: C.textDim, marginBottom: 12 }}>
            Monthly Spending
          </div>
          <BarChart currentTotal={total} />
        </Glass>
        <Glass style={{ padding: 18 }}>
          <div style={{ fontSize: 12, color: C.textDim, marginBottom: 12 }}>
            By Category
          </div>
          <CategoryBars expenses={expenses} />
        </Glass>
      </div>

      {/* AI Insight */}
      <Glass
        style={{
          padding: 16,
          background: "rgba(124,58,237,.1)",
          border: "1px solid rgba(124,58,237,.25)",
        }}
      >
        <div style={{ display: "flex", gap: 10 }}>
          <span style={{ fontSize: 20 }}>⟡</span>
          <div>
            <div style={{ fontSize: 13, color: "#c4b5fd", fontWeight: 600 }}>
              AI Insight
            </div>
            <div style={{ fontSize: 12, color: C.textMid, marginTop: 3 }}>
              You've spent ₹{total.toLocaleString()} this month. Meal-prepping
              3×/week could save ~₹400.
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 10,
                flexWrap: "wrap",
              }}
            >
              {["Get saving tips", "Set budget", "View trends"].map((x, i) => (
                <Btn key={i} variant="ai" small>
                  {x}
                </Btn>
              ))}
            </div>
          </div>
        </div>
      </Glass>

      {/* Filter + list */}
      <Glass style={{ padding: 18 }}>
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 14,
            flexWrap: "wrap",
          }}
        >
          {CATS.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              style={{
                padding: "5px 13px",
                borderRadius: 20,
                fontSize: 12,
                cursor: "pointer",
                background: filter === c ? C.violet : "rgba(255,255,255,.05)",
                border: filter === c ? "none" : `1px solid ${C.glassBorder}`,
                color: filter === c ? "#fff" : C.textMid,
                transition: "all .15s",
              }}
            >
              {c}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((e) => (
            <div
              key={e.id}
              className="hov-card"
              onClick={() => openView(e)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                borderRadius: 12,
                background: "rgba(255,255,255,.03)",
                border: `1px solid ${C.glassBorder}`,
                cursor: "pointer",
                transition: "all .2s",
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: (CAT_CFG[e.cat]?.color ?? C.textDim) + "22",
                  border: `1px solid ${CAT_CFG[e.cat]?.color ?? C.textDim}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  flexShrink: 0,
                }}
              >
                {e.icon ?? CAT_CFG[e.cat]?.icon ?? "📦"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>
                  {e.name}
                </div>
                <div style={{ fontSize: 11, color: C.textDim }}>
                  {e.cat} · {fmtDate(e.date)}
                  {e.note ? ` · ${e.note}` : ""}
                </div>
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: e.amount > 0 ? C.green : C.text,
                  flexShrink: 0,
                }}
              >
                {e.amount > 0 ? "+" : ""}₹{Math.abs(e.amount).toLocaleString()}
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
                    handleDelete(e.id);
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
          ))}
          {filtered.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: 30,
                color: C.textDim,
                fontSize: 13,
              }}
            >
              No expenses found.
            </div>
          )}
        </div>
      </Glass>

      {/* Add / Edit Modal */}
      {(modal.type === "add" || modal.type === "edit") && (
        <Modal
          title={modal.type === "add" ? "Add Expense" : "Edit Expense"}
          onClose={closeModal}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 8 }}>
              {(["expense", "income"] as const).map((tp) => (
                <button
                  key={tp}
                  onClick={() => setField("type", tp)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: 10,
                    border:
                      form.type === tp ? "none" : `1px solid ${C.glassBorder}`,
                    background:
                      form.type === tp
                        ? tp === "income"
                          ? C.green
                          : C.violet
                        : "rgba(255,255,255,.04)",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 13,
                    textTransform: "capitalize",
                  }}
                >
                  {tp}
                </button>
              ))}
            </div>
            <FInput
              label="Name"
              value={form.name}
              onChange={(v) => setField("name", v)}
              placeholder="e.g. Zomato Order"
              required
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <FInput
                label="Amount (₹)"
                type="number"
                value={String(form.amount)}
                onChange={(v) => setField("amount", Number(v))}
                placeholder="0"
                required
              />
              <FSelect
                label="Category"
                value={form.cat}
                onChange={(v) => setField("cat", v as ExpenseCategory)}
                options={Object.keys(CAT_CFG).filter((k) => k !== "Income")}
              />
            </div>
            <FInput
              label="Date"
              type="date"
              value={form.date}
              onChange={(v) => setField("date", v)}
            />
            <FInput
              label="Note (optional)"
              value={form.note ?? ""}
              onChange={(v) => setField("note", v)}
              placeholder="Any note..."
            />
            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={handleSave} disabled={!isValid}>
                {modal.type === "add" ? "Add Expense" : "Save Changes"}
              </Btn>
              <Btn variant="ghost" onClick={closeModal}>
                Cancel
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* View Modal */}
      {modal.type === "view" && modal.data && (
        <ViewModal
          title={modal.data.name}
          onClose={closeModal}
          onEdit={() => openEdit(modal.data!)}
          onDelete={() => handleDelete(modal.data!.id)}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background:
                  (CAT_CFG[modal.data.cat]?.color ?? C.textDim) + "22",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
              }}
            >
              {modal.data.icon ?? CAT_CFG[modal.data.cat]?.icon}
            </div>
            <div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: modal.data.amount > 0 ? C.green : C.text,
                  fontFamily: FONTS.display,
                }}
              >
                {modal.data.amount > 0 ? "+" : ""}₹
                {Math.abs(modal.data.amount).toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: C.textDim }}>
                {modal.data.cat} · {fmtDate(modal.data.date)}
              </div>
            </div>
          </div>
          {modal.data.note && (
            <div
              style={{
                padding: 14,
                background: "rgba(255,255,255,.03)",
                borderRadius: 10,
                fontSize: 13,
                color: C.textMid,
              }}
            >
              {modal.data.note}
            </div>
          )}
        </ViewModal>
      )}
    </div>
  );
}
