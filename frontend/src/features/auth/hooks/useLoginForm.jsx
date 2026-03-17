import { useState } from "react";
// import { useAuth } from "../auth.context";
import { useLoader } from "../../../shared/components/ui/GlobalLoader";

// ── Login form hook ───────────────────────────────────────
export function useLoginForm() {
  const { login, setUser, user } = {};
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { withLoader } = useLoader();

  const submit = async () => {
    if (!email || !password) {
      setError("Please fill all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = withLoader(await login({ email, password }), "Sign in...");
      setUser(res.data.user);
      console.log(res);
      console.log(res.data.user);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, password, setPassword, loading, error, submit };
}
