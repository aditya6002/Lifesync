import { useNavigate } from "react-router-dom";
import { C, FONTS } from "../shared/styles/tokens";
import { Glass } from "../shared/components/ui/Atoms";

export default function LandingPage() {
  const nav = useNavigate();

  const features = [
    {
      icon: "◈",
      title: "Expense Manager",
      desc: "Visual charts, AI insights, full CRUD for every transaction.",
      color: C.violet,
      tag: "Smart tracking",
    },
    {
      icon: "✦",
      title: "Daily Journal",
      desc: "Mood tracking, streaks, weekly AI summaries of your patterns.",
      color: C.yellow,
      tag: "Mood aware",
    },
    {
      icon: "◇",
      title: "Smart Notes",
      desc: "Tags, folders, rich text and one-click AI summarization.",
      color: C.blue,
      tag: "AI powered",
    },
    {
      icon: "◎",
      title: "Task Planner",
      desc: "Priority badges, grouped by Today / Tomorrow / Upcoming.",
      color: C.red,
      tag: "Stay focused",
    },
    {
      icon: "⟡",
      title: "AI Assistant",
      desc: "Knows all your data and gives contextual, personalised advice.",
      color: "#c4b5fd",
      tag: "Always ready",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, overflowX: "hidden" }}>
      {/* Ambient blobs */}
      <div
        style={{
          position: "fixed",
          top: -200,
          left: -150,
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(124,58,237,.1) 0%,transparent 65%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 48px",
          borderBottom: `1px solid ${C.glassBorder}`,
          position: "sticky",
          top: 0,
          background: "rgba(7,9,15,.9)",
          backdropFilter: "blur(24px)",
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: `linear-gradient(135deg,${C.violet},${C.violetLight})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 17,
            }}
          >
            ✦
          </div>
          <span
            style={{
              fontFamily: FONTS.display,
              fontSize: 20,
              color: C.text,
              fontWeight: 700,
            }}
          >
            Lumina
          </span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => nav("/login")}
            style={{
              padding: "8px 20px",
              borderRadius: 10,
              background: "transparent",
              border: `1px solid ${C.glassBorder}`,
              color: C.textMid,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Log In
          </button>
          <button
            onClick={() => nav("/signup")}
            style={{
              padding: "8px 22px",
              borderRadius: 10,
              background: `linear-gradient(135deg,${C.violet},${C.violetLight})`,
              border: "none",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Get Started Free ✦
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          textAlign: "center",
          padding: "90px 24px 60px",
          maxWidth: 700,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          className="fu1"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 16px",
            borderRadius: 20,
            background: "rgba(124,58,237,.15)",
            border: "1px solid rgba(124,58,237,.3)",
            marginBottom: 24,
          }}
        >
          <span style={{ fontSize: 10, color: "#c4b5fd" }}>●</span>
          <span style={{ fontSize: 12, color: "#c4b5fd", fontWeight: 500 }}>
            AI-Powered Productivity for Students
          </span>
        </div>
        <h1
          className="fu2"
          style={{
            fontFamily: FONTS.display,
            fontSize: "clamp(34px,5vw,58px)",
            color: C.text,
            fontWeight: 700,
            lineHeight: 1.12,
            marginBottom: 22,
          }}
        >
          Your entire life,
          <br />
          <span
            style={{
              background: `linear-gradient(135deg,${C.violet},${C.violetLight},#06b6d4)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            beautifully organized.
          </span>
        </h1>
        <p
          className="fu3"
          style={{
            fontSize: 16,
            color: C.textMid,
            lineHeight: 1.78,
            marginBottom: 36,
            maxWidth: 520,
            margin: "0 auto 36px",
          }}
        >
          Lumina combines{" "}
          <strong style={{ color: C.text }}>expense tracking</strong>,{" "}
          <strong style={{ color: C.text }}>journaling</strong>,{" "}
          <strong style={{ color: C.text }}>notes</strong> and{" "}
          <strong style={{ color: C.text }}>tasks</strong> — powered by an AI
          that understands your patterns.
        </p>
        <div
          className="fu4"
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => nav("/signup")}
            style={{
              padding: "13px 32px",
              borderRadius: 12,
              background: `linear-gradient(135deg,${C.violet},${C.violetLight})`,
              border: "none",
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 8px 32px rgba(124,58,237,.38)",
            }}
          >
            Start for Free →
          </button>
          <button
            onClick={() => nav("/login")}
            style={{
              padding: "13px 28px",
              borderRadius: 12,
              background: C.glass,
              border: `1px solid ${C.glassBorder}`,
              color: C.textMid,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            I have an account
          </button>
        </div>
        <div
          style={{
            display: "flex",
            gap: 18,
            justifyContent: "center",
            marginTop: 20,
            flexWrap: "wrap",
          }}
        >
          {["✓ Setup in 60 sec"].map(
            //"✓ Free forever", "✓ No credit card",
            (t, i) => (
              <span key={i} style={{ fontSize: 12, color: C.textDim }}>
                {t}
              </span>
            ),
          )}
        </div>
      </section>

      {/* Features */}
      <section
        style={{
          padding: "60px 60px 80px",
          maxWidth: 1100,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <h2
            style={{
              fontFamily: FONTS.display,
              fontSize: "clamp(24px,3vw,38px)",
              color: C.text,
              fontWeight: 700,
            }}
          >
            Everything you need, nothing you don't
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
            gap: 16,
          }}
        >
          {features.map((f, i) => (
            <Glass
              key={i}
              className="hov-card"
              style={{
                padding: 22,
                cursor: "default",
                transition: "all .25s",
                borderTop: `2px solid ${f.color}25`,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 11,
                  background: f.color + "18",
                  border: `1px solid ${f.color}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 19,
                  color: f.color,
                  marginBottom: 13,
                }}
              >
                {f.icon}
              </div>
              <div
                style={{
                  display: "inline-block",
                  fontSize: 10,
                  color: f.color,
                  background: f.color + "15",
                  padding: "2px 8px",
                  borderRadius: 20,
                  marginBottom: 8,
                  fontWeight: 600,
                }}
              >
                {f.tag}
              </div>
              <div
                style={{
                  fontFamily: FONTS.display,
                  fontSize: 14,
                  color: C.text,
                  fontWeight: 600,
                  marginBottom: 7,
                }}
              >
                {f.title}
              </div>
              <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.65 }}>
                {f.desc}
              </div>
            </Glass>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 44 }}>
          <button
            onClick={() => nav("/signup")}
            style={{
              padding: "14px 44px",
              borderRadius: 12,
              background: `linear-gradient(135deg,${C.violet},${C.violetLight})`,
              border: "none",
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 8px 32px rgba(124,58,237,.4)",
            }}
          >
            Get Started — It's Free ✦
          </button>
          <p style={{ fontSize: 11, color: C.textDim, marginTop: 32 }}>
            © 2026 Lumina · Made with ✦ for students
          </p>
        </div>
      </section>
    </div>
  );
}
