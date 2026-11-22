import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Activity, Lock, User, Mail, Eye, EyeOff, Loader2, ArrowRight, Sparkles } from "lucide-react";
import authApi from "../../api/auth.api";
import { setUser, setAuthLoading } from "../../store/features/authSlice";

const PROFESSIONS = [
  "developer", "designer", "student", "freelancer",
  "professional", "writer", "artist", "researcher", "other"
];

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    gender: "other",
    profession: "developer",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, username, email, password } = formData;
    if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const data = await authApi.register({
        name: name.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        password,
        gender: formData.gender,
        profession: formData.profession,
      });

      if (data?.user) {
        dispatch(setUser(data.user));
        dispatch(setAuthLoading(false));
        navigate("/", { replace: true });
      } else {
        setError(data?.message || "Registration failed");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to create account. Username or email may already be in use."
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

      <div className="w-full max-w-lg p-8 sm:p-10 rounded-3xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white dark:border-zinc-800 shadow-2xl relative z-10 my-8">
        {/* Brand */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles size={13} />
            <span>Join 15,000+ Mindful Creators</span>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 mb-3">
            <Activity size={24} strokeWidth={2.4} />
          </div>

          <h1 className="font-serif text-3xl font-bold text-zinc-900 dark:text-white leading-tight">
            Create your{" "}
            <span className="bg-gradient-to-r from-purple-600 to-amber-500 bg-clip-text text-transparent">
              LifeSync Space
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Mindful journaling, productivity & privacy all in one place
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-semibold mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User size={16} className="absolute left-3.5 text-zinc-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Aditya Prakash"
                  required
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 text-sm text-zinc-900 dark:text-white outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Username
              </label>
              <div className="relative flex items-center">
                <User size={16} className="absolute left-3.5 text-zinc-400" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="aditya_prakash"
                  required
                  autoComplete="username"
                  className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 text-sm text-zinc-900 dark:text-white outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail size={16} className="absolute left-3.5 text-zinc-400" />
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="aditya@example.com"
                required
                autoComplete="email"
                className="w-full h-11 pl-10 pr-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 text-sm text-zinc-900 dark:text-white outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Password (min. 6 characters)
            </label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-3.5 text-zinc-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
                autoComplete="new-password"
                className="w-full h-11 pl-10 pr-10 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 text-sm text-zinc-900 dark:text-white outline-none focus:border-purple-500"
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

          <div className="grid grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="gender" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full h-11 px-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 text-sm text-zinc-900 dark:text-white outline-none focus:border-purple-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="profession" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Profession
              </label>
              <select
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                className="w-full h-11 px-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 text-sm text-zinc-900 dark:text-white outline-none focus:border-purple-500 capitalize"
              >
                {PROFESSIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-3 rounded-full font-semibold text-sm text-white bg-gradient-to-r from-purple-600 to-amber-500 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            <span>{loading ? "Creating Account…" : "Create Account"}</span>
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-purple-600 dark:text-purple-400 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
