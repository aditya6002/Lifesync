import { useState } from "react";
import { KeyRound, X, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { useLock } from "../../context/LockContext";

const LockForgotModal = () => {
  const { showForgotModal, setShowForgotModal, recoverPasscode } = useLock();
  const [accountPassword, setAccountPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetChoice, setResetChoice] = useState("remove");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  if (!showForgotModal) return null;

  const handleClose = () => {
    setShowForgotModal(false);
    setAccountPassword("");
    setNewPin("");
    setConfirmPin("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!accountPassword.trim()) {
      setErrorMessage("Please enter your account password");
      return;
    }

    if (resetChoice === "new") {
      if (newPin.length !== 4) {
        setErrorMessage("New passcode must be 4 digits");
        return;
      }
      if (newPin !== confirmPin) {
        setErrorMessage("New passcodes do not match");
        return;
      }
    }

    setLoading(true);
    try {
      const res = await recoverPasscode({
        accountPassword,
        newPasscode: resetChoice === "new" ? newPin : null,
      });

      if (res.success) {
        setSuccessMessage(res.message);
        setTimeout(() => handleClose(), 1200);
      } else {
        setErrorMessage(res.message || "Verification failed. Check your password.");
      }
    } catch {
      setErrorMessage("Network error during recovery. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md p-6 sm:p-7 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
            <KeyRound size={24} />
          </div>
          <h3 className="font-serif text-2xl font-bold text-zinc-900 dark:text-white">
            Forgot Passcode?
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs leading-relaxed">
            Verify your LifeSync account password to unlock your vault and reset or remove the passcode.
          </p>
        </div>

        {successMessage ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-emerald-600 dark:text-emerald-400 gap-2">
            <CheckCircle2 size={40} />
            <p className="font-semibold text-sm">{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="account-password" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Account Login Password
              </label>
              <div className="relative flex items-center">
                <input
                  id="account-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your account password"
                  value={accountPassword}
                  onChange={(e) => {
                    setAccountPassword(e.target.value);
                    setErrorMessage("");
                  }}
                  className="w-full h-11 pl-4 pr-10 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 text-sm text-zinc-900 dark:text-white outline-none focus:border-purple-500"
                  required
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

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Action after verification:
              </span>
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80">
                <button
                  type="button"
                  onClick={() => setResetChoice("remove")}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                    resetChoice === "remove"
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  Remove Passcode
                </button>
                <button
                  type="button"
                  onClick={() => setResetChoice("new")}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                    resetChoice === "new"
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  Set New Passcode
                </button>
              </div>
            </div>

            {resetChoice === "new" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor="new-pin" className="text-xs font-bold text-zinc-500 dark:text-zinc-400">New PIN</label>
                  <input
                    id="new-pin"
                    type="password"
                    maxLength={4}
                    placeholder="••••"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                    className="h-10 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 text-center tracking-widest text-lg font-bold"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="confirm-pin" className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Confirm PIN</label>
                  <input
                    id="confirm-pin"
                    type="password"
                    maxLength={4}
                    placeholder="••••"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                    className="h-10 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 text-center tracking-widest text-lg font-bold"
                    required
                  />
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="text-xs font-semibold text-rose-500 text-center">{errorMessage}</div>
            )}

            <div className="flex items-center justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2 rounded-full text-xs font-semibold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-amber-500 shadow-md shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                <span>{loading ? "Verifying…" : "Verify & Unlock"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LockForgotModal;
