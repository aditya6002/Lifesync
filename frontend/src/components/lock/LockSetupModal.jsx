import { useState, useEffect, useCallback } from "react";
import { ShieldCheck, X, Delete } from "lucide-react";
import { useLock } from "../../context/LockContext";

const KEYPAD_KEYS = [
  "1", "2", "3",
  "4", "5", "6",
  "7", "8", "9",
  "", "0", "del"
];

const LockSetupModal = () => {
  const { showSetupModal, setShowSetupModal, setPasscode } = useLock();
  const [step, setStep] = useState(1); // 1 = enter, 2 = confirm
  const [firstPin, setFirstPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const currentPin = step === 1 ? firstPin : confirmPin;

  // Reset state on open
  useEffect(() => {
    if (showSetupModal) {
      setStep(1);
      setFirstPin("");
      setConfirmPin("");
      setIsShaking(false);
      setErrorMessage("");
    }
  }, [showSetupModal]);

  const handleDigit = useCallback(
    async (digit) => {
      if (isShaking) return;

      if (step === 1) {
        if (firstPin.length >= 4) return;
        const next = firstPin + digit;
        setFirstPin(next);
        setErrorMessage("");

        if (next.length === 4) {
          setTimeout(() => {
            setStep(2);
          }, 250);
        }
      } else {
        if (confirmPin.length >= 4) return;
        const next = confirmPin + digit;
        setConfirmPin(next);
        setErrorMessage("");

        if (next.length === 4) {
          if (next === firstPin) {
            await setPasscode(next);
            setShowSetupModal(false);
          } else {
            setIsShaking(true);
            setErrorMessage("Passcodes did not match. Please try again.");
            setTimeout(() => {
              setConfirmPin("");
              setIsShaking(false);
            }, 600);
          }
        }
      }
    },
    [step, firstPin, confirmPin, isShaking, setPasscode, setShowSetupModal]
  );

  const handleDelete = useCallback(() => {
    if (isShaking) return;
    if (step === 1) {
      setFirstPin((prev) => prev.slice(0, -1));
    } else {
      setConfirmPin((prev) => prev.slice(0, -1));
    }
    setErrorMessage("");
  }, [step, isShaking]);

  // Keyboard support inside modal
  useEffect(() => {
    if (!showSetupModal) return;

    const handleKeyDown = (e) => {
      if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === "Backspace") {
        e.preventDefault();
        handleDelete();
      } else if (e.key === "Escape") {
        setShowSetupModal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showSetupModal, handleDigit, handleDelete, setShowSetupModal]);

  if (!showSetupModal) return null;

  return (
    <div
      className="applock-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Set up App Lock"
      onClick={() => setShowSetupModal(false)}
    >
      <div
        className="applock-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="applock-modal-close"
          onClick={() => setShowSetupModal(false)}
          aria-label="Close setup modal"
        >
          <X size={18} />
        </button>

        <div className="applock-modal-header">
          <div className="applock-modal-icon">
            <ShieldCheck size={26} />
          </div>
          <h2 className="applock-modal-title">
            {step === 1 ? "Set App Passcode" : "Confirm Passcode"}
          </h2>
          <p className="applock-modal-sub">
            {step === 1
              ? "Choose a 4-digit code to protect your journal & data"
              : "Re-enter your 4-digit passcode to confirm"}
          </p>
        </div>

        {/* Dots */}
        <div className={`applock-dots ${isShaking ? "shake" : ""}`}>
          {[0, 1, 2, 3].map((index) => (
            <span
              key={index}
              className={`applock-dot ${index < currentPin.length ? "filled" : ""}`}
            />
          ))}
        </div>

        {errorMessage && (
          <div className="applock-modal-err">{errorMessage}</div>
        )}

        {/* Keypad */}
        <div className="applock-keypad applock-keypad--compact">
          {KEYPAD_KEYS.map((k, idx) => {
            if (k === "") {
              return (
                <button
                  key={idx}
                  type="button"
                  className="applock-key-forgot"
                  onClick={() => {
                    if (step === 2) {
                      setStep(1);
                      setFirstPin("");
                      setConfirmPin("");
                    } else {
                      setShowSetupModal(false);
                    }
                  }}
                >
                  {step === 2 ? "Back" : "Cancel"}
                </button>
              );
            }

            if (k === "del") {
              return (
                <button
                  key={idx}
                  type="button"
                  className="applock-key applock-key--action"
                  onClick={handleDelete}
                  disabled={currentPin.length === 0}
                  aria-label="Delete"
                >
                  <Delete size={20} />
                </button>
              );
            }

            return (
              <button
                key={idx}
                type="button"
                className="applock-key"
                onClick={() => handleDigit(k)}
              >
                <span className="applock-key__num">{k}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LockSetupModal;
