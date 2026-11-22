import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Activity, Search, UserRound, Lock, LockKeyholeOpen,
  Sun, Moon, Shield, LogOut, Sparkles, Check
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
    <header className="topbar">
      <div className="brand logo" aria-label="LifeSync home" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        <Activity className="brand-mark" strokeWidth={1.8} />
        <span>LifeSync</span>
      </div>

      <div className="topbar-actions">
        <label className="search-box" htmlFor="lifesync-search">
          <Search size={21} />
          <input id="lifesync-search" type="search" placeholder="Search..." aria-label="Search LifeSync" />
        </label>

        {/* Dark Mode Toggle */}
        <button
          type="button"
          className="nav-action-btn"
          onClick={toggleTheme}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
        </button>

        {/* App Lock Button */}
        <button
          type="button"
          className={`nav-lock-btn ${isLockEnabled ? "active" : ""}`}
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
        >
          {isLockEnabled ? <Lock size={18} /> : <LockKeyholeOpen size={18} />}
          {isLockEnabled && <span className="nav-lock-btn__badge" />}
        </button>

        {/* Profile Avatar & Dropdown */}
        <div className="nav-profile-container" ref={menuRef}>
          <button
            className="avatar"
            type="button"
            aria-label="User Profile"
            onClick={() => setShowProfileMenu((prev) => !prev)}
            title={user?.name || user?.username || "Profile"}
          >
            {user?.profilePic && !imgError ? (
              <img
                src={user.profilePic}
                alt={user.name || user.username}
                className="avatar-img"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="avatar-initials">{userInitials}</span>
            )}
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="profile-dropdown-card glass-card" role="menu">
              <div className="profile-menu-header">
                <div className="profile-menu-avatar">
                  {user?.profilePic && !imgError ? (
                    <img src={user.profilePic} alt={user.name} />
                  ) : (
                    <span>{userInitials}</span>
                  )}
                </div>
                <div className="profile-menu-user">
                  <strong className="profile-menu-name">{user?.name || "User"}</strong>
                  <span className="profile-menu-handle">@{user?.username || "user"}</span>
                  <span className="profile-menu-email">{user?.email}</span>
                </div>
              </div>

              <div className="profile-menu-divider" />

              <div className="profile-menu-items">
                <button
                  type="button"
                  className="profile-menu-btn"
                  onClick={() => {
                    setShowProfileMenu(false);
                    setShowSettingsModal(true);
                  }}
                >
                  <Shield size={16} />
                  <span>App Lock & Privacy</span>
                  {isLockEnabled && (
                    <span className="profile-badge-active">Active</span>
                  )}
                </button>

                <button
                  type="button"
                  className="profile-menu-btn"
                  onClick={toggleTheme}
                >
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}
                  <span>Theme: {isDark ? "Dark" : "Light"}</span>
                </button>

                <button
                  type="button"
                  className="profile-menu-btn profile-menu-btn--danger"
                  onClick={handleLogout}
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
