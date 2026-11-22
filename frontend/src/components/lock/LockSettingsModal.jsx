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
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={() => setShowSettingsModal(false)}
    >
      <div
        className="w-full max-w-md p-6 sm:p-7 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Lock size={20} />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-zinc-900 dark:text-white">
                App Lock & Security
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Manage your private vault protection
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowSettingsModal(false)}
            aria-label="Close"
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Toggle Lock row */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800">
            <div>
              <strong className="text-sm font-semibold text-zinc-900 dark:text-white block">
                App Lock Protection
              </strong>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {isLockEnabled ? "Vault lock is active" : "App lock is currently disabled"}
              </span>
            </div>
            <button
              type="button"
              onClick={toggleLockEnabled}
              className={`w-12 h-6.5 rounded-full p-1 transition-colors ${
                isLockEnabled ? "bg-purple-600" : "bg-zinc-300 dark:bg-zinc-700"
              }`}
            >
              <div
                className={`w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform ${
                  isLockEnabled ? "translate-x-5.5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Quick Lock Now button */}
          {hasPasscode && (
            <button
              type="button"
              onClick={() => {
                setShowSettingsModal(false);
                lockApp();
              }}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
              🔒 Lock LifeSync Now
            </button>
          )}

          {/* Action List */}
          {hasPasscode && (
            <div className="flex flex-col gap-1.5 pt-2 border-t border-zinc-200/60 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setShowSettingsModal(false);
                  setShowSetupModal(true);
                }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
              >
                <KeyRound size={15} className="text-purple-500" />
                <span>Change 4-Digit Passcode</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowSettingsModal(false);
                  setShowForgotModal(true);
                }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
              >
                <Shield size={15} className="text-blue-500" />
                <span>Forgot Passcode? Recover with Password</span>
              </button>

              {!confirmingRemove ? (
                <button
                  type="button"
                  onClick={() => setConfirmingRemove(true)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left"
                >
                  <Trash2 size={15} />
                  <span>Remove Passcode</span>
                </button>
              ) : (
                <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 flex flex-col gap-2 mt-1">
                  <span className="text-xs font-semibold text-rose-700 dark:text-rose-300">
                    Enter current passcode to remove:
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="Current PIN"
                      value={currentPinInput}
                      onChange={(e) => {
                        setCurrentPinInput(e.target.value);
                        setRemoveError("");
                      }}
                      className="flex-1 h-9 px-3 rounded-lg bg-white dark:bg-zinc-800 border border-rose-300 dark:border-rose-800 text-sm outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleRemove}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-semibold text-xs hover:bg-rose-700"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmingRemove(false);
                        setCurrentPinInput("");
                        setRemoveError("");
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800"
                    >
                      Cancel
                    </button>
                  </div>
                  {removeError && (
                    <span className="text-xs font-semibold text-rose-600">{removeError}</span>
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
