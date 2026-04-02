import { useState, useMemo, useReducer } from "react";
import { SEED } from "../store/features/expensesSlice";

// ── Helpers ───────────────────────────────────────────────────
const today = () => new Date().toISOString().slice(0, 10);
const fmtDate = (d) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
const uid = () => Math.random().toString(36).slice(2, 9);
const monthKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
const monthLabel = (k) => {
  const [y, m] = k.split("-");
  return new Date(+y, +m - 1, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
};
const prevMonth = (k) => {
  const [y, m] = k.split("-").map(Number);
  return monthKey(new Date(y, m - 2, 1));
};
const nextMonth = (k) => {
  const [y, m] = k.split("-").map(Number);
  return monthKey(new Date(y, m, 1));
};
const CURRENT_MONTH = monthKey(new Date());

// ── Config ────────────────────────────────────────────────────
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
const CATS = ["All", ...Object.keys(CAT_CFG)];

// ── Reducer ───────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [action.payload, ...state];
    case "UPDATE":
      return state.map((e) =>
        e.id === action.id ? { ...e, ...action.payload } : e,
      );
    case "DELETE":
      return state.filter((e) => e.id !== action.id);
    default:
      return state;
  }
}

// ── Tokens ────────────────────────────────────────────────────
const C = {
  glass: "rgba(255,255,255,.06)",
  glassBorder: "rgba(255,255,255,.1)",
  text: "#f1f5f9",
  textMid: "#94a3b8",
  textDim: "#475569",
  violet: "#7c3aed",
  violetL: "#a78bfa",
  green: "#22c55e",
  red: "#ef4444",
  yellow: "#f59e0b",
};

// ── UI Primitives ─────────────────────────────────────────────
const Glass = ({ children, style }) => (
  <div
    style={{
      background: C.glass,
      border: `1px solid ${C.glassBorder}`,
      borderRadius: 16,
      ...style,
    }}
  >
    {children}
  </div>
);

const Btn = ({ children, onClick, disabled, variant = "primary", small }) => {
  const base = {
    padding: small ? "5px 12px" : "9px 20px",
    borderRadius: 10,
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 600,
    fontSize: small ? 12 : 13,
    transition: "all .15s",
  };
  const styles = {
    primary: {
      background: `linear-gradient(135deg,${C.violet},${C.violetL})`,
      color: "#fff",
      opacity: disabled ? 0.5 : 1,
    },
    ghost: {
      background: "rgba(255,255,255,.05)",
      border: `1px solid ${C.glassBorder}`,
      color: C.textMid,
    },
    ai: {
      background: "rgba(124,58,237,.15)",
      border: "1px solid rgba(124,58,237,.3)",
      color: C.violetL,
    },
    danger: {
      background: "rgba(239,68,68,.12)",
      border: "1px solid rgba(239,68,68,.3)",
      color: C.red,
    },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ ...base, ...styles[variant] }}
    >
      {children}
    </button>
  );
};

const FInput = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label
      style={{
        fontSize: 11,
        color: C.textDim,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: ".05em",
      }}
    >
      {label}
      {required && <span style={{ color: C.red }}> *</span>}
    </label>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={{
        background: "rgba(255,255,255,.06)",
        border: `1px solid ${C.glassBorder}`,
        borderRadius: 10,
        padding: "10px 14px",
        color: C.text,
        fontSize: 14,
        outline: "none",
        width: "100%",
        boxSizing: "border-box",
        colorScheme: "dark",
      }}
    />
  </div>
);

const FSelect = ({ label, value, onChange, options }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label
      style={{
        fontSize: 11,
        color: C.textDim,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: ".05em",
      }}
    >
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        background: "#1e1b2e",
        border: `1px solid ${C.glassBorder}`,
        borderRadius: 10,
        padding: "10px 14px",
        color: C.text,
        fontSize: 14,
        outline: "none",
        width: "100%",
        boxSizing: "border-box",
        colorScheme: "dark",
      }}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {CAT_CFG[o]?.icon} {o}
        </option>
      ))}
    </select>
  </div>
);

