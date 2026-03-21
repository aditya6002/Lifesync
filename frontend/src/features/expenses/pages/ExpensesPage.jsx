// src/features/expenses/pages/ExpensesPage.tsx
import { useState, useMemo } from "react";
import { C, FONTS } from "../../../shared/styles/tokens";
import {
  Glass,
  Btn,
  FInput,
  FSelect,
  InlineLoader,
} from "../../../shared/components/ui/Atoms";
import { Modal, ViewModal, Confirm } from "../../../shared/components/ui/Modal";
import {
  BarChart,
  CategoryBars,
} from "../../../shared/components/charts/Charts";
import { PageSkeleton } from "../../../shared/components/ui/GlobalLoader";
import { fmtDate, today, uid } from "../../../shared/utils/helpers";

// ── demo seed ──────────────────────────────────────────────
const SEED = [
  // March 2026
  {
    id: "e1",
    name: "Zomato Order",
    cat: "Food",
    amount: -340,
    date: "2026-03-11",
    note: "Late night dinner",
    icon: "🍜",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "e2",
    name: "Metro Card",
    cat: "Travel",
    amount: -200,
    date: "2026-03-10",
    note: "Monthly pass",
    icon: "🚇",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "e3",
    name: "Pocket Money",
    cat: "Income",
    amount: 3000,
    date: "2026-03-10",
    note: "From dad",
    icon: "💰",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "e4",
    name: "Notion Pro",
    cat: "Study",
    amount: -299,
    date: "2026-03-09",
    note: "Annual subscription",
    icon: "📚",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "e5",
    name: "Gym Membership",
    cat: "Health",
    amount: -800,
    date: "2026-03-08",
    note: "Monthly fee",
    icon: "🏋️",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "e6",
    name: "Movie Ticket",
    cat: "Entertainment",
    amount: -280,
    date: "2026-03-07",
    note: "With friends",
    icon: "🎬",
    userId: "u1",
    createdAt: "",
  },
  // February 2026
  {
    id: "e7",
    name: "Swiggy Order",
    cat: "Food",
    amount: -420,
    date: "2026-02-28",
    note: "Weekend dinner",
    icon: "🍜",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "e8",
    name: "Airtel Recharge",
    cat: "Other",
    amount: -299,
    date: "2026-02-25",
    note: "Monthly plan",
    icon: "📦",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "e9",
    name: "Part-time stipend",
    cat: "Income",
    amount: 5000,
    date: "2026-02-20",
    note: "Feb stipend",
    icon: "💰",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "e10",
    name: "Book: Clean Code",
    cat: "Study",
    amount: -499,
    date: "2026-02-15",
    note: "Programming book",
    icon: "📚",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "e11",
    name: "Medicine",
    cat: "Health",
    amount: -150,
    date: "2026-02-10",
    note: "Paracetamol",
    icon: "🏋️",
    userId: "u1",
    createdAt: new Date(),
  },
  {
    id: "e12",
    name: "Train Ticket",
    cat: "Travel",
    amount: -380,
    date: "2026-02-05",
    note: "Home visit",
    icon: "🚇",
    userId: "u1",
    createdAt: "",
  },
  // January 2026
  {
    id: "e13",
    name: "New Year dinner",
    cat: "Food",
    amount: -650,
    date: "2026-01-01",
    note: "Restaurant",
    icon: "🍜",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "e14",
    name: "Monthly allowance",
    cat: "Income",
    amount: 3000,
    date: "2026-01-05",
    note: "From parents",
    icon: "💰",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "e15",
    name: "Coursera Course",
    cat: "Study",
    amount: -1299,
    date: "2026-01-12",
    note: "ML course",
    icon: "📚",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "e16",
    name: "Bus pass",
    cat: "Travel",
    amount: -200,
    date: "2026-01-15",
    note: "",
    icon: "🚇",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "e17",
    name: "T-shirt",
    cat: "Shopping",
    amount: -599,
    date: "2026-01-20",
    note: "Sale purchase",
    icon: "🛍️",
    userId: "u1",
    createdAt: "",
  },
  // December 2025
  {
    id: "e18",
    name: "Christmas gift",
    cat: "Shopping",
    amount: -1200,
    date: "2025-12-24",
    note: "For family",
    icon: "🛍️",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "e19",
    name: "Freelance project",
    cat: "Income",
    amount: 8000,
    date: "2025-12-15",
    note: "Web dev project",
    icon: "💰",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "e20",
    name: "Restaurant dinner",
    cat: "Food",
    amount: -780,
    date: "2025-12-10",
    note: "Birthday party",
    icon: "🍜",
    userId: "u1",
    createdAt: "",
  },
];

const CAT_CFG = {
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
  "Shopping",
  "Income",
  "Other",
];

// ── Month helpers ──────────────────────────────────────────
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
  const d = new Date(y, m - 2, 1);
  return monthKey(d);
}
function nextMonth(key) {
  const [y, m] = key.split("-").map(Number);
  const d = new Date(y, m, 1);
  return monthKey(d);
}
const CURRENT_MONTH = monthKey(new Date());

