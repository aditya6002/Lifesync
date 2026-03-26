import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { C, FONTS } from "../shared/styles/tokens";
import { Glass, FInput, Btn } from "../shared/components/ui/Atoms";
// import { useLoginForm } from "../hooks/useLoginForm";

export default function LoginPage() {
  const nav = useNavigate();
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleLogin,
  } = {}; //useLoginForm();
  const [showPass, setShowPass] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          position: "fixed",
          top: -150,
          right: -100,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(124,58,237,.1) 0%,transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Top nav */}
      <div
        style={{
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={() => nav("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: "none",
            border: "none",
            color: C.textMid,
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          ◀ Back
        </button>
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
            ✦
          </div>
          <span
            style={{
              fontFamily: FONTS.display,
              fontSize: 16,
              color: C.text,
              fontWeight: 700,
            }}
          >
            Lumina
          </span>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div className="screen-in" style={{ width: "100%", maxWidth: 420 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: `linear-gradient(135deg,${C.violet},${C.violetLight})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                margin: "0 auto 18px",
                boxShadow: "0 8px 28px rgba(124,58,237,.35)",
              }}
            >
              ✦
            </div>
            <h1
              style={{
                fontFamily: FONTS.display,
                fontSize: 28,
                color: C.text,
                fontWeight: 700,
              }}
            >
              Welcome back
            </h1>
            <p style={{ color: C.textMid, fontSize: 14, marginTop: 6 }}>
              Sign in to continue to Lumina
            </p>
          </div>

          <Glass style={{ padding: 28 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <FInput
                label="Email address"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
                type="email"
              />

              {/* Password with show/hide */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label
                  style={{ fontSize: 12, color: C.textMid, fontWeight: 500 }}
                >
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    style={{
                      background: "rgba(255,255,255,.05)",
                      border: `1px solid ${C.glassBorder}`,
                      borderRadius: 10,
                      padding: "10px 40px 10px 13px",
                      color: C.text,
                      fontSize: 13,
                      outline: "none",
                      width: "100%",
                    }}
                  />
                  <button
                    onClick={() => setShowPass((s) => !s)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: C.textDim,
                      cursor: "pointer",
                      fontSize: 14,
                    }}
                  >
                    <p style={{ color: "white" }}>{showPass ? "🙈" : "𓁺"}</p>
                  </button>
                </div>
              </div>

              {error && (
                <div
                  style={{
                    fontSize: 12,
                    color: C.red,
                    background: "rgba(239,68,68,.1)",
                    border: "1px solid rgba(239,68,68,.2)",
                    padding: "8px 12px",
                    borderRadius: 8,
                  }}
                >
                  {error}
                </div>
              )}

              <div style={{ textAlign: "right" }}>
                <span
                  style={{ fontSize: 12, color: C.violet, cursor: "pointer" }}
                >
                  Forgot password?
                </span>
              </div>

              <Btn
                onClick={submit}
                disabled={loading}
                style={{ width: "100%", padding: "12px" }}
              >
                {loading ? "Signing in..." : "Sign In →"}
              </Btn>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{ flex: 1, height: 1, background: C.glassBorder }}
                />
                <span style={{ fontSize: 11, color: C.textDim }}>
                  or with email
                </span>
                <div
                  style={{ flex: 1, height: 1, background: C.glassBorder }}
                />
              </div>
              <button
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 10,
                  background: "rgba(255,255,255,.05)",
                  border: `1px solid ${C.glassBorder}`,
                  color: C.text,
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                Continue with Google
              </button>
            </div>
          </Glass>

          <p
            style={{
              textAlign: "center",
              fontSize: 13,
              color: C.textMid,
              marginTop: 20,
            }}
          >
            Don't have an account?{" "}
            <span
              onClick={() => nav("/signup")}
              style={{ color: C.violet, cursor: "pointer", fontWeight: 600 }}
            >
              Sign up free
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
