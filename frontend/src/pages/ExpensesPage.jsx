import { useState, useEffect, useMemo, useCallback } from "react";
import expenseApi from "../api/expense.api";
import ExpenseHeader from "../components/expenses/ExpenseHeader";
import ExpenseMetrics from "../components/expenses/ExpenseMetrics";
import CategoryBreakdown from "../components/expenses/CategoryBreakdown";
import ExpenseFilterBar from "../components/expenses/ExpenseFilterBar";
import ExpenseList from "../components/expenses/ExpenseList";
import ExpenseModal from "../components/expenses/ExpenseModal";
import { Check, AlertCircle } from "lucide-react";

const CATEGORIES = [
  { id: "food", label: "Food & Dining", emoji: "🍔", color: "#f59e0b" },
  { id: "transportation", label: "Transport & Travel", emoji: "🚗", color: "#3b82f6" },
  { id: "housing", label: "Rent & Housing", emoji: "🏠", color: "#8b5cf6" },
  { id: "utilities", label: "Bills & Utilities", emoji: "💡", color: "#10b981" },
  { id: "entertainment", label: "Entertainment & Leisure", emoji: "🎬", color: "#ec4899" },
  { id: "technology and gadgets", label: "Tech & Gadgets", emoji: "💻", color: "#06b6d4" },
  { id: "subscriptions and memberships", label: "Subscriptions", emoji: "📱", color: "#6366f1" },
  { id: "healthcare", label: "Health & Fitness", emoji: "💊", color: "#ef4444" },
  { id: "education", label: "Education & Courses", emoji: "📚", color: "#14b8a6" },
  { id: "salary", label: "Salary & Wages", emoji: "💼", color: "#10b981" },
  { id: "freelance", label: "Freelance & Projects", emoji: "⚡", color: "#8b5cf6" },
  { id: "investment", label: "Savings & Investments", emoji: "📈", color: "#f97316" },
  { id: "others", label: "Other / Misc", emoji: "📦", color: "#6b7280" },
];

