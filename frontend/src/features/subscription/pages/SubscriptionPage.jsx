// src/features/subscription/pages/SubscriptionPage.tsx
import { useState } from "react";
import { C, FONTS } from "../../../shared/styles/tokens";
import { Glass, Btn } from "../../../shared/components/ui/Atoms";
import { useSubscription, PLANS } from "../subscription.context";

const FEATURE_ROWS = [
  // Expenses
  {
    section: "💰 Expenses",
    key: "expensesPerMonth",
    label: "Expenses per month",
    type: "limit",
  },
  {
    section: "",
    key: "expenseHistory",
    label: "History access",
    type: "months",
  },
  {
    section: "",
    key: "expenseExport",
    label: "Export to CSV/PDF",
    type: "bool",
  },
  {
    section: "",
    key: "budgetAlerts",
    label: "Budget limit alerts",
    type: "bool",
  },
  // Journal
  {
    section: "✦ Journal",
    key: "journalEntries",
    label: "Journal entries per month",
    type: "limit",
  },
  {
    section: "",
    key: "moodAnalytics",
    label: "Mood analytics & charts",
    type: "bool",
  },
  {
    section: "",
    key: "journalHistory",
    label: "History access",
    type: "months",
  },
  // Notes
  {
    section: "◇ Notes",
    key: "notesTotal",
    label: "Total notes",
    type: "limit",
  },
  { section: "", key: "notesFolders", label: "Folders", type: "limit" },
  {
    section: "",
    key: "aiSummarize",
    label: "AI note summarizer",
    type: "bool",
  },
  // Tasks
  {
    section: "◎ Tasks",
    key: "tasksPerMonth",
    label: "Tasks per month",
    type: "limit",
  },
  {
    section: "",
    key: "taskReminders",
    label: "Deadline reminders",
    type: "bool",
  },
  // AI
  {
    section: "⟡ AI",
    key: "aiAssistant",
    label: "AI Assistant access",
    type: "bool",
  },
  {
    section: "",
    key: "aiMessagesPerDay",
    label: "AI messages per day",
    type: "limit",
  },
  {
    section: "",
    key: "aiInsights",
    label: "AI insights & suggestions",
    type: "bool",
  },
  {
    section: "",
    key: "aiWeeklyReport",
    label: "Weekly AI report",
    type: "bool",
  },
  // Extra
  {
    section: "✦ Extra",
    key: "streakAnalytics",
    label: "Streak & habit analytics",
    type: "bool",
  },
  { section: "", key: "dataExport", label: "Full data export", type: "bool" },
  {
    section: "",
    key: "prioritySupport",
    label: "Priority support",
    type: "bool",
  },
];

function formatValue(key, plan, type) {
  const val = plan.features[key];
  if (type === "bool") return val ? "✓" : "—";
  if (type === "limit")
    return val === -1 ? "Unlimited" : val === 0 ? "—" : String(val);
  if (type === "months")
    return val === -1 ? "All time" : val === 0 ? "—" : `${val} months`;
  return String(val);
}

function ValueCell({ v }) {
  const isCheck = v === "✓";
  const isDash = v === "—";
  return (
    <td
      style={{
        padding: "11px 16px",
        textAlign: "center",
        fontSize: 13,
        color: isCheck ? C.green : isDash ? C.textDim : C.text,
        fontWeight: isCheck || (!isDash && v !== "—") ? 600 : 400,
      }}
    >
      {isCheck ? "✓" : isDash ? "—" : v}
    </td>
  );
}

