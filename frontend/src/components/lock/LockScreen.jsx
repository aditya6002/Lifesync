import { useState, useEffect, useCallback } from "react";
import { Lock, Unlock, Delete } from "lucide-react";
import { useLock } from "../../context/LockContext";

const KEYPAD_KEYS = [
  { num: "1", sub: "" },
  { num: "2", sub: "A B C" },
  { num: "3", sub: "D E F" },
  { num: "4", sub: "G H I" },
  { num: "5", sub: "J K L" },
  { num: "6", sub: "M N O" },
  { num: "7", sub: "P Q R S" },
  { num: "8", sub: "T U V" },
  { num: "9", sub: "W X Y Z" },
  { num: "empty", sub: "" },
  { num: "0", sub: "+" },
  { num: "del", sub: "" },
];

const LockScreen = () => {
  const { isLocked, unlockApp, setShowForgotModal } = useLock();
  const [pin, setPin] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  // Clear state when locked status changes
  useEffect(() => {
    if (isLocked) {
      setPin("");
      setIsShaking(false);
      setIsSuccess(false);
      setErrorMessage("");
      setShowForgotNotice(false);
    }
  }, [isLocked]);

  const handleDigit = useCallback(
    async (digit) => {
      if (isSuccess || isShaking || pin.length >= 4) return;

      const nextPin = pin + digit;
      setPin(nextPin);
      setErrorMessage("");

      if (nextPin.length === 4) {
        // Verify PIN
        const success = await unlockApp(nextPin);
        if (success) {
          setIsSuccess(true);
          if (navigator.vibrate) navigator.vibrate([40]);
        } else {
          setIsShaking(true);
          setErrorMessage("Incorrect passcode. Try again.");
          if (navigator.vibrate) navigator.vibrate([60, 50, 60]);
          setTimeout(() => {
            setPin("");
            setIsShaking(false);
          }, 650);
        }
      }
    },
    [pin, isSuccess, isShaking, unlockApp]
  );

  const handleDelete = useCallback(() => {
    if (isSuccess || isShaking) return;
    setPin((prev) => prev.slice(0, -1));
    setErrorMessage("");
  }, [isSuccess, isShaking]);

  // Physical keyboard support
  useEffect(() => {
    if (!isLocked) return;

    const handleKeyDown = (e) => {
      if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === "Backspace") {
        e.preventDefault();
        handleDelete();
      } else if (e.key === "Escape") {
        setPin("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLocked, handleDigit, handleDelete]);

  if (!isLocked) return null;

  return (
    <div
      className={`applock-screen ${isSuccess ? "applock-screen--unlocked" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Application Lock Screen"
    >
      <div className="applock-screen__backdrop" />

      <div className="applock-container">
        {/* Header with Lock Icon */}
        <div className="applock-header">
          <div className={`applock-icon-wrap ${isSuccess ? "unlocked" : ""}`}>
            {isSuccess ? (
              <Unlock size={28} className="applock-icon applock-icon--success" />
            ) : (
              <Lock size={28} className="applock-icon" />
            )}
          </div>
          <h1 className="applock-title">LifeSync</h1>
          <p className="applock-subtitle">
            {isSuccess ? "Unlocked" : "Enter Passcode"}
          </p>
        </div>

        {/* 4 Dot Indicators */}
        <div
          className={`applock-dots ${isShaking ? "shake" : ""} ${
            isSuccess ? "success" : ""
          }`}
          aria-label={`${pin.length} of 4 digits entered`}
        >
          {[0, 1, 2, 3].map((index) => {
            const isFilled = index < pin.length;
            return (
              <span
                key={index}
                className={`applock-dot ${isFilled ? "filled" : ""}`}
              />
            );
          })}
        </div>

        {/* Error message */}
        <div className="applock-status-msg">
          {errorMessage && <span className="applock-err">{errorMessage}</span>}
          {showForgotNotice && (
            <span className="applock-hint">
              Passcode is stored locally. You can reset it from Lock Settings or clear site data if lost.
            </span>
          )}
        </div>

        {/* iOS-Style Dial Keypad */}
        <div className="applock-keypad" role="group" aria-label="Passcode keypad">
          {KEYPAD_KEYS.map((k, idx) => {
            if (k.num === "empty") {
              return (
                <button
                  key={idx}
                  type="button"
                  className="applock-key-forgot"
                  onClick={() => setShowForgotModal(true)}
                  aria-label="Forgot passcode recovery"
                >
                  Forgot?
                </button>
              );
            }

            if (k.num === "del") {
              return (
                <button
                  key={idx}
                  type="button"
                  className="applock-key applock-key--action"
                  onClick={handleDelete}
                  disabled={pin.length === 0}
                  aria-label="Delete last digit"
                >
                  <Delete size={22} strokeWidth={1.8} />
                </button>
              );
            }

            return (
              <button
                key={idx}
                type="button"
                className="applock-key"
                onClick={() => handleDigit(k.num)}
                aria-label={`Digit ${k.num}`}
              >
                <span className="applock-key__num">{k.num}</span>
                {k.sub && <span className="applock-key__sub">{k.sub}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LockScreen;
