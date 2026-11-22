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
        const success = await unlockApp(nextPin);
        if (success) {
          setIsSuccess(true);
        } else {
          setIsShaking(true);
          setErrorMessage("Incorrect passcode. Try again.");
          setTimeout(() => {
            setPin("");
            setIsShaking(false);
          }, 600);
        }
      }
    },
    [isSuccess, isShaking, pin, unlockApp]
  );

  const handleDelete = useCallback(() => {
    if (pin.length > 0) {
      setPin((prev) => prev.slice(0, -1));
      setErrorMessage("");
    }
  }, [pin]);

  // Physical keyboard support
  useEffect(() => {
    if (!isLocked) return;

    const handleKeyDown = (e) => {
      if (e.key >= "0" && e.key <= "9") {
        handleDigit(e.key);
      } else if (e.key === "Backspace") {
        handleDelete();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLocked, handleDigit, handleDelete]);

  if (!isLocked) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/95 backdrop-blur-3xl animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="Enter Passcode"
    >
      <div className="w-full max-w-sm flex flex-col items-center text-center">
        {/* Animated Lock Icon */}
        <div
          className={`w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-xl transition-all duration-300 mb-6 ${
            isSuccess
              ? "bg-emerald-500 shadow-emerald-500/40 scale-110"
              : "bg-gradient-to-tr from-purple-600 to-amber-500 shadow-purple-600/30"
          }`}
        >
          {isSuccess ? <Unlock size={28} /> : <Lock size={28} />}
        </div>

        {/* Title */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-1.5">
          {isSuccess ? "Vault Unlocked" : "Enter Passcode"}
        </h2>
        <p className="text-xs text-zinc-400 mb-6">
          {isSuccess ? "Welcome back to LifeSync" : "Your private space is secured"}
        </p>

        {/* 4 Pin Indicator Dots */}
        <div
          className={`flex items-center gap-4 mb-4 ${
            isShaking ? "animate-bounce" : ""
          }`}
        >
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <span
                key={index}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                  isFilled
                    ? "bg-purple-500 shadow-md shadow-purple-500 scale-110"
                    : "border-2 border-zinc-600 bg-transparent"
                }`}
              />
            );
          })}
        </div>

        {/* Error Message */}
        <div className="h-6 mb-4">
          {errorMessage && (
            <span className="text-xs font-semibold text-rose-400 animate-in fade-in">
              {errorMessage}
            </span>
          )}
        </div>

        {/* Keypad Grid */}
        <div className="grid grid-cols-3 gap-3.5 sm:gap-4 w-full max-w-[260px]">
          {KEYPAD_KEYS.map((k, idx) => {
            if (k.num === "empty") {
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
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
                  onClick={handleDelete}
                  disabled={pin.length === 0}
                  className="w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center text-zinc-400 hover:text-white disabled:opacity-20 transition-all"
                  aria-label="Delete"
                >
                  <Delete size={22} strokeWidth={1.8} />
                </button>
              );
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleDigit(k.num)}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 border border-white/10 text-white flex flex-col items-center justify-center transition-all duration-150"
              >
                <span className="text-2xl font-light leading-none">{k.num}</span>
                {k.sub && (
                  <span className="text-[8.5px] font-bold tracking-widest text-zinc-400 mt-0.5">
                    {k.sub}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LockScreen;