// ── Empty form ─────────────────────────────────────────────
const emptyForm = () => ({
  name: "",
  cat: "Food",
  amount: 0,
  date: today(),
  note: "",
  type: "expense" | "income",
});

// ══════════════════════════════════════════════════════════
export default function ExpensesPage() {
  const [expenses, setExpenses] = useState(SEED);
  const [activeMonth, setActiveMonth] = useState(CURRENT_MONTH);
  const [catFilter, setCatFilter] = useState("All");
  const [type, _] = useState("expense");
  const [modal, setModal] = useState({ type: "" });
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);

  const sf = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  // ── Month list from data (+ current month always present) ─
  const monthList = useMemo(() => {
    const keys = new Set(expenses.map((e) => e.date.slice(0, 7)));
    keys.add(CURRENT_MONTH);
    return [...keys].sort((a, b) => b.localeCompare(a)); // newest first
  }, [expenses]);

  // ── Filtered expenses for active month ────────────────────
  const monthExpenses = useMemo(
    () => expenses.filter((e) => e.date.startsWith(activeMonth)),
    [expenses, activeMonth],
  );

  const filtered =
    catFilter === "All"
      ? monthExpenses
      : monthExpenses.filter((e) => e.cat === catFilter);

  const total = monthExpenses
    .filter((e) => e.amount < 0)
    .reduce((s, e) => s + Math.abs(e.amount), 0);
  const income = monthExpenses
    .filter((e) => e.amount > 0)
    .reduce((s, e) => s + e.amount, 0);
  const balance = income - total;

  // ── Is current month? ──────────────────────────────────────
  const isCurrentMonth = activeMonth === CURRENT_MONTH;

  // ── CRUD ──────────────────────────────────────────────────
  const openAdd = () => {
    setForm({
      ...emptyForm(),
      date: isCurrentMonth ? today() : `${activeMonth}-01`,
    });
    setModal({ type: "add" });
  };
  const openEdit = (e) => {
    setForm({
      name: e.name,
      cat: e.cat,
      amount: Math.abs(e.amount),
      date: e.date,
      note: e.note ?? "",
      type: e.amount > 0 ? "income" : "expense",
    });
    setModal({ type: "edit", data: e });
  };
  const openView = (e) => setModal({ type: "view", data: e });

  const handleSave = async () => {
    if (!form.name || !form.amount) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600)); // simulate API
    const amt =
      form.type === "income" ? Math.abs(form.amount) : -Math.abs(form.amount);
    const icon = CAT_CFG[form.cat]?.icon ?? "📦";
    if (modal.type === "add") {
      const newExp = {
        ...form,
        id: uid(),
        amount: amt,
        icon,
        userId: "u1",
        createdAt: new Date().toISOString(),
      };
      setExpenses((p) => [newExp, ...p]);
      setActiveMonth(newExp.date.slice(0, 7));
    } else if (modal.type === "edit" && modal.data) {
      setExpenses((p) =>
        p.map((e) =>
          e.id === modal.data.id ? { ...e, ...form, amount: amt, icon } : e,
        ),
      );
    }
    setSaving(false);
    setModal({ type });
  };

  const handleDelete = async (id) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    setExpenses((p) => p.filter((e) => e.id !== id));
    setSaving(false);
    setModal({ type });
  };

  return (
    <div
      className="screen-in"
      style={{ display: "flex", flexDirection: "column", gap: 18 }}
    >
      {/* ── PAGE HEADER ── */}
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
          Expense Manager
        </h2>
        <Btn onClick={openAdd}>+ Add Expense</Btn>
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
          {/* Prev button */}
          <button
            onClick={() => setActiveMonth(prevMonth(activeMonth))}
            disabled={activeMonth === monthList[monthList.length - 1]}
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "rgba(255,255,255,.05)",
              border: `1px solid ${C.glassBorder}`,
              color:
                activeMonth === monthList[monthList.length - 1]
                  ? C.textDim
                  : C.textMid,
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

          {/* Month label + quick month chips */}
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
            {/* Scrollable month chips */}
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

          {/* Next button */}
          <button
            onClick={() => setActiveMonth(nextMonth(activeMonth))}
            disabled={activeMonth === CURRENT_MONTH}
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "rgba(255,255,255,.05)",
              border: `1px solid ${C.glassBorder}`,
              color: activeMonth === CURRENT_MONTH ? C.textDim : C.textMid,
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

      {/* ── SUMMARY CARDS ── */}
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
            v: `₹${balance.toLocaleString()}`,
            c: balance >= 0 ? C.green : C.red,
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

      {/* ── CHARTS (only show if has data) ── */}
      {monthExpenses.length > 0 && (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <Glass style={{ padding: 18 }}>
            <div style={{ fontSize: 12, color: C.textDim, marginBottom: 12 }}>
              Monthly Spending
            </div>
            <BarChart currentTotal={total} date={activeMonth} />
          </Glass>
          <Glass style={{ padding: 18 }}>
            <div style={{ fontSize: 12, color: C.textDim, marginBottom: 12 }}>
              By Category
            </div>
            <CategoryBars expenses={monthExpenses} />
          </Glass>
        </div>
      )}

      {/* ── AI INSIGHT ── */}
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
              AI Insight — {monthLabel(activeMonth)}
            </div>
            <div style={{ fontSize: 12, color: C.textMid, marginTop: 3 }}>
              {total > 0
                ? `You spent ₹${total.toLocaleString()} this month. ${total > 3000 ? "That's above your usual budget — consider reviewing Food & Entertainment." : "You're within budget Great work."}`
                : "No expenses recorded for this month yet."}
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 10,
                flexWrap: "wrap",
              }}
            >
              {["Get saving tips", "Compare months", "Set budget"].map(
                (x, i) => (
                  <Btn key={i} variant="ai" small>
                    {x}
                  </Btn>
                ),
              )}
            </div>
          </div>
        </div>
      </Glass>

      {/* ── CATEGORY FILTER + LIST ── */}
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
              onClick={() => setCatFilter(c)}
              style={{
                padding: "5px 13px",
                borderRadius: 20,
                fontSize: 12,
                cursor: "pointer",
                background:
                  catFilter === c ? C.violet : "rgba(255,255,255,.05)",
                border: catFilter === c ? "none" : `1px solid ${C.glassBorder}`,
                color: catFilter === c ? "#fff" : C.textMid,
                transition: "all .15s",
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>◈</div>
            <div style={{ fontSize: 13, color: C.textDim }}>
              No expenses for {monthLabel(activeMonth)}
              {catFilter == "All" ? ` in ${catFilter}` : ""}
            </div>
            <div style={{ marginTop: 14 }}>
              <Btn onClick={openAdd}>+ Add Expense</Btn>
            </div>
          </div>
        )}

        {/* Expense rows */}
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
          ))}
        </div>
      </Glass>

      {/* ── ADD / EDIT MODAL ── */}
      {(modal.type === "add" || modal.type === "edit") && (
        <Modal
          title={modal.type === "add" ? "Add Expense" : "Edit Expense"}
          onClose={() => setModal({ type })}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Type toggle */}
            <div style={{ display: "flex", gap: 8 }}>
              {["expense", "income"].map((tp) => (
                <button
                  key={tp}
                  onClick={() => sf("type", tp)}
                  style={{
                    flex: 1,
                    padding: "9px",
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
              onChange={(v) => sf("name", v)}
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
                value={String(form.amount || "")}
                onChange={(v) => sf("amount", Number(v))}
                placeholder="0"
                required
              />
              <FSelect
                label="Category"
                value={form.cat}
                onChange={(v) => sf("cat", v)}
                options={Object.keys(CAT_CFG)}
              />
            </div>

            {/* Date with month context hint */}
            <div>
              <FInput
                label="Date"
                type="date"
                value={form.date}
                onChange={(v) => sf("date", v)}
              />
              {form.date && !form.date.startsWith(activeMonth) && (
                <div style={{ fontSize: 11, color: C.yellow, marginTop: 4 }}>
                  ⚠ This date is in {monthLabel(form.date.slice(0, 7))} — it
                  will appear there.
                </div>
              )}
            </div>

            <FInput
              label="Note (optional)"
              value={form.note}
              onChange={(v) => sf("note", v)}
              placeholder="Any note..."
            />

            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button
                onClick={handleSave}
                disabled={!form.name || !form.amount || saving}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 22px",
                  borderRadius: 10,
                  background:
                    saving || !form.name || !form.amount
                      ? "rgba(124,58,237,.4)"
                      : `linear-gradient(135deg,${C.violet},${C.violetLight})`,
                  border: "none",
                  color: "#fff",
                  cursor:
                    saving || !form.name || !form.amount
                      ? "not-allowed"
                      : "pointer",
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                {saving ? (
                  <>
                    <InlineLoader size={14} color="#fff" /> Saving...
                  </>
                ) : modal.type === "add" ? (
                  "Add Expense"
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
      {modal.type === "view" && modal.data && (
        <ViewModal
          title={modal.data.name}
          onClose={() => setModal({ type })}
          onEdit={() => openEdit(modal.data)}
          onDelete={() => setModal({ type: "confirm", data: modal.data })}
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

      {/* ── DELETE CONFIRM ── */}
      {modal.type === "confirm" && modal.data && (
        <Confirm
          message={`Delete "${modal.data.name}" (₹${Math.abs(modal.data.amount).toLocaleString()})? This cannot be undone.`}
          onConfirm={() => handleDelete(modal.data.id)}
          onCancel={() => setModal({ type })}
        />
      )}
    </div>
  );
}
