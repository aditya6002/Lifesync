// src/features/auth/hooks/useAuthForm.ts
import { useState } from "react";
import { useAuth } from "../auth.context";

// ── Login form hook ───────────────────────────────────────
export function useLoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("arjun@lumina.app");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!email || !password) {
      setError("Please fill all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, password, setPassword, loading, error, submit };
}

// ── Signup form hook ──────────────────────────────────────
export function useSignupForm() {
  const { signup } = useAuth();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("Arjun Sharma");
  const [email, setEmail] = useState("arjun@lumina.app");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [interests, setInterests] = useState([
    "📚 Student",
    "💰 Budget tracking",
  ]);

  const nextStep = () => {
    if (!name || !email || !pass) {
      setError("Please fill all fields.");
      return;
    }
    if (pass !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (pass.length < 6) {
      setError("Minimum 6 characters.");
      return;
    }
    setError("");
    setStep(2);
  };

  const toggleInterest = (item) =>
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );

  const submit = async () => {
    setLoading(true);
    try {
      await signup({ name, email, password: pass });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}
