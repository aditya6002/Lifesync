import { Wallet, ArrowDownLeft, ArrowUpRight, TrendingUp } from "lucide-react";

const ExpenseMetrics = ({ metrics, totalExpenseCount }) => {
  const { totalIncome, totalExpense, netSavings, savingsRate } = metrics;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Financial statistics">
      {/* Net Balance */}
      <article className="p-6 rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/80 dark:border-zinc-800 shadow-xl shadow-purple-950/5 dark:shadow-black/30 flex flex-col justify-between gap-3 hover:-translate-y-1 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="w-11 h-11 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Wallet size={22} strokeWidth={2.2} />
          </div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500">
            NET BALANCE
          </span>
        </div>
        <div>
          <strong
            className={`font-serif text-3xl font-bold tracking-tight block ${
              netSavings >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            }`}
          >
            ₹{netSavings.toLocaleString("en-IN")}
          </strong>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 block">
            {netSavings >= 0 ? "Positive cash reserve surplus" : "Deficit this cycle — adjust spend"}
          </span>
        </div>
      </article>

      {/* Total Inflow */}
      <article className="p-6 rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/80 dark:border-zinc-800 shadow-xl shadow-purple-950/5 dark:shadow-black/30 flex flex-col justify-between gap-3 hover:-translate-y-1 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ArrowDownLeft size={22} strokeWidth={2.2} />
          </div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500">
            TOTAL INFLOW
          </span>
        </div>
        <div>
          <strong className="font-serif text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 block">
            ₹{totalIncome.toLocaleString("en-IN")}
          </strong>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 block">
            Salary, returns & incoming funds
          </span>
        </div>
      </article>

      {/* Total Outflow */}
      <article className="p-6 rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/80 dark:border-zinc-800 shadow-xl shadow-purple-950/5 dark:shadow-black/30 flex flex-col justify-between gap-3 hover:-translate-y-1 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="w-11 h-11 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <ArrowUpRight size={22} strokeWidth={2.2} />
          </div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500">
            TOTAL OUTFLOW
          </span>
        </div>
        <div>
          <strong className="font-serif text-3xl font-bold tracking-tight text-rose-600 dark:text-rose-400 block">
            ₹{totalExpense.toLocaleString("en-IN")}
          </strong>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 block">
            Across {totalExpenseCount} total expenses
          </span>
        </div>
      </article>

      {/* Savings Ratio */}
      <article className="p-6 rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/80 dark:border-zinc-800 shadow-xl shadow-purple-950/5 dark:shadow-black/30 flex flex-col justify-between gap-3 hover:-translate-y-1 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="w-11 h-11 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <TrendingUp size={22} strokeWidth={2.2} />
          </div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500">
            SAVINGS RATIO
          </span>
        </div>
        <div>
          <strong className="font-serif text-3xl font-bold tracking-tight text-blue-600 dark:text-blue-400 block">
            {savingsRate}%
          </strong>
          <div className="w-full h-1.5 rounded-full bg-blue-100 dark:bg-blue-950/40 overflow-hidden mt-2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, savingsRate))}%` }}
            />
          </div>
        </div>
      </article>
    </section>
  );
};

export default ExpenseMetrics;