// ── Bar Chart ─────────────────────────────────────────────────
// FIX: Window of 6 months ending at activeMonth (follows navigation)
// activeMonth is always the rightmost/tallest highlighted bar
const BarChart = ({ expenses, activeMonth }) => {
  const months = useMemo(() => {
    const [y, m] = activeMonth.split("-").map(Number);
    const out = [];
    for (let i = 5; i >= 0; i--) {
      out.push(monthKey(new Date(y, m - 1 - i, 1)));
    }
    return out; // [oldest ... activeMonth]
  }, [activeMonth]);

  const data = months.map((mk) => ({
    label: new Date(`${mk}-01`).toLocaleDateString("en-IN", { month: "short" }),
    total: (expenses || [])
      .filter((e) => e.date.startsWith(mk) && e.amount < 0)
      .reduce((s, e) => s + Math.abs(e.amount), 0),
    active: mk === activeMonth,
  }));

  const max = Math.max(...data.map((d) => d.total), 1);

  return (
    <div
      style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 110 }}
    >
      {data.map((d, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* Amount above bar */}
          <div
            style={{
              fontSize: 9,
              color: d.active ? C.violetL : C.textDim,
              height: 14,
              display: "flex",
              alignItems: "center",
              fontWeight: d.active ? 700 : 400,
            }}
          >
            {d.total > 0
              ? `₹${d.total >= 1000 ? (d.total / 1000).toFixed(1) + "k" : d.total}`
              : ""}
          </div>
          {/* Bar */}
          <div
            title={`${monthLabel(months[i])}: ₹${d.total.toLocaleString()}`}
            style={{
              width: "100%",
              borderRadius: "4px 4px 0 0",
              height: Math.max((d.total / max) * 72, d.total > 0 ? 4 : 2),
              background: d.active
                ? C.violet
                : d.total > 0
                  ? "rgba(124,58,237,.4)"
                  : "rgba(255,255,255,.07)",
              transition: "height .35s ease, background .2s",
            }}
          />
          {/* Month label */}
          <div
            style={{
              fontSize: 9,
              color: d.active ? C.violetL : C.textDim,
              fontWeight: d.active ? 700 : 400,
              marginTop: 2,
            }}
          >
            {d.label}
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Category bars ─────────────────────────────────────────────
const CategoryBars = ({ expenses }) => {
  const cats = useMemo(() => {
    const map = {};
    (expenses || [])
      .filter((e) => e.amount < 0)
      .forEach((e) => {
        map[e.cat] = (map[e.cat] || 0) + Math.abs(e.amount);
      });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [expenses]);

  const max = Math.max(...cats.map((c) => c[1]), 1);
  if (!cats.length)
    return (
      <div style={{ fontSize: 12, color: C.textDim, padding: "20px 0" }}>
        No data
      </div>
    );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
      {cats.map(([cat, val]) => (
        <div key={cat}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11,
              marginBottom: 4,
            }}
          >
            <span style={{ color: C.textMid }}>
              {CAT_CFG[cat]?.icon} {cat}
            </span>
            <span style={{ color: C.text, fontWeight: 600 }}>
              ₹{val.toLocaleString()}
            </span>
          </div>
          <div
            style={{
              height: 6,
              borderRadius: 3,
              background: "rgba(255,255,255,.06)",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 3,
                width: `${(val / max) * 100}%`,
                background: CAT_CFG[cat]?.color ?? C.violet,
                transition: "width .35s ease",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Modal Overlay ─────────────────────────────────────────────
const Overlay = ({ children, onClose }) => (
  <div
    onClick={onClose}
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 100,
      background: "rgba(0,0,0,.75)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: "#1a1625",
        border: `1px solid ${C.glassBorder}`,
        borderRadius: 20,
        padding: 24,
        width: "100%",
        maxWidth: 420,
        maxHeight: "90vh",
        overflowY: "auto",
      }}
    >
      {children}
    </div>
  </div>
);

const Pill = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "5px 13px",
      borderRadius: 20,
      fontSize: 12,
      cursor: "pointer",
      background: active ? C.violet : "rgba(255,255,255,.05)",
      border: active ? "none" : `1px solid ${C.glassBorder}`,
      color: active ? "#fff" : C.textMid,
      transition: "all .15s",
      flexShrink: 0,
    }}
  >
    {label}
  </button>
);

// ══════════════════════════════════════════════════════════════
export default function ExpensesPage() {
  const [expenses, dispatch] = useReducer(reducer, SEED);
  const [activeMonth, setActiveMonth] = useState(CURRENT_MONTH);
  const [catFilter, setCatFilter] = useState("All");
  const [modal, setModal] = useState({ type: null, data: null });

  const emptyForm = {
    type: "expense",
    name: "",
    amount: "",
    cat: "Food",
    date: today(),
    note: "",
  };
  const [form, setForm] = useState(emptyForm);

  const sf = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const isValid = form.name.trim() && Number(form.amount) > 0;

  const openAdd = () => {
    setForm({
      ...emptyForm,
      date: activeMonth === CURRENT_MONTH ? today() : `${activeMonth}-01`,
    });
    setModal({ type: "add" });
  };
  const openEdit = (e) => {
    setForm({
      type: e.amount > 0 ? "income" : "expense",
      name: e.name,
      amount: Math.abs(e.amount),
      cat: e.cat,
      date: e.date,
      note: e.note || "",
    });
    setModal({ type: "edit", data: e });
  };
  const openView = (e) => setModal({ type: "view", data: e });
  const openConfirm = (e) => setModal({ type: "confirm", data: e });
  const closeModal = () => setModal({ type: null, data: null });

  const saveExpense = () => {
    if (!isValid) return;
    const amt =
      form.type === "income"
        ? Math.abs(Number(form.amount))
        : -Math.abs(Number(form.amount));
    if (modal.type === "add") {
      dispatch({
        type: "ADD",
        payload: {
          id: uid(),
          name: form.name,
          cat: form.cat,
          amount: amt,
          date: form.date,
          note: form.note,
        },
      });
    } else {
      dispatch({
        type: "UPDATE",
        id: modal.data.id,
        payload: {
          name: form.name,
          cat: form.cat,
          amount: amt,
          date: form.date,
          note: form.note,
        },
      });
    }
    closeModal();
  };

  const removeExpense = (id) => {
    dispatch({ type: "DELETE", id });
    closeModal();
  };

  // ── FIX 1: Ascending sort → oldest left, newest right ────────
  const monthList = useMemo(() => {
    const keys = new Set((expenses || []).map((e) => e.date.slice(0, 7)));
    keys.add(CURRENT_MONTH);
    return [...keys].sort((a, b) => a.localeCompare(b)); // ascending ✅
  }, [expenses]);

  const oldestMonth = monthList[0]; // ◀ disabled here (first in ascending list)

  const monthExpenses = useMemo(
    () => (expenses || []).filter((e) => e.date.startsWith(activeMonth)),
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
  const isCurrentMonth = activeMonth === CURRENT_MONTH;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 18,
        padding: "4px 0",
      }}
    >
      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <h2 style={{ fontSize: 22, color: C.text, margin: 0, fontWeight: 700 }}>
          Expense Manager
        </h2>
        <Btn onClick={openAdd}>+ Add Expense</Btn>
      </div>

      {/* ── MONTH NAVIGATOR ────────────────────────────────────── */}
      <Glass style={{ padding: "12px 16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          {/* ◀ — disabled at oldestMonth (index 0 of ascending list) */}
          <button
            onClick={() => setActiveMonth(prevMonth(activeMonth))}
            disabled={activeMonth === oldestMonth}
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              flexShrink: 0,
              fontSize: 16,
              background: "rgba(255,255,255,.05)",
              border: `1px solid ${C.glassBorder}`,
              color: activeMonth === oldestMonth ? C.textDim : C.textMid,
              cursor: activeMonth === oldestMonth ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: activeMonth === oldestMonth ? 0.4 : 1,
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
            <div style={{ fontSize: 16, color: C.text, fontWeight: 700 }}>
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

            {/* Pills: ascending → oldest on left, newest on right */}
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
                <Pill
                  key={mk}
                  active={activeMonth === mk}
                  onClick={() => setActiveMonth(mk)}
                  label={new Date(`${mk}-01`).toLocaleDateString("en-IN", {
                    month: "short",
                    year: "2-digit",
                  })}
                />
              ))}
            </div>
          </div>

          {/* ▶ — disabled at CURRENT_MONTH */}
          <button
            onClick={() => setActiveMonth(nextMonth(activeMonth))}
            disabled={activeMonth === CURRENT_MONTH}
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              flexShrink: 0,
              fontSize: 16,
              background: "rgba(255,255,255,.05)",
              border: `1px solid ${C.glassBorder}`,
              color: activeMonth === CURRENT_MONTH ? C.textDim : C.textMid,
              cursor: activeMonth === CURRENT_MONTH ? "not-allowed" : "pointer",
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

      {/* ── SUMMARY CARDS ──────────────────────────────────────── */}
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
            v: `${balance < 0 ? "-" : ""}₹${Math.abs(balance).toLocaleString()}`,
            c: balance >= 0 ? C.green : C.red,
          },
        ].map((s, i) => (
          <Glass key={i} style={{ padding: "14px 16px" }}>
            <div style={{ fontSize: 11, color: C.textDim }}>{s.l}</div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: s.c,
                marginTop: 4,
              }}
            >
              {s.v}
            </div>
          </Glass>
        ))}
      </div>

      {/* ── CHARTS ─────────────────────────────────────────────── */}
      {monthExpenses.length > 0 && (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <Glass style={{ padding: 18 }}>
            <div style={{ fontSize: 12, color: C.textDim, marginBottom: 10 }}>
              Monthly Spending
            </div>
            {/* FIX 2: pass activeMonth so window follows navigation */}
            <BarChart expenses={expenses} activeMonth={activeMonth} />
          </Glass>
          <Glass style={{ padding: 18 }}>
            <div style={{ fontSize: 12, color: C.textDim, marginBottom: 10 }}>
              By Category
            </div>
            <CategoryBars expenses={monthExpenses} />
          </Glass>
        </div>
      )}

      {/* ── AI INSIGHT ─────────────────────────────────────────── */}
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
                ? `You spent ₹${total.toLocaleString()} this month. ${total > 5000 ? "That's above your usual budget — consider reviewing Food & Entertainment." : "You're within budget. Great work!"}${income > 0 ? ` Savings rate: ${Math.round(((income - total) / income) * 100)}%.` : ""}`
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
              {["Get saving tips", "Compare months", "Set budget"].map((x) => (
                <Btn key={x} variant="ai" small>
                  {x}
                </Btn>
              ))}
            </div>
          </div>
        </div>
      </Glass>

      {/* ── CATEGORY FILTER + LIST ─────────────────────────────── */}
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
            <Pill
              key={c}
              active={catFilter === c}
              onClick={() => setCatFilter(c)}
              label={c}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>◈</div>
            <div style={{ fontSize: 13, color: C.textDim }}>
              No expenses for {monthLabel(activeMonth)}
              {catFilter !== "All" ? ` in ${catFilter}` : ""}
            </div>
            <div style={{ marginTop: 14 }}>
              <Btn onClick={openAdd}>+ Add Expense</Btn>
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((e) => (
            <div
              key={e.id}
              onClick={() => openView(e)}
              onMouseEnter={(ev) =>
                (ev.currentTarget.style.background = "rgba(255,255,255,.07)")
              }
              onMouseLeave={(ev) =>
                (ev.currentTarget.style.background = "rgba(255,255,255,.03)")
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                borderRadius: 12,
                cursor: "pointer",
                background: "rgba(255,255,255,.03)",
                border: `1px solid ${C.glassBorder}`,
                transition: "background .2s",
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  flexShrink: 0,
                  fontSize: 18,
                  background: (CAT_CFG[e.cat]?.color ?? C.textDim) + "22",
                  border: `1px solid ${CAT_CFG[e.cat]?.color ?? C.textDim}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {CAT_CFG[e.cat]?.icon ?? "📦"}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    color: C.text,
                    fontWeight: 500,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
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
                    openConfirm(e);
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

      {/* ── ADD / EDIT MODAL ───────────────────────────────────── */}
      {(modal.type === "add" || modal.type === "edit") && (
        <Overlay onClose={closeModal}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <div style={{ fontSize: 17, fontWeight: 700, color: C.text }}>
              {modal.type === "add" ? "Add Expense" : "Edit Expense"}
            </div>
            <button
              onClick={closeModal}
              style={{
                background: "none",
                border: "none",
                color: C.textMid,
                fontSize: 22,
                cursor: "pointer",
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 8 }}>
              {["expense", "income"].map((tp) => (
                <button
                  key={tp}
                  onClick={() => sf("type", tp)}
                  style={{
                    flex: 1,
                    padding: 9,
                    borderRadius: 10,
                    cursor: "pointer",
                    border:
                      form.type === tp ? "none" : `1px solid ${C.glassBorder}`,
                    background:
                      form.type === tp
                        ? tp === "income"
                          ? C.green
                          : C.violet
                        : "rgba(255,255,255,.04)",
                    color: "#fff",
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
                value={String(form.amount)}
                onChange={(v) => sf("amount", v)}
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
              <Btn onClick={saveExpense} disabled={!isValid}>
                {modal.type === "add" ? "Add Expense" : "Save Changes"}
              </Btn>
              <Btn variant="ghost" onClick={closeModal}>
                Cancel
              </Btn>
            </div>
          </div>
        </Overlay>
      )}

      {/* ── VIEW MODAL ─────────────────────────────────────────── */}
      {modal.type === "view" && modal.data && (
        <Overlay onClose={closeModal}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <div style={{ fontSize: 17, fontWeight: 700, color: C.text }}>
              {modal.data.name}
            </div>
            <button
              onClick={closeModal}
              style={{
                background: "none",
                border: "none",
                color: C.textMid,
                fontSize: 22,
                cursor: "pointer",
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
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
                fontSize: 28,
                background:
                  (CAT_CFG[modal.data.cat]?.color ?? C.textDim) + "22",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {CAT_CFG[modal.data.cat]?.icon}
            </div>
            <div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: modal.data.amount > 0 ? C.green : C.text,
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
                marginBottom: 16,
              }}
            >
              {modal.data.note}
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={() => openEdit(modal.data)}>✏️ Edit</Btn>
            <Btn variant="danger" onClick={() => openConfirm(modal.data)}>
              🗑 Delete
            </Btn>
            <Btn variant="ghost" onClick={closeModal}>
              Close
            </Btn>
          </div>
        </Overlay>
      )}

      {/* ── DELETE CONFIRM ─────────────────────────────────────── */}
      {modal.type === "confirm" && modal.data && (
        <Overlay onClose={closeModal}>
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🗑</div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: C.text,
                marginBottom: 8,
              }}
            >
              Delete Expense?
            </div>
            <div style={{ fontSize: 13, color: C.textMid, marginBottom: 24 }}>
              "{modal.data.name}" (₹
              {Math.abs(modal.data.amount).toLocaleString()}) will be
              permanently removed.
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <Btn
                variant="danger"
                onClick={() => removeExpense(modal.data.id)}
              >
                Yes, Delete
              </Btn>
              <Btn variant="ghost" onClick={closeModal}>
                Cancel
              </Btn>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
}
