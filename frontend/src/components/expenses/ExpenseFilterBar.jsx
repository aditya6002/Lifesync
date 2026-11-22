import { Search } from "lucide-react";

const ExpenseFilterBar = ({
  typeFilter,
  setTypeFilter,
  totalAll,
  totalExpense,
  totalIncome,
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  categories,
}) => {
  return (
    <div className="flex flex-col gap-4 pb-5 mb-5 border-b border-zinc-200/60 dark:border-zinc-800">
      {/* Type Filter Pills */}
      <div className="flex items-center gap-2 flex-wrap" role="tablist">
        <button
          type="button"
          onClick={() => setTypeFilter("all")}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            typeFilter === "all"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/25 scale-[1.02]"
              : "bg-white/80 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/60 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          All ({totalAll})
        </button>
        <button
          type="button"
          onClick={() => setTypeFilter("expense")}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            typeFilter === "expense"
              ? "bg-rose-600 text-white shadow-md shadow-rose-600/25 scale-[1.02]"
              : "bg-white/80 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/60 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          Expenses ({totalExpense})
        </button>
        <button
          type="button"
          onClick={() => setTypeFilter("income")}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            typeFilter === "income"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-[1.02]"
              : "bg-white/80 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/60 hover:text-zinc-900 dark:hover:text-white"
          }`}
        >
          Income ({totalIncome})
        </button>
      </div>

      {/* Search Input & Category Dropdown */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            placeholder="Search merchant, notes, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/80 dark:bg-zinc-800/70 border border-zinc-200/80 dark:border-zinc-700/60 text-xs sm:text-sm text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/15 transition-all"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="Filter by category"
          className="h-10 px-3.5 rounded-xl bg-white/80 dark:bg-zinc-800/70 border border-zinc-200/80 dark:border-zinc-700/60 text-xs sm:text-sm text-zinc-800 dark:text-zinc-100 outline-none focus:border-purple-500 transition-all cursor-pointer"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.emoji} {c.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ExpenseFilterBar;