const INITIAL_EXPENSES = [
  {
    _id: "local-1",
    title: "Monthly High-Speed Fiber Internet",
    type: "expense",
    category: "utilities",
    amount: 1199,
    date: new Date().toISOString(),
    note: "Work from home setup",
  },
  {
    _id: "local-2",
    title: "Client Project Milestone 1",
    type: "income",
    category: "freelance",
    amount: 28500,
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    note: "Frontend architecture contract",
  },
  {
    _id: "local-3",
    title: "Whole Foods & Weekly Organic Groceries",
    type: "expense",
    category: "food",
    amount: 2450,
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    note: "Meal prep week",
  },
  {
    _id: "local-4",
    title: "Cloud Server Hosting & Domain Renewal",
    type: "expense",
    category: "technology and gadgets",
    amount: 1499,
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    note: "Production infrastructure",
  },
];

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem("lifesync_expenses_cache");
      return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    } catch {
      return INITIAL_EXPENSES;
    }
  });

  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [modalForm, setModalForm] = useState({
    title: "",
    type: "expense",
    category: "food",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // Fetch from backend
  const loadData = useCallback(async () => {
    try {
      const res = await expenseApi.getExpenses();
      if (res?.expenses && res.expenses.length > 0) {
        setExpenses(res.expenses);
        localStorage.setItem("lifesync_expenses_cache", JSON.stringify(res.expenses));
      }
    } catch (err) {
      console.warn("Using offline expenses cache:", err?.message);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Financial statistics
  const metrics = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    const catTotals = {};

    expenses.forEach((item) => {
      const amt = Number(item.amount) || 0;
      if (item.type === "income") {
        totalIncome += amt;
      } else {
        totalExpense += amt;
        const cat = item.category || "others";
        catTotals[cat] = (catTotals[cat] || 0) + amt;
      }
    });

    const netSavings = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? Math.round((Math.max(0, netSavings) / totalIncome) * 100) : 0;

    const topCategories = Object.entries(catTotals)
      .map(([catId, amount]) => {
        const catObj = CATEGORIES.find((c) => c.id === catId) || {
          label: catId,
          emoji: "📦",
          color: "#8b5cf6",
        };
        return {
          ...catObj,
          amount,
          percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0,
        };
      })
      .sort((a, b) => b.amount - a.amount);

    return { totalIncome, totalExpense, netSavings, savingsRate, topCategories };
  }, [expenses]);

  // Filtered transactions
  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      if (typeFilter !== "all" && item.type !== typeFilter) return false;
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(query);
        const matchesNote = item.note?.toLowerCase().includes(query);
        const matchesCat = item.category?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesNote && !matchesCat) return false;
      }
      return true;
    });
  }, [expenses, typeFilter, categoryFilter, search]);

  const openAddModal = () => {
    setEditingItem(null);
    setModalForm({
      title: "",
      type: "expense",
      category: "food",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      note: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setModalForm({
      title: item.title || "",
      type: item.type || "expense",
      category: item.category || "food",
      amount: item.amount || "",
      date: item.date ? new Date(item.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      note: item.note || "",
    });
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!modalForm.amount || isNaN(modalForm.amount) || Number(modalForm.amount) <= 0) {
      showToast("Please enter a valid amount greater than 0", "error");
      return;
    }

    setSubmitting(true);
    const payload = {
      title: modalForm.title.trim() || (modalForm.type === "income" ? "Income Deposit" : "Expense"),
      type: modalForm.type,
      category: modalForm.category,
      amount: Number(modalForm.amount),
      date: new Date(modalForm.date).toISOString(),
      note: modalForm.note.trim(),
    };

    try {
      if (editingItem) {
        const targetId = editingItem._id || editingItem.id;
        const res = await expenseApi.updateExpense(targetId, payload);
        const updated = res?.expense || { ...editingItem, ...payload };
        setExpenses((prev) =>
          prev.map((i) => (i._id === targetId || i.id === targetId ? updated : i))
        );
        showToast("Transaction updated ✨");
      } else {
        const res = await expenseApi.addExpense(payload);
        const created = res?.expense || { ...payload, _id: `local-${Date.now()}` };
        setExpenses((prev) => [created, ...prev]);
        showToast("Transaction added 💸");
      }
      setIsModalOpen(false);
    } catch {
      if (editingItem) {
        const targetId = editingItem._id || editingItem.id;
        setExpenses((prev) =>
          prev.map((i) => (i._id === targetId || i.id === targetId ? { ...i, ...payload } : i))
        );
        showToast("Updated locally ✨");
      } else {
        const created = { ...payload, _id: `local-${Date.now()}` };
        setExpenses((prev) => [created, ...prev]);
        showToast("Saved locally 💸");
      }
      setIsModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction entry?")) return;
    setExpenses((prev) => prev.filter((i) => i._id !== id && i.id !== id));
    try {
      await expenseApi.deleteExpense(id);
      showToast("Transaction removed 🗑️");
    } catch {
      showToast("Removed from view 🗑️");
    }
  };

  return (
    <div className="flex flex-col gap-6" aria-label="LifeSync Expenses">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-24 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-medium text-sm shadow-xl animate-in slide-in-from-right-4 duration-200 ${
            toast.type === "success" ? "bg-emerald-600 shadow-emerald-600/30" : "bg-rose-600 shadow-rose-600/30"
          }`}
        >
          {toast.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <ExpenseHeader onAddClick={openAddModal} />

      {/* Metrics */}
      <ExpenseMetrics
        metrics={metrics}
        totalExpenseCount={expenses.filter((e) => e.type !== "income").length}
      />

      {/* Split Grid: Category Breakdown on Left, Feed on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4">
          <CategoryBreakdown categories={metrics.topCategories} />
        </div>

        <main className="lg:col-span-8 p-6 sm:p-7 rounded-3xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/80 dark:border-zinc-800 shadow-xl shadow-purple-950/5 dark:shadow-black/30">
          <ExpenseFilterBar
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            totalAll={expenses.length}
            totalExpense={expenses.filter((e) => e.type === "expense").length}
            totalIncome={expenses.filter((e) => e.type === "income").length}
            search={search}
            setSearch={setSearch}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            categories={CATEGORIES}
          />

          <ExpenseList
            items={filteredExpenses}
            categories={CATEGORIES}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </main>
      </div>

      {/* Modal */}
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingItem={editingItem}
        modalForm={modalForm}
        setModalForm={setModalForm}
        onSubmit={handleModalSubmit}
        submitting={submitting}
        categories={CATEGORIES}
      />
    </div>
  );
};

export default ExpensesPage;
