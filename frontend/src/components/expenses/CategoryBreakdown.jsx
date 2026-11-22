import { PieChart } from "lucide-react";

const CategoryBreakdown = ({ categories }) => {
  return (
    <aside className="p-6 sm:p-7 rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/80 dark:border-zinc-800 shadow-xl shadow-purple-950/5 dark:shadow-black/30">
      <div className="flex items-center gap-3.5 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
          <PieChart size={20} />
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-zinc-900 dark:text-white leading-tight">
            Category Breakdown
          </h2>
          <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500">
            TOP EXPENDITURE STREAMS
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {categories.length === 0 ? (
          <p className="text-sm text-zinc-400 dark:text-zinc-500 py-6 text-center">
            No category spend logged yet.
          </p>
        ) : (
          categories.slice(0, 7).map((cat) => (
            <div key={cat.id} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="flex items-center gap-2 font-medium text-zinc-800 dark:text-zinc-200">
                  <span className="text-base">{cat.emoji}</span>
                  <span>{cat.label}</span>
                </span>
                <strong className="font-bold text-zinc-900 dark:text-white">
                  ₹{cat.amount.toLocaleString("en-IN")}
                </strong>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800/80 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${cat.percentage}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500 text-right">
                {cat.percentage}% of overall spend
              </span>
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

export default CategoryBreakdown;
