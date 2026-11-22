import { useState } from "react";
import { Lock, X, Shield, Clock, KeyRound, Trash2 } from "lucide-react";
import { useLock } from "../../context/LockContext";

const LockSettingsModal = () => {
  const {
    showSettingsModal,
    setShowSettingsModal,
    hasPasscode,
    isLockEnabled,
    autoLockSetting,
    lockApp,
    toggleLockEnabled,
    setAutoLockSetting,
    setShowSetupModal,
    setShowForgotModal,
    removePasscode,
  } = useLock();

  const [confirmingRemove, setConfirmingRemove] = useState(false);
  const [currentPinInput, setCurrentPinInput] = useState("");
  const [removeError, setRemoveError] = useState("");

  if (!showSettingsModal) return null;

  const handleRemove = async () => {
    if (!currentPinInput) {
      setRemoveError("Enter your current passcode");
      return;
    }
    const ok = await removePasscode(currentPinInput);
    if (ok) {
      setConfirmingRemove(false);
      setCurrentPinInput("");
      setRemoveError("");
      setShowSettingsModal(false);
    } else {
      setRemoveError("Incorrect passcode");
    }
  };

  return (
    <div
      className="applock-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="App Lock Settings"
      onClick={() => setShowSettingsModal(false)}
    >
      <div
        className="applock-modal-card applock-settings-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="applock-modal-close"
          onClick={() => setShowSettingsModal(false)}
          aria-label="Close settings"
        >
          <X size={18} />
        </button>

        <div className="applock-modal-header">
          <div className="applock-modal-icon">
            <Shield size={24} />
          </div>
          <h2 className="applock-modal-title">App Lock & Security</h2>
          <p className="applock-modal-sub">
            Protect your private journal, notes, and records with a passcode lock
          </p>
        </div>

        <div className="applock-settings-body">
          {/* Main Toggle */}
          <div className="applock-setting-item">
            <div className="applock-setting-info">
              <span className="applock-setting-title">Require Passcode</span>
              <span className="applock-setting-desc">
                {hasPasscode
                  ? isLockEnabled
                    ? "App will lock according to your timeout preference"
                    : "Passcode is set but locking is turned off"
                  : "No passcode set. Turn on to create one."}
              </span>
            </div>
            <button
              type="button"
              className={`applock-switch ${isLockEnabled ? "checked" : ""}`}
              onClick={() => {
                if (!hasPasscode) {
                  setShowSettingsModal(false);
                  setShowSetupModal(true);
                } else {
                  toggleLockEnabled(!isLockEnabled);
                }
              }}
              aria-label="Toggle require passcode"
            >
              <span className="applock-switch-handle" />
            </button>
          </div>

          {/* Quick Lock Now button if enabled */}
          {isLockEnabled && (
            <div className="applock-setting-item">
              <div className="applock-setting-info">
                <span className="applock-setting-title">Lock Now</span>
                <span className="applock-setting-desc">
                  Immediately lock the screen with passcode
                </span>
              </div>
              <button
                type="button"
                className="jnl-btn jnl-btn--primary jnl-btn--sm"
                onClick={() => {
                  setShowSettingsModal(false);
                  lockApp();
                }}
              >
                <Lock size={14} /> Lock App
              </button>
            </div>
          )}

          {/* Auto-Lock timeout selector */}
          {isLockEnabled && (
            <div className="applock-setting-section">
              <div className="applock-section-title">
                <Clock size={13} />
                <span>Auto-Lock Timeout</span>
              </div>
              <div className="applock-options-list">
                {[
                  { id: "immediately", label: "Immediately upon leaving" },
                  { id: "1m", label: "After 1 minute of inactivity" },
                  { id: "5m", label: "After 5 minutes of inactivity" },
                  { id: "tabSwitch", label: "Whenever switching tabs" },
                  { id: "never", label: "Never (manual lock only)" },
                ].map((opt) => (
                  <label key={opt.id} className="applock-radio-label">
                    <span>{opt.label}</span>
                    <input
                      type="radio"
                      name="autolock"
                      value={opt.id}
                      checked={autoLockSetting === opt.id}
                      onChange={() => setAutoLockSetting(opt.id)}
                    />
                    <span className="applock-radio-mark" />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Passcode actions */}
          {hasPasscode && (
            <div className="applock-setting-actions">
              <button
                type="button"
                className="applock-action-btn"
                onClick={() => {
                  setShowSettingsModal(false);
                  setShowSetupModal(true);
                }}
              >
                <KeyRound size={15} />
                <span>Change 4-Digit Passcode</span>
              </button>

              <button
                type="button"
                className="applock-action-btn"
                onClick={() => {
                  setShowSettingsModal(false);
                  setShowForgotModal(true);
                }}
              >
                <Shield size={15} />
                <span>Forgot Passcode? Recover with Password</span>
              </button>

              {!confirmingRemove ? (
                <button
                  type="button"
                  className="applock-action-btn applock-action-btn--danger"
                  onClick={() => setConfirmingRemove(true)}
                >
                  <Trash2 size={15} />
                  <span>Remove Passcode</span>
                </button>
              ) : (
                <div className="applock-remove-box">
                  <span className="applock-remove-msg">
                    Enter current passcode to remove:
                  </span>
                  <div className="applock-remove-row">
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="Current PIN"
                      value={currentPinInput}
                      onChange={(e) => {
                        setCurrentPinInput(e.target.value);
                        setRemoveError("");
                      }}
                      className="applock-remove-input"
                    />
                    <button
                      type="button"
                      className="jnl-btn jnl-btn--danger jnl-btn--sm"
                      onClick={handleRemove}
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      className="jnl-btn jnl-btn--ghost jnl-btn--sm"
                      onClick={() => {
                        setConfirmingRemove(false);
                        setCurrentPinInput("");
                        setRemoveError("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                  {removeError && (
                    <span className="applock-err">{removeError}</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LockSettingsModal;
