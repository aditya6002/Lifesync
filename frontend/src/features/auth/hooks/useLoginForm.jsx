import { useState } from "react";
import { authApi } from "../auth.api";
// import { useLoader } from "../../../shared/components/ui/GlobalLoader";
import { useDispatch, useSelector } from "react-redux";
import {
  setAccessToken,
  setError,
  setLoading,
  setToast,
  setUser,
} from "../../../store/features/auth/authSlice";

// ── Login form hook ───────────────────────────────────────
export function useLoginForm() {
  const { error, loading } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const { withLoader } = useLoader();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!email || !password) {
      dispatch(setError("Please fill all fields."));
      return;
    }
    dispatch(setError(null));
    dispatch(setLoading(true));
    try {
      // const res = withLoader(
      const res = await authApi.login({ email, password });
      // "Sign in...",
      // );
      dispatch(setUser(res.data.user));
      dispatch(setAccessToken(res.data.accessToken));
      dispatch(setToast("Welcome back"));
    } catch (e) {
      dispatch(setError(e instanceof Error ? e.message : "Login failed."));
    } finally {
      dispatch(setLoading(false));
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
