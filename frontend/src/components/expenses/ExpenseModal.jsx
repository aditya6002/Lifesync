import { X, ArrowUpRight, ArrowDownLeft, Loader2 } from "lucide-react";

const PRESET_AMOUNTS = [100, 500, 1000, 2500, 5000];

const ExpenseModal = ({
  isOpen,
  onClose,
  editingItem,
  modalForm,
  setModalForm,
  onSubmit,
  submitting,
  categories,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xl relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-purple-600 dark:text-purple-400 block mb-1">
              {editingItem ? "EDIT ENTRY" : "NEW TRANSACTION"}
            </span>
            <h2 className="font-serif text-2xl font-bold text-zinc-900 dark:text-white">
              {editingItem ? "Edit Transaction" : "Log New Financial Flow"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {/* Type Switcher */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80">
            <button
              type="button"
              onClick={() => setModalForm((prev) => ({ ...prev, type: "expense" }))}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                modalForm.type === "expense"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <ArrowUpRight size={16} /> Expense (Outflow)
            </button>
            <button
              type="button"
              onClick={() =>
                setModalForm((prev) => ({ ...prev, type: "income", category: "salary" }))
              }
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                modalForm.type === "income"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <ArrowDownLeft size={16} /> Income (Inflow)
            </button>
          </div>

          {/* Amount Input */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="exp-amount" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Amount (₹)
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 font-serif text-2xl font-bold text-zinc-400">₹</span>
              <input
                id="exp-amount"
                type="number"
                step="any"
                min="0"
                placeholder="0.00"
                value={modalForm.amount}
                onChange={(e) => setModalForm((prev) => ({ ...prev, amount: e.target.value }))}
                required
                autoFocus
                className="w-full h-14 pl-10 pr-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 font-serif text-2xl font-bold text-zinc-900 dark:text-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/15"
              />
            </div>
            {/* Presets */}
            <div className="flex gap-1.5 flex-wrap mt-1">
              {PRESET_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() =>
                    setModalForm((prev) => ({
                      ...prev,
                      amount: (Number(prev.amount || 0) + amt).toString(),
                    }))
                  }
                  className="px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-purple-100 dark:hover:bg-purple-950/40 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  +₹{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="exp-title" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Description / Merchant
            </label>
            <input
              id="exp-title"
              type="text"
              placeholder="e.g. Starbucks, Client Invoice, Gym Pass"
              value={modalForm.title}
              onChange={(e) => setModalForm((prev) => ({ ...prev, title: e.target.value }))}
              required
              className="w-full h-11 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 text-sm text-zinc-900 dark:text-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/15"
            />
          </div>

          {/* Category & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="exp-category" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Category
              </label>
              <select
                id="exp-category"
                value={modalForm.category}
                onChange={(e) => setModalForm((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full h-11 px-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 text-sm text-zinc-900 dark:text-white outline-none focus:border-purple-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="exp-date" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Date
              </label>
              <input
                id="exp-date"
                type="date"
                value={modalForm.date}
                onChange={(e) => setModalForm((prev) => ({ ...prev, date: e.target.value }))}
                required
                className="w-full h-11 px-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 text-sm text-zinc-900 dark:text-white outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="exp-note" className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Notes (Optional)
            </label>
            <textarea
              id="exp-note"
              rows={2}
              placeholder="Additional context, receipt info, or tags..."
              value={modalForm.note}
              onChange={(e) => setModalForm((prev) => ({ ...prev, note: e.target.value }))}
              className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 text-sm text-zinc-900 dark:text-white outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 mt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-purple-600 to-amber-500 shadow-md shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              <span>{editingItem ? "Update Flow" : "Save Transaction"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
