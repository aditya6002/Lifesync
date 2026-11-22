import { Sparkles, Plus } from "lucide-react";

const ExpenseHeader = ({ onAddClick }) => {
  return (
    <header className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/80 dark:border-zinc-800 shadow-xl shadow-purple-950/5 dark:shadow-black/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-all duration-300">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold tracking-wider uppercase mb-3">
          <Sparkles size={13} />
          <span>Financial Intelligence Vault</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
          Track Every Flow,{" "}
          <span className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-amber-500 bg-clip-text text-transparent">
            Master Your Wealth
          </span>
        </h1>
        <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Seamlessly monitor daily expenses, freelance returns, salary streams, and your net financial health in real time.
        </p>
      </div>

      <button
        type="button"
        onClick={onAddClick}
        className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-white font-semibold text-sm bg-gradient-to-r from-purple-600 via-purple-700 to-amber-500 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-purple-600/30"
      >
        <Plus size={18} strokeWidth={2.4} />
        <span>Add Transaction</span>
      </button>
    </header>
  );
};

export default ExpenseHeader;
