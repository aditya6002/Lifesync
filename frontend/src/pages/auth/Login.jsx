import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Activity, Lock, User, Eye, EyeOff, Loader2, ArrowRight, Sparkles } from "lucide-react";
import authApi from "../../api/auth.api";
import { setUser, setAuthLoading } from "../../store/features/authSlice";
import { useLock } from "../../context/LockContext";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { syncLockStatusFromBackend } = useLock();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!loginId.trim() || !password.trim()) {
      setError("Please fill in both fields");
      return;
    }

    setLoading(true);
    try {
      const data = await authApi.login({
        loginId: loginId.trim(),
        password: password.trim(),
      });

      if (data?.user) {
        dispatch(setUser(data.user));
        dispatch(setAuthLoading(false));
        if (syncLockStatusFromBackend) {
          syncLockStatusFromBackend();
        }
        navigate("/", { replace: true });
      } else {
        setError(data?.message || "Login failed");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "Invalid credentials. Please check your username/email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#fbf2ef] dark:bg-[#120f17] relative overflow-hidden transition-colors duration-300">
      {/* Background Blobs */}
      <div className="absolute top-10 -left-10 w-96 h-96 rounded-full bg-purple-400/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-10 w-96 h-96 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white dark:border-zinc-800 shadow-2xl relative z-10">
        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-7">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles size={13} />
            <span>Encrypted Life Vault</span>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 mb-3">
            <Activity size={24} strokeWidth={2.4} />
          </div>

          <h1 className="font-serif text-3xl font-bold text-zinc-900 dark:text-white leading-tight">
            Welcome back to{" "}
            <span className="bg-gradient-to-r from-purple-600 to-amber-500 bg-clip-text text-transparent">
              LifeSync
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Sign in to your private journal and daily dashboard
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-semibold mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="loginId" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Email or Username
            </label>
            <div className="relative flex items-center">
              <User size={17} className="absolute left-3.5 text-zinc-400" />
              <input
                id="loginId"
                type="text"
                value={loginId}
                onChange={(e) => {
                  setLoginId(e.target.value);
                  setError("");
                }}
                placeholder="username or email@example.com"
                required
                autoComplete="username"
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 text-sm text-zinc-900 dark:text-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/15"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock size={17} className="absolute left-3.5 text-zinc-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="w-full h-11 pl-10 pr-10 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 text-sm text-zinc-900 dark:text-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/15"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-2 rounded-full font-semibold text-sm text-white bg-gradient-to-r from-purple-600 to-amber-500 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            <span>{loading ? "Signing in…" : "Sign In to Vault"}</span>
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
          Don't have an account?{" "}
          <Link to="/signup" className="font-bold text-purple-600 dark:text-purple-400 hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
