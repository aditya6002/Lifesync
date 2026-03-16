// src/features/ai/pages/AIAssistantPage.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { C, FONTS } from "../../../shared/styles/tokens";
import { Glass, Btn } from "../../../shared/components/ui/Atoms";
import { useSubscription } from "../../subscription/subscription.context";

const QUICK_PROMPTS = [
  "📊 Analyze my expenses",
  "✍️ Write today's journal",
  "✅ Plan my tasks",
  "💡 Give me study tips",
  "📈 Analyze my mood trends",
  "⚡ Daily summary",
];

const CHAT_HISTORY = [
  { id: 1, title: "Expense analysis March", time: "Today" },
  { id: 2, title: "Study plan for exams", time: "Yesterday" },
  { id: 3, title: "Mood pattern insights", time: "Mar 9" },
  { id: 4, title: "Task prioritization", time: "Mar 8" },
];

const AI_REPLIES = [
  "Based on your March expenses, you've spent ₹2,839 total — food is 40% of that. I'd suggest setting a ₹1,500/month food budget.",
  "Your journal shows a positive mood trend this week 😄 You've been most productive on days after gym sessions — worth noting",
  "You have 4 pending tasks. I recommend tackling 'Submit DSA assignment' first — it's high priority and due today.",
  "Here's a study plan: 2 hrs DSA → 1 hr DBMS → 30 min review. Repeat for 5 days before your exam.",
  "Your mood pattern shows Sundays are your toughest days. Try planning a small reward to improve consistency.",
];

