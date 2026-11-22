import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Activity, Lock, User, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
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

  // If already logged in, redirect to home
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
        // Sync app lock from backend for this user
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
    <div className="auth-shell">
      <div className="auth-card glass-card">
        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-brand__icon">
            <Activity size={26} strokeWidth={2.2} />
          </div>
          <h1 className="auth-title">Welcome back to LifeSync</h1>
          <p className="auth-subtitle">Sign in to your private journal and daily dashboard</p>
        </div>

        {error && (
          <div className="auth-error-banner" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="auth-field">
            <label htmlFor="loginId">Email or Username</label>
            <div className="auth-input-wrap">
              <User size={17} className="auth-input-icon" />
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
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <div className="auth-input-wrap">
              <Lock size={17} className="auth-input-icon" />
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
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? <Loader2 size={16} className="jnl-spin" /> : null}
            <span>{loading ? "Signing in…" : "Sign In"}</span>
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="auth-link">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
