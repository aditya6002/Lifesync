import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Activity,
  Search,
  Lock,
  LockKeyholeOpen,
  Sun,
  Moon,
  Shield,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useLock } from "../context/LockContext";
import { useTheme } from "../context/ThemeContext";
import authApi from "../api/auth.api";
import { logoutUser } from "../store/features/authSlice";

const Nav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { isLockEnabled, hasPasscode, lockApp, setShowSettingsModal, setShowSetupModal } = useLock();
  const { isDark, toggleTheme } = useTheme();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [imgError, setImgError] = useState(false);
  const menuRef = useRef(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showProfileMenu]);

  const handleLockClick = () => {
    if (!hasPasscode) {
      setShowSetupModal(true);
    } else if (isLockEnabled) {
      lockApp();
    } else {
      setShowSettingsModal(true);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Continue client logout even if network error
    } finally {
      dispatch(logoutUser());
      navigate("/login", { replace: true });
    }
  };

  const userInitials = (user?.name || user?.username || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="fixed top-4 left-4 right-4 sm:left-8 sm:right-8 md:left-12 md:right-12 z-40 h-16 sm:h-[72px] px-4 sm:px-6 flex items-center justify-between rounded-3xl bg-white/75 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/80 dark:border-zinc-800 shadow-lg shadow-purple-950/5 dark:shadow-black/40 transition-all duration-300">
      {/* Brand */}
      <div
        className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group"
        onClick={() => navigate("/")}
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-600/20 group-hover:scale-105 transition-transform">
          <Activity size={20} strokeWidth={2.4} />
        </div>
        <span className="font-serif text-2xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 via-purple-900 to-amber-700 dark:from-white dark:via-purple-200 dark:to-amber-400 bg-clip-text text-transparent">
          LifeSync
        </span>
      </div>

      {/* Topbar Actions */}
      <div className="flex items-center gap-2 sm:gap-3.5">
        {/* Search Input */}
        <label
          htmlFor="lifesync-search"
          className="hidden md:flex items-center gap-2.5 h-11 px-4 rounded-full bg-zinc-100/70 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 text-zinc-400 focus-within:border-purple-500 focus-within:text-purple-600 dark:focus-within:text-purple-400 focus-within:ring-2 focus-within:ring-purple-500/10 transition-all w-52 lg:w-72"
        >
          <Search size={17} />
          <input
            id="lifesync-search"
            type="search"
            placeholder="Search LifeSync..."
            className="w-full bg-transparent text-sm text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none"
          />
        </label>

        {/* Dark Mode Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle theme"
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-100/80 dark:bg-zinc-800/70 border border-zinc-200/80 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-200 hover:scale-105 active:scale-95 transition-all"
        >
          {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
        </button>

        {/* App Lock Button */}
        <button
          type="button"
          onClick={handleLockClick}
          onContextMenu={(e) => {
            e.preventDefault();
            setShowSettingsModal(true);
          }}
          title={
            !hasPasscode
              ? "Set up App Passcode Lock"
              : isLockEnabled
              ? "Lock LifeSync (Right-click for Settings)"
              : "App Lock Disabled (Click to open Settings)"
          }
          aria-label="App Lock"
          className={`relative w-10 h-10 rounded-xl flex items-center justify-center border transition-all hover:scale-105 active:scale-95 ${
            isLockEnabled
              ? "bg-purple-500/10 dark:bg-purple-500/20 border-purple-500/40 text-purple-600 dark:text-purple-400 shadow-sm shadow-purple-500/20"
              : "bg-zinc-100/80 dark:bg-zinc-800/70 border-zinc-200/80 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-200"
          }`}
        >
          {isLockEnabled ? <Lock size={18} /> : <LockKeyholeOpen size={18} />}
          {isLockEnabled && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900 animate-pulse" />
          )}
        </button>

        {/* Profile Avatar & Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            aria-label="User Profile"
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-gradient-to-tr from-purple-600 to-amber-500 p-0.5 ring-2 ring-white dark:ring-zinc-800 shadow-md shadow-purple-600/20 hover:scale-105 transition-transform"
          >
            {user?.profilePic && !imgError ? (
              <img
                src={user.profilePic}
                alt={user.name || user.username}
                className="w-full h-full rounded-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="font-bold text-xs tracking-wider">{userInitials}</span>
            )}
          </button>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute top-full right-0 mt-3 w-64 p-2 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-2xl shadow-purple-950/20 animate-in fade-in zoom-in-95 duration-150 z-50">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {userInitials}
                </div>
                <div className="overflow-hidden">
                  <p className="font-semibold text-sm text-zinc-900 dark:text-white truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-medium truncate">
                    @{user?.username || "user"}
                  </p>
                </div>
              </div>

              <div className="h-px bg-zinc-200/60 dark:bg-zinc-800 my-1.5" />

              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    setShowSettingsModal(true);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  <Shield size={16} />
                  <span>App Lock & Privacy</span>
                  {isLockEnabled && (
                    <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      Active
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-purple-50 dark:hover:bg-purple-950/30 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}
                  <span>Theme: {isDark ? "Dark" : "Light"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Nav;