export default function AIAssistantPage() {
  const nav = useNavigate();
  const { can, limit, plan } = useSubscription();
  const hasAI = can("aiAssistant");
  const maxMsgs = limit("aiMessagesPerDay");
  const [usedToday, setUsedToday] = useState(0);

  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hello 👋 I'm Lumina AI — your personal productivity assistant. I have full context of your expenses, journal, notes and tasks. What would you like to explore today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  const canSend = hasAI && (maxMsgs === -1 || usedToday < maxMsgs);

  const send = (text) => {
    const msg = text || input;
    if (!msg.trim() || !canSend) return;
    setMessages((m) => [...m, { role: "user", text: msg }]);
    setInput("");
    setUsedToday((n) => n + 1);
    setTyping(true);
    setTimeout(
      () => {
        setTyping(false);
        setMessages((m) => [
          ...m,
          {
            role: "ai",
            text: AI_REPLIES[Math.floor(Math.random() * AI_REPLIES.length)],
          },
        ]);
      },
      1300 + Math.random() * 700,
    );
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // ── LOCKED STATE (Free plan) ────────────────────────────
  if (!hasAI) {
    return (
      <div
        className="screen-in"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "70vh",
        }}
      >
        <Glass
          style={{
            padding: 44,
            textAlign: "center",
            maxWidth: 420,
            border: "1px solid rgba(124,58,237,.35)",
          }}
        >
          <div style={{ fontSize: 52, marginBottom: 16 }}>⟡</div>
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: 22,
              color: C.text,
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            AI Assistant
          </div>
          <div
            style={{
              fontSize: 13,
              color: C.textMid,
              lineHeight: 1.7,
              marginBottom: 8,
            }}
          >
            Get personalized insights, expense analysis, journal summaries,
            study plans and more — powered by AI that knows your entire Lumina
            data.
          </div>
          <div
            style={{
              fontSize: 13,
              color: C.textMid,
              lineHeight: 1.7,
              marginBottom: 24,
            }}
          >
            AI Assistant is available on{" "}
            <strong style={{ color: "#c4b5fd" }}>Student</strong> and{" "}
            <strong style={{ color: C.violetLight }}>Pro</strong> plans.
          </div>

          {/* Feature previews */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginBottom: 24,
              textAlign: "left",
            }}
          >
            {[
              { icon: "📊", text: "Analyze your monthly expenses" },
              { icon: "✦", text: "Summarize your journal entries" },
              { icon: "✅", text: "Create personalized study plans" },
              { icon: "📈", text: "Mood & productivity insights" },
            ].map((f, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px",
                  borderRadius: 9,
                  background: "rgba(124,58,237,.08)",
                  border: "1px solid rgba(124,58,237,.15)",
                }}
              >
                <span style={{ fontSize: 16 }}>{f.icon}</span>
                <span style={{ fontSize: 12, color: C.textMid }}>{f.text}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <Btn onClick={() => nav("/subscription")}>
              🔒 Unlock AI Assistant →
            </Btn>
            <Btn variant="ghost" onClick={() => nav("/subscription")}>
              View Plans
            </Btn>
          </div>

          <div style={{ marginTop: 16, fontSize: 11, color: C.textDim }}>
            Student plan from ₹49/mo · Pro from ₹149/mo
          </div>
        </Glass>
      </div>
    );
  }

  // ── ACTIVE AI (Student / Pro) ───────────────────────────
  return (
    <div
      className="screen-in"
      style={{ display: "flex", gap: 16, height: "calc(100vh - 100px)" }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: 200,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {/* Usage meter */}
        <Glass style={{ padding: 14 }}>
          <div
            style={{
              fontSize: 11,
              color: C.textDim,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            Today's Usage
          </div>
          {maxMsgs === -1 ? (
            <div style={{ fontSize: 12, color: "#c4b5fd", fontWeight: 600 }}>
              ⚡ Unlimited messages
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 5,
                }}
              >
                <span style={{ fontSize: 11, color: C.textMid }}>Messages</span>
                <span
                  style={{
                    fontSize: 11,
                    color: usedToday >= maxMsgs * 0.8 ? C.yellow : C.textDim,
                  }}
                >
                  {usedToday}/{maxMsgs}
                </span>
              </div>
              <div
                style={{
                  height: 5,
                  background: "rgba(255,255,255,.07)",
                  borderRadius: 4,
                  overflow: "hidden",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: `${Math.min(100, (usedToday / maxMsgs) * 100)}%`,
                    height: "100%",
                    background:
                      usedToday >= maxMsgs
                        ? "#ef4444"
                        : `linear-gradient(90deg,${C.violet},${C.violetLight})`,
                    borderRadius: 4,
                    transition: "width .4s",
                  }}
                />
              </div>
              {usedToday >= maxMsgs && (
                <div
                  onClick={() => nav("/subscription")}
                  style={{
                    fontSize: 11,
                    color: "#c4b5fd",
                    cursor: "pointer",
                    textAlign: "center",
                    padding: "6px",
                    borderRadius: 7,
                    background: "rgba(124,58,237,.15)",
                    border: "1px solid rgba(124,58,237,.3)",
                  }}
                >
                  Upgrade for more →
                </div>
              )}
            </>
          )}
        </Glass>

        {/* Quick prompts */}
        <Glass style={{ padding: 14 }}>
          <div
            style={{
              fontSize: 11,
              color: C.textDim,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 10,
            }}
          >
            Quick Prompts
          </div>
          {QUICK_PROMPTS.map((p, i) => (
            <button
              key={i}
              onClick={() => send(p.replace(/^[^ ]+ /, ""))}
              disabled={!canSend}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "8px 10px",
                borderRadius: 8,
                background: "rgba(255,255,255,.03)",
                border: `1px solid ${C.glassBorder}`,
                color: canSend ? C.textMid : C.textDim,
                fontSize: 11,
                cursor: canSend ? "pointer" : "not-allowed",
                marginBottom: 6,
                lineHeight: 1.45,
                transition: "all .15s",
                fontFamily: "'DM Sans',sans-serif",
                opacity: canSend ? 1 : 0.5,
              }}
              onMouseEnter={(e) => {
                if (canSend) {
                  e.currentTarget.style.background = "rgba(124,58,237,.15)";
                  e.currentTarget.style.color = "#c4b5fd";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,.03)";
                e.currentTarget.style.color = C.textMid;
              }}
            >
              {p}
            </button>
          ))}
        </Glass>

        {/* History */}
        <Glass style={{ padding: 14, flex: 1 }}>
          <div
            style={{
              fontSize: 11,
              color: C.textDim,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 10,
            }}
          >
            History
          </div>
          {CHAT_HISTORY.map((h) => (
            <div
              key={h.id}
              style={{
                padding: "8px 10px",
                borderRadius: 8,
                cursor: "pointer",
                marginBottom: 4,
                background: "rgba(255,255,255,.02)",
                transition: "background .15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,.02)")
              }
            >
              <div style={{ fontSize: 11, color: C.textMid }}>{h.title}</div>
              <div style={{ fontSize: 10, color: C.textDim, marginTop: 2 }}>
                {h.time}
              </div>
            </div>
          ))}
        </Glass>
      </div>

      {/* Chat */}
      <Glass
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 18px",
            borderBottom: `1px solid ${C.glassBorder}`,
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: `linear-gradient(135deg,${C.violet},${C.violetLight})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              boxShadow: "0 4px 12px rgba(124,58,237,.3)",
            }}
          >
            ⟡
          </div>
          <div>
            <div
              style={{
                fontSize: 14,
                color: C.text,
                fontWeight: 600,
                fontFamily: FONTS.display,
              }}
            >
              Lumina AI
            </div>
            <div style={{ fontSize: 10, color: C.green }}>
              ● Online · Full context access
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <div
            style={{
              fontSize: 11,
              color: plan.color,
              background: plan.color + "18",
              padding: "4px 10px",
              borderRadius: 20,
              border: `1px solid ${plan.color}30`,
              fontWeight: 600,
            }}
          >
            {plan.badge}
          </div>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                animation: "fadeIn .2s ease",
              }}
            >
              {m.role === "ai" && (
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: `linear-gradient(135deg,${C.violet},${C.violetLight})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    flexShrink: 0,
                    marginRight: 8,
                    marginTop: 4,
                  }}
                >
                  ⟡
                </div>
              )}
              <div
                style={{
                  maxWidth: "72%",
                  padding: "11px 15px",
                  borderRadius:
                    m.role === "user"
                      ? "16px 4px 16px 16px"
                      : "4px 16px 16px 16px",
                  background:
                    m.role === "user"
                      ? `linear-gradient(135deg,${C.violet},${C.violetLight})`
                      : "rgba(255,255,255,.06)",
                  border:
                    m.role === "ai" ? `1px solid ${C.glassBorder}` : "none",
                  fontSize: 13,
                  color: C.text,
                  lineHeight: 1.7,
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: `linear-gradient(135deg,${C.violet},${C.violetLight})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                }}
              >
                ⟡
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 5,
                  padding: "12px 16px",
                  background: "rgba(255,255,255,.06)",
                  borderRadius: "4px 16px 16px 16px",
                  border: `1px solid ${C.glassBorder}`,
                }}
              >
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: C.violet,
                      animation: `bounce 1s ${i * 0.22}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div
          style={{
            padding: "12px 16px",
            borderTop: `1px solid ${C.glassBorder}`,
            display: "flex",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(input)}
            disabled={!canSend}
            placeholder={
              canSend
                ? "Ask anything about your productivity data..."
                : `Daily limit reached. Upgrade for more messages →`
            }
            style={{
              flex: 1,
              background: "rgba(255,255,255,.05)",
              border: `1px solid ${C.glassBorder}`,
              borderRadius: 12,
              padding: "10px 14px",
              color: C.text,
              fontSize: 13,
              outline: "none",
              opacity: canSend ? 1 : 0.6,
            }}
          />
          <button
            onClick={() => send(input)}
            disabled={!canSend}
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: canSend
                ? `linear-gradient(135deg,${C.violet},${C.violetLight})`
                : "rgba(124,58,237,.3)",
              border: "none",
              color: "#fff",
              fontSize: 18,
              cursor: canSend ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            ↑
          </button>
        </div>
      </Glass>
    </div>
  );
}
