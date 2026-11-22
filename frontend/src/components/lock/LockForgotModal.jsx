import { useState } from "react";
import { KeyRound, X, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { useLock } from "../../context/LockContext";

const LockForgotModal = () => {
  const { showForgotModal, setShowForgotModal, recoverPasscode } = useLock();
  const [accountPassword, setAccountPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetChoice, setResetChoice] = useState("remove"); // "remove" | "new"
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
        setTimeout(() => {
          handleClose();
        }, 1200);
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
      className="applock-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Forgot Passcode Recovery"
      onClick={handleClose}
    >
      <div
        className="applock-modal-card applock-forgot-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="applock-modal-close"
          onClick={handleClose}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="applock-modal-header">
          <div className="applock-modal-icon">
            <KeyRound size={26} />
          </div>
          <h2 className="applock-modal-title">Forgot Passcode?</h2>
          <p className="applock-modal-sub">
            Verify your LifeSync account password to unlock your app and reset or remove the passcode.
          </p>
        </div>

        {successMessage ? (
          <div className="applock-forgot-success">
            <CheckCircle2 size={36} className="text-emerald-500" />
            <p>{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="applock-forgot-form">
            <div className="applock-input-group">
              <label htmlFor="account-password" className="applock-label">
                Account Login Password
              </label>
              <div className="applock-input-wrap">
                <input
                  id="account-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your account password"
                  value={accountPassword}
                  onChange={(e) => {
                    setAccountPassword(e.target.value);
                    setErrorMessage("");
                  }}
                  className="applock-text-input"
                  required
                />
                <button
                  type="button"
                  className="applock-input-eye"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="applock-choice-group">
              <span className="applock-label">Action after verification:</span>
              <div className="applock-choice-tabs">
                <button
                  type="button"
                  className={`applock-choice-btn ${resetChoice === "remove" ? "active" : ""}`}
                  onClick={() => setResetChoice("remove")}
                >
                  Unlock & Remove Passcode
                </button>
                <button
                  type="button"
                  className={`applock-choice-btn ${resetChoice === "new" ? "active" : ""}`}
                  onClick={() => setResetChoice("new")}
                >
                  Set New Passcode
                </button>
              </div>
            </div>

            {resetChoice === "new" && (
              <div className="applock-new-pin-row">
                <div className="applock-input-group">
                  <label htmlFor="new-pin" className="applock-label">New 4-digit PIN</label>
                  <input
                    id="new-pin"
                    type="password"
                    maxLength={4}
                    placeholder="••••"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                    className="applock-pin-input"
                    required
                  />
                </div>
                <div className="applock-input-group">
                  <label htmlFor="confirm-pin" className="applock-label">Confirm PIN</label>
                  <input
                    id="confirm-pin"
                    type="password"
                    maxLength={4}
                    placeholder="••••"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                    className="applock-pin-input"
                    required
                  />
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="applock-modal-err">{errorMessage}</div>
            )}

            <div className="applock-forgot-actions">
              <button
                type="button"
                className="jnl-btn jnl-btn--ghost"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="jnl-btn jnl-btn--primary"
                disabled={loading}
              >
                {loading ? <Loader2 size={15} className="jnl-spin" /> : null}
                {loading ? "Verifying…" : "Verify & Unlock"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LockForgotModal;