export default function SubscriptionPage() {
  const { plan: currentPlan, planId, upgradeTo } = { plan: { badge: "Plan" } }; //useSubscription();
  const [billing, setBilling] = useState("monthly");
  const [upgrading, setUpgrading] = useState(null);

  const handleUpgrade = async (id) => {
    if (id === planId) return;
    setUpgrading(id);
    await new Promise((r) => setTimeout(r, 1200)); // simulate payment
    upgradeTo(id);
    setUpgrading(null);
  };

  const getPrice = (p) =>
    billing === "yearly" ? Math.round(p.yearlyPrice / 12) : p.price;

  const savingsPct = (p) => {
    if (!p.price) return 0;
    return Math.round((1 - p.yearlyPrice / (p.price * 12)) * 100);
  };

  return (
    <div
      className="screen-in"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        maxWidth: 1000,
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 14px",
            borderRadius: 20,
            background: "rgba(124,58,237,.15)",
            border: "1px solid rgba(124,58,237,.3)",
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 11, color: "#c4b5fd", fontWeight: 600 }}>
            Current plan: {currentPlan.badge}
          </span>
        </div>
        <h1
          style={{
            fontFamily: FONTS.display,
            fontSize: 32,
            color: C.text,
            fontWeight: 700,
            marginBottom: 10,
          }}
        >
          Choose your plan
        </h1>
        <p style={{ fontSize: 14, color: C.textMid, marginBottom: 24 }}>
          Unlock the full power of Lumina with AI, unlimited data and more.
        </p>

        {/* Billing toggle */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0,
            background: "rgba(255,255,255,.05)",
            border: `1px solid ${C.glassBorder}`,
            borderRadius: 12,
            padding: 4,
          }}
        >
          {["monthly", "yearly"].map((b) => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              style={{
                padding: "7px 20px",
                borderRadius: 9,
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                background:
                  billing === b
                    ? `linear-gradient(135deg,${C.violet},${C.violetLight})`
                    : "transparent",
                border: "none",
                color: billing === b ? "#fff" : C.textMid,
                transition: "all .18s",
              }}
            >
              {b === "monthly" ? "Monthly" : "Yearly"}
              {b === "yearly" && billing !== "yearly" && (
                <span
                  style={{
                    marginLeft: 6,
                    fontSize: 10,
                    color: C.green,
                    fontWeight: 700,
                  }}
                >
                  -33%
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Plan cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 16,
        }}
      >
        {Object.values(PLANS)
          .filter((p) => p.id !== "free")
          .map((p) => {
            const isActive = p.id === planId;
            const isBest = p.id === "pro";
            const savings = savingsPct(p);
            const monthlyP = getPrice(p);
            const isLoading = upgrading === p.id;

            return (
              <div key={p.id} style={{ position: "relative" }}>
                {isBest && (
                  <div
                    style={{
                      position: "absolute",
                      top: -12,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: `linear-gradient(135deg,${C.violet},${C.violetLight})`,
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "4px 14px",
                      borderRadius: 20,
                      whiteSpace: "nowrap",
                      zIndex: 1,
                    }}
                  >
                    ✦ Most Popular
                  </div>
                )}
                <Glass
                  style={{
                    padding: 24,
                    height: "100%",
                    border: isActive
                      ? `2px solid ${p.color}`
                      : isBest
                        ? `1px solid ${p.color}50`
                        : `1px solid ${C.glassBorder}`,
                    background: isActive
                      ? `${p.color}10`
                      : isBest
                        ? `${p.color}06`
                        : C.glass,
                    transition: "all .2s",
                  }}
                >
                  {/* Badge */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 16,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        padding: "3px 10px",
                        borderRadius: 20,
                        background: p.color + "20",
                        color: p.color,
                        fontWeight: 700,
                        border: `1px solid ${p.color}40`,
                      }}
                    >
                      {p.badge}
                    </span>
                    {isActive && (
                      <span
                        style={{
                          fontSize: 11,
                          color: C.green,
                          fontWeight: 600,
                        }}
                      >
                        ✓ Current
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div style={{ marginBottom: 20 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: 4,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: FONTS.display,
                          fontSize: 36,
                          color: C.text,
                          fontWeight: 700,
                          lineHeight: 1,
                        }}
                      >
                        {monthlyP === 0 ? "Free" : `₹${monthlyP}`}
                      </span>
                      {monthlyP > 0 && (
                        <span
                          style={{
                            fontSize: 13,
                            color: C.textDim,
                            marginBottom: 4,
                          }}
                        >
                          /mo
                        </span>
                      )}
                    </div>
                    {billing === "yearly" && p.price > 0 && (
                      <div
                        style={{ fontSize: 11, color: C.green, marginTop: 4 }}
                      >
                        ₹{p.yearlyPrice}/year · Save {savings}%
                      </div>
                    )}
                    {billing === "monthly" && p.price > 0 && (
                      <div
                        style={{ fontSize: 11, color: C.textDim, marginTop: 4 }}
                      >
                        ₹{p.yearlyPrice}/year if billed yearly
                      </div>
                    )}
                  </div>

                  {/* Key highlights */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      marginBottom: 22,
                    }}
                  >
                    {p.id === "free" &&
                      [
                        "20 expenses/month",
                        "10 journal entries",
                        "10 notes",
                        "20 tasks",
                        "No AI access",
                      ].map((f, i) => (
                        <FeatureItem key={i} text={f} included={true} dim />
                      ))}

                    {p.id === "student" &&
                      [
                        "100 expenses/month",
                        "Unlimited journal entries",
                        "100 notes + 10 folders",
                        "Unlimited tasks",
                        "20 AI messages/day",
                        "AI note summarizer",
                        "Mood analytics",
                      ].map((f, i) => (
                        <FeatureItem key={i} text={f} included={true} />
                      ))}

                    {p.id === "pro" &&
                      [
                        "Unlimited everything",
                        "Unlimited AI messages",
                        "AI weekly reports",
                        "Full history access",
                        "Priority support",
                        "Full data export",
                        "Advanced analytics",
                      ].map((f, i) => (
                        <FeatureItem
                          key={i}
                          text={f}
                          included={true}
                          highlight
                        />
                      ))}
                  </div>

                  {/* CTA */}
                  {isActive ? (
                    <div
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: 10,
                        background: "rgba(255,255,255,.06)",
                        border: `1px solid ${C.glassBorder}`,
                        color: C.textMid,
                        fontSize: 13,
                        fontWeight: 600,
                        textAlign: "center",
                      }}
                    >
                      ✓ Your current plan
                    </div>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(p.id)}
                      disabled={!!upgrading}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: 10,
                        background: isLoading
                          ? "rgba(124,58,237,.4)"
                          : `linear-gradient(135deg,${p.color},${p.color}cc)`,
                        border: "none",
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: upgrading ? "not-allowed" : "pointer",
                        transition: "all .15s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      {isLoading ? (
                        <>
                          <span
                            style={{
                              width: 14,
                              height: 14,
                              borderRadius: "50%",
                              border: "2px solid #fff4",
                              borderTopColor: "#fff",
                              display: "inline-block",
                              animation: "inlineSpin .65s linear infinite",
                            }}
                          />
                          Processing...
                        </>
                      ) : p.id === "free" ? (
                        "Downgrade to Free"
                      ) : (
                        `Upgrade to ${p.name} →`
                      )}
                    </button>
                  )}
                </Glass>
              </div>
            );
          })}
      </div>

      {/* Feature comparison table */}
      <Glass style={{ padding: 0, overflow: "hidden" }}>
        <div
          style={{
            padding: "18px 24px",
            borderBottom: `1px solid ${C.glassBorder}`,
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
            Full Feature Comparison
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.glassBorder}` }}>
                <th
                  style={{
                    padding: "12px 24px",
                    textAlign: "left",
                    fontSize: 12,
                    color: C.textDim,
                    fontWeight: 600,
                    width: "40%",
                  }}
                >
                  Feature
                </th>
                {Object.values(PLANS).map((p) => (
                  <th
                    key={p.id}
                    style={{
                      padding: "12px 16px",
                      textAlign: "center",
                      fontSize: 12,
                      color: p.id === planId ? p.color : C.textMid,
                      fontWeight: 700,
                    }}
                  >
                    {p.badge}
                    {p.id === planId && (
                      <span
                        style={{
                          display: "block",
                          fontSize: 10,
                          color: C.green,
                        }}
                      >
                        Current
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURE_ROWS.map((row, i) => (
                <>
                  {row.section && (
                    <tr
                      key={`sec-${i}`}
                      style={{ background: "rgba(255,255,255,.02)" }}
                    >
                      <td
                        colSpan={4}
                        style={{
                          padding: "10px 24px",
                          fontSize: 12,
                          color: C.textMid,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: 1,
                        }}
                      >
                        {row.section}
                      </td>
                    </tr>
                  )}
                  <tr
                    key={row.key}
                    style={{
                      borderBottom: `1px solid rgba(255,255,255,.04)`,
                      background:
                        i % 2 === 0 ? "transparent" : "rgba(255,255,255,.01)",
                    }}
                  >
                    <td
                      style={{
                        padding: "11px 24px",
                        fontSize: 13,
                        color: C.text,
                      }}
                    >
                      {row.label}
                    </td>
                    {Object.values(PLANS).map((p) => (
                      <ValueCell
                        key={p.id}
                        v={formatValue(row.key, p, row.type)}
                      />
                    ))}
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      </Glass>

      {/* FAQ */}
      <Glass style={{ padding: 24 }}>
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 17,
            color: C.text,
            fontWeight: 700,
            marginBottom: 18,
          }}
        >
          Frequently Asked Questions
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            {
              q: "Can I switch plans anytime?",
              a: "Yes Upgrade or downgrade anytime. Upgrades take effect immediately, downgrades at the end of your billing cycle.",
            },
            {
              q: "Is the Student plan really just ₹49/month?",
              a: "Yes We believe productivity tools should be affordable for students. Verify with your college email.",
            },
            {
              q: "What happens to my data if I downgrade?",
              a: "Your data is never deleted. You'll just lose access to data beyond the Free plan limits until you upgrade again.",
            },
            {
              q: "Is there a free trial for Pro?",
              a: "Yes — new users get 7 days of Pro features free, no credit card required.",
            },
            {
              q: "Can I pay yearly?",
              a: "Yes — yearly billing saves up to 33%. Student plan: ₹399/year. Pro plan: ₹999/year.",
            },
          ].map((faq, i, arr) => (
            <FaqItem key={i} q={faq.q} a={faq.a} last={i === arr.length - 1} />
          ))}
        </div>
      </Glass>
    </div>
  );
}

function FeatureItem({ text, included, dim, highlight }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span
        style={{
          fontSize: 12,
          color: included ? (highlight ? "#c4b5fd" : C.green) : C.textDim,
          flexShrink: 0,
        }}
      >
        {included ? "✓" : "—"}
      </span>
      <span
        style={{
          fontSize: 12,
          color: dim ? C.textDim : highlight ? C.text : C.textMid,
          lineHeight: 1.4,
        }}
      >
        {text}
      </span>
    </div>
  );
}

function FaqItem({ q, a, last }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: last ? "none" : `1px solid ${C.glassBorder}` }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "14px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span
          style={{
            fontSize: 13,
            color: C.text,
            fontWeight: 500,
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          {q}
        </span>
        <span
          style={{
            fontSize: 16,
            color: C.textDim,
            flexShrink: 0,
            transition: "transform .2s",
            transform: open ? "rotate(180deg)" : "none",
          }}
        >
          ▾
        </span>
      </button>
      {open && (
        <div
          style={{
            fontSize: 13,
            color: C.textMid,
            lineHeight: 1.7,
            paddingBottom: 14,
          }}
        >
          {a}
        </div>
      )}
    </div>
  );
}
