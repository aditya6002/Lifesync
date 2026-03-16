// src/features/auth/pages/SignupPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { C, FONTS } from "../../../shared/styles/tokens";
import { Glass, FInput, Btn } from "../../../shared/components/ui/Atoms";
import { useSignupForm } from "../hooks/useAuthForm";

const ALL_INTERESTS = [
  "📚 Student",
  "💼 Professional",
  "💰 Budget tracking",
  "✦ Journaling",
  "◇ Note taking",
  "✅ Task planning",
  "🎯 Goal setting",
  "🧘 Self growth",
];

export default function SignupPage() {
  const nav = useNavigate();
  const {
    step,
    setStep,
    name,
    setName,
    email,
    setEmail,
    pass,
    setPass,
    confirm,
    setConfirm,
    interests,
    toggleInterest,
    loading,
    error,
    setError,
    nextStep,
    submit,
  } = useSignupForm();
  const [showPass, setShowPass] = useState(false);

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
          left: -100,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(124,58,237,.1) 0%,transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={() => (step === 2 ? setStep(1) : nav("/"))}
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
          ◀ {step === 2 ? "Back" : "Back to home"}
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
        <div className="screen-in" style={{ width: "100%", maxWidth: 440 }}>
          {/* Step indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginBottom: 28,
            }}
          >
            {[1, 2].map((s) => (
              <div
                key={s}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background:
                      step >= s
                        ? `linear-gradient(135deg,${C.violet},${C.violetLight})`
                        : "rgba(255,255,255,.06)",
                    border: step >= s ? "none" : `1px solid ${C.glassBorder}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    color: step >= s ? "#fff" : C.textDim,
                    fontWeight: 700,
                  }}
                >
                  {step > s ? "✓" : s}
                </div>
                <span
                  style={{
                    fontSize: 12,
                    color: step >= s ? C.textMid : C.textDim,
                  }}
                >
                  {s === 1 ? "Your details" : "Your interests"}
                </span>
                {s < 2 && (
                  <div
                    style={{
                      width: 36,
                      height: 1,
                      background: step > 1 ? C.violet : C.glassBorder,
                      transition: "background .3s",
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <>
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <h1
                  style={{
                    fontFamily: FONTS.display,
                    fontSize: 28,
                    color: C.text,
                    fontWeight: 700,
                  }}
                >
                  Create your account
                </h1>
                <p style={{ color: C.textMid, fontSize: 14, marginTop: 6 }}>
                  Start your productivity journey today
                </p>
              </div>
              <Glass style={{ padding: 28 }}>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 15 }}
                >
                  <FInput
                    label="Full Name"
                    value={name}
                    onChange={(v) => {
                      setName(v);
                      setError("");
                    }}
                    placeholder="Arjun Sharma"
                    required
                  />
                  <FInput
                    label="Email"
                    value={email}
                    onChange={(v) => {
                      setEmail(v);
                      setError("");
                    }}
                    placeholder="you@email.com"
                    type="email"
                    required
                  />
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 5 }}
                  >
                    <label
                      style={{
                        fontSize: 12,
                        color: C.textMid,
                        fontWeight: 500,
                      }}
                    >
                      Password <span style={{ color: C.red }}>*</span>
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showPass ? "text" : "password"}
                        value={pass}
                        onChange={(e) => {
                          setPass(e.target.value);
                          setError("");
                        }}
                        placeholder="Min. 6 characters"
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
                        {showPass ? "🙈" : "👁"}
                      </button>
                    </div>
                  </div>
                  <FInput
                    label="Confirm Password"
                    value={confirm}
                    onChange={(v) => {
                      setConfirm(v);
                      setError("");
                    }}
                    placeholder="Re-enter password"
                    type="password"
                    required
                  />
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
                  <Btn
                    onClick={nextStep}
                    style={{ width: "100%", padding: "12px" }}
                  >
                    Continue →
                  </Btn>

                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
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
                Already have an account?{" "}
                <span
                  onClick={() => nav("/login")}
                  style={{
                    color: C.violet,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Sign in
                </span>
              </p>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <h1
                  style={{
                    fontFamily: FONTS.display,
                    fontSize: 26,
                    color: C.text,
                    fontWeight: 700,
                  }}
                >
                  What describes you?
                </h1>
                <p style={{ color: C.textMid, fontSize: 14, marginTop: 6 }}>
                  Help us personalise your Lumina experience
                </p>
              </div>
              <Glass style={{ padding: 24 }}>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 10,
                    marginBottom: 22,
                  }}
                >
                  {ALL_INTERESTS.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => toggleInterest(item)}
                      style={{
                        padding: "8px 14px",
                        borderRadius: 20,
                        fontSize: 12,
                        cursor: "pointer",
                        background: interests.includes(item)
                          ? "rgba(124,58,237,.22)"
                          : "rgba(255,255,255,.04)",
                        border: interests.includes(item)
                          ? `1px solid ${C.violet}`
                          : `1px solid ${C.glassBorder}`,
                        color: interests.includes(item) ? "#c4b5fd" : C.textMid,
                        transition: "all .15s",
                        fontWeight: interests.includes(item) ? 600 : 400,
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <Glass
                  style={{
                    padding: 12,
                    background: "rgba(124,58,237,.08)",
                    border: "1px solid rgba(124,58,237,.2)",
                    marginBottom: 16,
                  }}
                >
                  <div style={{ fontSize: 12, color: "#c4b5fd" }}>
                    ⟡ AI will personalise your dashboard based on your
                    selections.
                  </div>
                </Glass>
                <Btn
                  onClick={submit}
                  disabled={loading}
                  style={{ width: "100%", padding: "12px", marginBottom: 8 }}
                >
                  {loading ? "Setting up your account..." : "Launch Lumina ✦"}
                </Btn>
                <button
                  onClick={submit}
                  style={{
                    width: "100%",
                    padding: 8,
                    background: "none",
                    border: "none",
                    color: C.textDim,
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                >
                  Skip for now →
                </button>
              </Glass>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
