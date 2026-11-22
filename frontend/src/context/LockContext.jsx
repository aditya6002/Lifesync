import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import authApi from "../api/auth.api";

const LockContext = createContext(null);

const STORAGE_SESSION_LOCKED = "lifesync_session_locked";

export const LockProvider = ({ children }) => {
  const [hasPasscode, setHasPasscode] = useState(false);
  const [isLockEnabled, setIsLockEnabled] = useState(false);
  const [autoLockSetting, setAutoLockSettingState] = useState("1m"); // 'immediately' | '1m' | '5m' | 'tabSwitch' | 'never'
  const [isLocked, setIsLocked] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);

  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const lastActiveRef = useRef(Date.now());
  const hiddenTimeRef = useRef(null);

  // Fetch App Lock status from backend on mount
  const syncLockStatusFromBackend = useCallback(async () => {
    try {
      const res = await authApi.getAppLockStatus();
      if (res?.success && res.appLock) {
        const { isLockEnabled: enabled, hasPasscode: hasPin, autoLock } = res.appLock;
        setHasPasscode(Boolean(hasPin));
        setIsLockEnabled(Boolean(enabled));
        if (autoLock) setAutoLockSettingState(autoLock);

        // If enabled on backend, check if previously locked or default to locked
        if (enabled && hasPin) {
          const wasUnlocked = sessionStorage.getItem(STORAGE_SESSION_LOCKED) === "false";
          setIsLocked(!wasUnlocked);
        } else {
          setIsLocked(false);
          sessionStorage.removeItem(STORAGE_SESSION_LOCKED);
        }
      }
    } catch {
      // User might not be logged in yet
      setIsLocked(false);
    } finally {
      setLoadingStatus(false);
    }
  }, []);

  useEffect(() => {
    syncLockStatusFromBackend();
  }, [syncLockStatusFromBackend]);

  // Sync session locked state
  useEffect(() => {
    if (isLockEnabled && hasPasscode) {
      sessionStorage.setItem(STORAGE_SESSION_LOCKED, isLocked ? "true" : "false");
    } else {
      sessionStorage.removeItem(STORAGE_SESSION_LOCKED);
    }
  }, [isLocked, isLockEnabled, hasPasscode]);

  const lockApp = useCallback(() => {
    if (!hasPasscode) {
      setShowSetupModal(true);
      return;
    }
    setIsLocked(true);
    sessionStorage.setItem(STORAGE_SESSION_LOCKED, "true");
  }, [hasPasscode]);

  // Verify PIN with Backend
  const unlockApp = useCallback(async (pin) => {
    try {
      const res = await authApi.verifyAppLock(pin);
      if (res?.success) {
        setIsLocked(false);
        sessionStorage.setItem(STORAGE_SESSION_LOCKED, "false");
        lastActiveRef.current = Date.now();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  // Save new passcode to Backend
  const setPasscode = useCallback(async (pin) => {
    const res = await authApi.setAppLock({ passcode: pin, autoLock: autoLockSetting });
    if (res?.success) {
      setHasPasscode(true);
      setIsLockEnabled(true);
      setIsLocked(false);
      sessionStorage.setItem(STORAGE_SESSION_LOCKED, "false");
      return true;
    }
    return false;
  }, [autoLockSetting]);

  // Remove passcode on Backend
  const removePasscode = useCallback(async (currentPin) => {
    try {
      const res = await authApi.removeAppLock(currentPin);
      if (res?.success) {
        setHasPasscode(false);
        setIsLockEnabled(false);
        setIsLocked(false);
        sessionStorage.removeItem(STORAGE_SESSION_LOCKED);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  // Change passcode on Backend
  const changePasscode = useCallback(async (oldPin, newPin) => {
    try {
      // First verify old passcode
      const verifyRes = await authApi.verifyAppLock(oldPin);
      if (!verifyRes?.success) return false;

      // Then save new passcode
      const setRes = await authApi.setAppLock({ passcode: newPin, autoLock: autoLockSetting });
      return Boolean(setRes?.success);
    } catch {
      return false;
    }
  }, [autoLockSetting]);

  // Toggle lock enabled state on Backend
  const toggleLockEnabled = useCallback(async (enabled) => {
    if (enabled && !hasPasscode) {
      setShowSetupModal(true);
      return;
    }
    try {
      const res = await authApi.toggleAppLock(enabled);
      if (res?.success) {
        setIsLockEnabled(enabled);
        if (!enabled) {
          setIsLocked(false);
          sessionStorage.setItem(STORAGE_SESSION_LOCKED, "false");
        }
      }
    } catch (err) {
      console.error("Failed to toggle app lock", err);
    }
  }, [hasPasscode]);

  // Update auto-lock timeout setting on Backend
  const setAutoLockSetting = useCallback(async (setting) => {
    setAutoLockSettingState(setting);
    try {
      await authApi.updateAppLockSettings(setting);
    } catch (err) {
      console.error("Failed to update auto lock setting", err);
    }
  }, []);

  // Forgot Passcode Recovery via Account Password
  const recoverPasscode = useCallback(async ({ accountPassword, newPasscode }) => {
    try {
      const res = await authApi.forgotAppLock({ accountPassword, newPasscode });
      if (res?.success) {
        if (newPasscode) {
          setHasPasscode(true);
          setIsLockEnabled(true);
        } else {
          setHasPasscode(false);
          setIsLockEnabled(false);
        }
        setIsLocked(false);
        sessionStorage.setItem(STORAGE_SESSION_LOCKED, "false");
        return { success: true, message: res.message };
      }
      return { success: false, message: res?.message || "Recovery failed" };
    } catch (err) {
      return {
        success: false,
        message: err?.response?.data?.message || "Incorrect account password",
      };
    }
  }, []);

  // Inactivity tracking & auto-lock
  useEffect(() => {
    if (!isLockEnabled || isLocked || autoLockSetting === "never") return;

    const getTimeoutMs = () => {
      switch (autoLockSetting) {
        case "immediately":
          return 30 * 1000;
        case "1m":
          return 60 * 1000;
        case "5m":
          return 5 * 60 * 1000;
        default:
          return 60 * 1000;
      }
    };

    const handleUserActivity = () => {
      lastActiveRef.current = Date.now();
    };

    const events = ["mousedown", "mousemove", "keydown", "touchstart", "scroll"];
    events.forEach((ev) => window.addEventListener(ev, handleUserActivity, { passive: true }));

    const interval = setInterval(() => {
      const timeout = getTimeoutMs();
      if (Date.now() - lastActiveRef.current >= timeout) {
        setIsLocked(true);
        sessionStorage.setItem(STORAGE_SESSION_LOCKED, "true");
      }
    }, 4000);

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, handleUserActivity));
      clearInterval(interval);
    };
  }, [isLockEnabled, isLocked, autoLockSetting]);

  // Tab switch / visibility change auto-lock (Apple Journal behavior)
  useEffect(() => {
    if (!isLockEnabled || isLocked) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        hiddenTimeRef.current = Date.now();
        if (autoLockSetting === "immediately" || autoLockSetting === "tabSwitch") {
          setIsLocked(true);
          sessionStorage.setItem(STORAGE_SESSION_LOCKED, "true");
        }
      } else if (document.visibilityState === "visible") {
        if (hiddenTimeRef.current && autoLockSetting !== "never") {
          let timeoutMs = 60 * 1000;
          if (autoLockSetting === "5m") timeoutMs = 5 * 60 * 1000;
          if (autoLockSetting === "1m") timeoutMs = 60 * 1000;

          if (Date.now() - hiddenTimeRef.current >= timeoutMs) {
            setIsLocked(true);
            sessionStorage.setItem(STORAGE_SESSION_LOCKED, "true");
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isLockEnabled, isLocked, autoLockSetting]);

  return (
    <LockContext.Provider
      value={{
        isLocked,
        hasPasscode,
        isLockEnabled,
        autoLockSetting,
        loadingStatus,
        showSetupModal,
        showSettingsModal,
        showForgotModal,
        setShowSetupModal,
        setShowSettingsModal,
        setShowForgotModal,
        lockApp,
        unlockApp,
        setPasscode,
        removePasscode,
        changePasscode,
        toggleLockEnabled,
        setAutoLockSetting,
        recoverPasscode,
        syncLockStatusFromBackend,
      }}
    >
      {children}
    </LockContext.Provider>
  );
};

export const useLock = () => {
  const ctx = useContext(LockContext);
  if (!ctx) {
    throw new Error("useLock must be used within a LockProvider");
  }
  return ctx;
};

export default LockContext;
