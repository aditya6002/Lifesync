import { useState } from "react";
import { authApi } from "../auth.api";
import { useLoader } from "../../../shared/components/ui/GlobalLoader";
import { useDispatch, useSelector } from "react-redux";
import {
  setAccessToken,
  setAuthLoading,
  setError,
  setLoading,
  setToast,
  setUser,
} from "../../../store/features/auth/authSlice";
import { useNavigate } from "react-router";

// ── Login form hook ───────────────────────────────────────
export function useLoginForm() {
  const { error, loading } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const { withLoader } = useLoader();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!email || !password) {
      dispatch(setError("Please fill all fields."));
      return;
    }
    dispatch(setError(null));
    dispatch(setLoading(true));
    dispatch(setAuthLoading(true));
    try {
      // const res = await withLoader(
      const res = await authApi.login({ email, password });
      // "Sign in...",
      // );
      console.dir("res", res);
      dispatch(setUser(res.data.user));
      dispatch(setAccessToken(res.data.accessToken));

      nav("/dashboard");
      dispatch(setToast("Welcome back"));
    } catch (error) {
      console.dir("err", error);
      const errMsg =
        error.response.data.message || error.response.data.msg || error.message;
      dispatch(setError(error instanceof Error ? errMsg : "Login failed."));
    } finally {
      dispatch(setLoading(false));
      dispatch(setAuthLoading(false));
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleLogin,
  };
}
