const MOODS = [
  { id: "happy", emoji: "😊", label: "Happy", color: "#f59e0b" },
  { id: "calm", emoji: "🌿", label: "Calm", color: "#10b981" },
  { id: "sad", emoji: "😔", label: "Sad", color: "#3b82f6" },
  { id: "excited", emoji: "⚡", label: "Excited", color: "#f97316" },
  { id: "grateful", emoji: "🙏", label: "Grateful", color: "#8b5cf6" },
  { id: "reflective", emoji: "🤔", label: "Reflective", color: "#ec4899" },
  { id: "tired", emoji: "😴", label: "Tired", color: "#6b7280" },
  { id: "anxious", emoji: "😰", label: "Anxious", color: "#ef4444" },
];

const MoodSelector = ({ selectedMood, onSelectMood }) => {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {MOODS.map((m) => {
        const isSelected = selectedMood === m.id;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onSelectMood(isSelected ? null : m.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
              isSelected
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30 scale-105"
                : "bg-white/80 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-300 hover:scale-105"
            }`}
          >
            <span>{m.emoji}</span>
            <span>{m.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export { MOODS };
export default MoodSelector;
