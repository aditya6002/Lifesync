// src/modules/ai/AIAssistantPage.jsx
import { useState, useEffect, useRef } from "react";
import { C, FONTS } from "../../../shared/styles/tokens";
import { Glass } from "../../../shared/components/ui/Atoms";
import { DEMO_CHAT_HISTORY, AI_REPLIES } from "../../../data/demo";

const QUICK_PROMPTS = [
  "📊 Analyze my expenses",
  "✍️ Write today's journal",
  "✅ Plan my tasks",
  "💡 Study tips",
  "📈 Mood trends",
  "⚡ Daily summary",
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hello! 👋 I'm Lumina AI — your personal productivity assistant. I have full context of your expenses, journal, notes and tasks. What would you like to explore today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  const send = (text) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setMessages((m) => [...m, { role: "user", text: msg }]);
    setInput("");
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

  return (
    <div style={{ display: "flex", gap: 16, height: "calc(100vh - 100px)" }}>
      {/* Left sidebar */}
      <div
        style={{
          width: 200,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
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
              style={{
                width: "100%",
                textAlign: "left",
                padding: "8px 10px",
                borderRadius: 8,
                background: "rgba(255,255,255,.03)",
                border: `1px solid ${C.glassBorder}`,
                color: C.textMid,
                fontSize: 11,
                cursor: "pointer",
                marginBottom: 6,
                lineHeight: 1.45,
                transition: "all .15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(124,58,237,.15)";
                e.currentTarget.style.color = "#c4b5fd";
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

        {/* Chat history */}
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
          {DEMO_CHAT_HISTORY.map((h, i) => (
            <div
              key={i}
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

      {/* Chat panel */}
      <Glass
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
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
              color: C.textDim,
              background: "rgba(255,255,255,.04)",
              padding: "4px 10px",
              borderRadius: 20,
              border: `1px solid ${C.glassBorder}`,
            }}
          >
            GPT-4 powered
          </div>
        </div>

        {/* Messages */}
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

          {/* Typing indicator */}
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

        {/* Input bar */}
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
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Ask anything about your productivity data..."
            style={{
              flex: 1,
              background: "rgba(255,255,255,.05)",
              border: `1px solid ${C.glassBorder}`,
              borderRadius: 12,
              padding: "10px 14px",
              color: C.text,
              fontSize: 13,
              outline: "none",
            }}
          />
          <button
            onClick={() => send()}
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: `linear-gradient(135deg,${C.violet},${C.violetLight})`,
              border: "none",
              color: "#fff",
              fontSize: 18,
              cursor: "pointer",
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
