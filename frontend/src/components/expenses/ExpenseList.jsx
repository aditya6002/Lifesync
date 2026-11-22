import { Wallet } from "lucide-react";
import ExpenseItem from "./ExpenseItem";

const ExpenseList = ({ items, categories, onEdit, onDelete }) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-4 text-zinc-500 dark:text-zinc-400 gap-2">
        <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-2">
          <Wallet size={28} strokeWidth={1.5} />
        </div>
        <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-white">
          No transactions found
        </h3>
        <p className="text-xs sm:text-sm max-w-sm">
          Try clearing your filters or click "+ Add Transaction" to log a new entry.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5 max-h-[620px] overflow-y-auto pr-1">
      {items.map((item) => {
        const catObj = categories.find((c) => c.id === item.category) || {
          label: item.category || "Expense",
          emoji: "💳",
          color: "#ff9d32",
        };
        return (
          <ExpenseItem
            key={item._id || item.id}
            item={item}
            categoryObj={catObj}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
};

export default ExpenseList;
