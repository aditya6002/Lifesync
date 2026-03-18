import { useState } from "react";

import {
  setUser,
  setAccessToken,
  setError,
  setLoading,
  setAuthLoading,
} from "../../../store/features/auth/authSlice";
import { authApi } from "../auth.api";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
// import { useLoader } from "../../../shared/components/ui/GlobalLoader";

// ── Signup form hook ──────────────────────────────────────
export function useSignupForm() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("aadi");
  const [username, setUsername] = useState("aadi993");
  const [email, setEmail] = useState("aadi@gmail.com");
  const [pass, setPass] = useState("aadi000");
  const [confirm, setConfirm] = useState("aadi000");
  const { loading, error } = useSelector((state) => state.auth);

  const [interests, setInterests] = useState([
    "📚 Student",
    "💰 Budget tracking",
  ]);

  const nav = useNavigate();
  const dispatch = useDispatch();

  const nextStep = () => {
    if (!name || !email || !pass) {
      dispatch(setError("Please fill all fields."));
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

  const handleSignUp = async () => {
    dispatch(setLoading(true));
    dispatch(setAuthLoading(true));
    try {
      const res = await authApi.signup({
        name: name,
        username: username,
        email: email,
        password: pass,
        confirmPassword: confirm,
        interests: interests,
      });
      dispatch(setAccessToken(res.data.accessToken));
      dispatch(setUser(res.data.user));
      nav("/");
    } catch (e) {
      setStep(1);
      const errMsg =
        e.response.data.message || e.response.data.msg || e.message;
      dispatch(setError(e instanceof Error ? errMsg : "Signup failed."));
      console.dir(e);
    } finally {
      dispatch(setLoading(false));
      dispatch(setAuthLoading(false));
    }
  };

  return {
    step,
    setStep,
    name,
    setName,
    username,
    setUsername,
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
    handleSignUp,
  };
}
