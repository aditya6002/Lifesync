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
  const [step, setStep] = useState(1);
  const [firstPin, setFirstPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const currentPin = step === 1 ? firstPin : confirmPin;

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
          setTimeout(() => setStep(2), 250);
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
    [isShaking, step, firstPin, confirmPin, setPasscode, setShowSetupModal]
  );

  const handleDelete = useCallback(() => {
    if (step === 1) {
      setFirstPin((prev) => prev.slice(0, -1));
    } else {
      setConfirmPin((prev) => prev.slice(0, -1));
    }
    setErrorMessage("");
  }, [step]);

  if (!showSetupModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={() => setShowSetupModal(false)}
    >
      <div
        className="w-full max-w-sm p-6 sm:p-7 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xl relative flex flex-col items-center text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setShowSetupModal(false)}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
          <ShieldCheck size={24} />
        </div>

        <h3 className="font-serif text-xl font-bold text-zinc-900 dark:text-white mb-1">
          {step === 1 ? "Set App Passcode" : "Confirm Passcode"}
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5">
          {step === 1 ? "Choose a 4-digit PIN for your vault" : "Re-enter the 4-digit PIN to confirm"}
        </p>

        {/* 4 Pin Indicator Dots */}
        <div className={`flex items-center gap-3.5 mb-3 ${isShaking ? "animate-bounce" : ""}`}>
          {[0, 1, 2, 3].map((index) => {
            const isFilled = currentPin.length > index;
            return (
              <span
                key={index}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                  isFilled
                    ? "bg-purple-600 scale-110 shadow-sm shadow-purple-600"
                    : "border-2 border-zinc-300 dark:border-zinc-600 bg-transparent"
                }`}
              />
            );
          })}
        </div>

        {/* Error message */}
        <div className="h-5 mb-3">
          {errorMessage && <span className="text-xs font-semibold text-rose-500">{errorMessage}</span>}
        </div>

        {/* Compact Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[220px]">
          {KEYPAD_KEYS.map((k, idx) => {
            if (k === "") {
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (step === 2) {
                      setStep(1);
                      setFirstPin("");
                      setConfirmPin("");
                    } else {
                      setShowSetupModal(false);
                    }
                  }}
                  className="w-14 h-14 rounded-full flex items-center justify-center text-xs font-semibold text-zinc-500 dark:text-zinc-400 hover:text-purple-600 transition-colors"
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
                  onClick={handleDelete}
                  disabled={currentPin.length === 0}
                  className="w-14 h-14 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-20 transition-all"
                  aria-label="Delete"
                >
                  <Delete size={20} strokeWidth={1.8} />
                </button>
              );
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleDigit(k)}
                className="w-14 h-14 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-95 text-zinc-800 dark:text-zinc-100 text-xl font-light flex items-center justify-center transition-all duration-150"
              >
                {k}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LockSetupModal;
