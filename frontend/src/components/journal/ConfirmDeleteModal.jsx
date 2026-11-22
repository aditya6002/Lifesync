import { AlertTriangle, Loader2 } from "lucide-react";

const ConfirmDeleteModal = ({ entry, onConfirm, onCancel, loading }) => {
  if (!entry) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md p-6 sm:p-7 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mb-4">
          <AlertTriangle size={24} />
        </div>

        <h3 className="font-serif text-xl font-bold text-zinc-900 dark:text-white mb-2">
          Delete Journal Reflection?
        </h3>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
          Are you sure you want to permanently delete{" "}
          <strong className="text-zinc-900 dark:text-white">"{entry.title || "this reflection"}"</strong>? This action cannot be undone.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-xs sm:text-sm text-white bg-rose-600 hover:bg-rose-700 active:scale-95 transition-all shadow-md shadow-rose-600/30 disabled:opacity-50"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            <span>Delete Permanently</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
