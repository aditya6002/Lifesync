import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  Search,
  Filter,
  Trash2,
  Edit3,
  Calendar,
  Sparkles,
  Tag,
  FileText,
  DollarSign,
  PieChart,
  X,
  Loader2,
  Check,
  AlertCircle,
  IndianRupee,
} from "lucide-react";
import expenseApi from "../api/expense.api";

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

const PRESET_AMOUNTS = [100, 500, 1000, 2500, 5000];

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

  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [typeFilter, setTypeFilter] = useState("all"); // "all" | "expense" | "income"
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");

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
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // Fetch from backend
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [expData, sumData] = await Promise.allSettled([
        expenseApi.getExpenses(),
        expenseApi.getSummary(),
      ]);

      if (expData.status === "fulfilled" && expData.value?.expenses) {
        setExpenses(expData.value.expenses);
        localStorage.setItem("lifesync_expenses_cache", JSON.stringify(expData.value.expenses));
      }
      if (sumData.status === "fulfilled" && sumData.value) {
        setSummary(sumData.value);
      }
    } catch (err) {
      console.warn("Could not load expenses from server, utilizing offline cache:", err?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Derived financial statistics
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

    return {
      totalIncome,
      totalExpense,
      netSavings,
      savingsRate,
      topCategories,
    };
  }, [expenses]);

  // Filtered transactions list
  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      if (typeFilter !== "all" && item.type !== typeFilter) return false;
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(query);
        const matchesNote = item.note?.toLowerCase().includes(query);
        const matchesCategory = item.category?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesNote && !matchesCategory) return false;
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
    } catch (err) {
      // Local fallback in case network blocked
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
    <div className="expenses-page-wrap" aria-label="LifeSync Expenses">
      {/* Toast Alert */}
      {toast && (
        <div className={`expenses-toast ${toast.type}`}>
          {toast.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header Banner */}
      <header className="expenses-header glass-card">
        <div className="expenses-header-left">
          <div className="hero-pill-badge bouncing" style={{ marginBottom: 10 }}>
            <Sparkles size={13} className="hero-pill-icon" />
            <span>FINANCIAL INTELLIGENCE VAULT</span>
            <span className="bright-moment-dot" />
          </div>
          <h1 className="expenses-title">
            Track Every Flow, <span className="hero-gradient-text">Master Your Wealth</span>
          </h1>
          <p className="expenses-subtitle">
            Seamlessly monitor daily expenses, salary streams, investments, and your net financial health in real time.
          </p>
        </div>
        <div className="expenses-header-right">
          <button type="button" onClick={openAddModal} className="hero-main-cta expenses-add-btn">
            <Plus size={18} strokeWidth={2.4} />
            <span>Add Transaction</span>
          </button>
        </div>
      </header>

      {/* Metrics Row */}
      <section className="expenses-metrics-grid" aria-label="Financial summary metrics">
        {/* Net Balance */}
        <article className="stat-card glass-card purple">
          <div className="stat-card-head">
            <div className="stat-icon-box" style={{ background: "rgba(136, 69, 232, 0.12)", color: "#8845e8" }}>
              <Wallet size={22} strokeWidth={2.2} />
            </div>
            <span className="section-label">NET BALANCE</span>
          </div>
          <strong className="stat-value" style={{ color: metrics.netSavings >= 0 ? "#10b981" : "#ef4444" }}>
            ₹{metrics.netSavings.toLocaleString("en-IN")}
          </strong>
          <span className="stat-desc">
            {metrics.netSavings >= 0 ? "Positive cash reserve accumulation" : "Deficit this cycle — adjust spend"}
          </span>
        </article>

        {/* Total Income */}
        <article className="stat-card glass-card green">
          <div className="stat-card-head">
            <div className="stat-icon-box" style={{ background: "rgba(16, 185, 129, 0.12)", color: "#10b981" }}>
              <ArrowDownLeft size={22} strokeWidth={2.2} />
            </div>
            <span className="section-label">TOTAL INFLOW</span>
          </div>
          <strong className="stat-value" style={{ color: "#10b981" }}>
            ₹{metrics.totalIncome.toLocaleString("en-IN")}
          </strong>
          <span className="stat-desc">Earnings, salary & freelance returns</span>
        </article>

        {/* Total Expenses */}
        <article className="stat-card glass-card orange">
          <div className="stat-card-head">
            <div className="stat-icon-box" style={{ background: "rgba(239, 68, 68, 0.12)", color: "#ef4444" }}>
              <ArrowUpRight size={22} strokeWidth={2.2} />
            </div>
            <span className="section-label">TOTAL OUTFLOW</span>
          </div>
          <strong className="stat-value" style={{ color: "#ef4444" }}>
            ₹{metrics.totalExpense.toLocaleString("en-IN")}
          </strong>
          <span className="stat-desc">Logged across {expenses.filter((e) => e.type !== "income").length} expenses</span>
        </article>

        {/* Savings Rate */}
        <article className="stat-card glass-card blue">
          <div className="stat-card-head">
            <div className="stat-icon-box" style={{ background: "rgba(59, 130, 246, 0.12)", color: "#3b82f6" }}>
              <TrendingUp size={22} strokeWidth={2.2} />
            </div>
            <span className="section-label">SAVINGS RATIO</span>
          </div>
          <strong className="stat-value" style={{ color: "#3b82f6" }}>
            {metrics.savingsRate}%
          </strong>
          <div className="expenses-savings-bar">
            <div className="expenses-savings-fill" style={{ width: `${Math.min(100, metrics.savingsRate)}%` }} />
          </div>
        </article>
      </section>

      {/* Main Content: Category Breakdown + Transactions Feed */}
      <div className="expenses-split-layout">
        {/* Left: Category Analytics */}
        <aside className="expenses-category-panel glass-card">
          <div className="panel-head-clean">
            <div className="icon-box icon-box-purple">
              <PieChart size={20} />
            </div>
            <div>
              <h2 className="panel-title-clean">Category Breakdown</h2>
              <span className="section-label">TOP EXPENDITURE STREAMS</span>
            </div>
          </div>

          <div className="expenses-cat-list">
            {metrics.topCategories.length === 0 ? (
              <p className="expenses-empty-hint">No expense categories to show yet.</p>
            ) : (
              metrics.topCategories.slice(0, 7).map((cat) => (
                <div key={cat.id} className="expenses-cat-row">
                  <div className="expenses-cat-row-top">
                    <span className="expenses-cat-name">
                      <span className="cat-emoji">{cat.emoji}</span>
                      <span>{cat.label}</span>
                    </span>
                    <strong className="expenses-cat-amt">₹{cat.amount.toLocaleString("en-IN")}</strong>
                  </div>
                  <div className="expenses-cat-bar-track">
                    <div
                      className="expenses-cat-bar-fill"
                      style={{
                        width: `${cat.percentage}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                  <span className="expenses-cat-pct">{cat.percentage}% of overall spend</span>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Right: Transactions Feed */}
        <main className="expenses-feed-panel glass-card">
          {/* Controls: Type tabs, Search, Category Dropdown */}
          <div className="expenses-feed-controls">
            <div className="expenses-type-tabs" role="tablist">
              <button
                type="button"
                className={`expenses-tab-btn ${typeFilter === "all" ? "active" : ""}`}
                onClick={() => setTypeFilter("all")}
              >
                All ({expenses.length})
              </button>
              <button
                type="button"
                className={`expenses-tab-btn ${typeFilter === "expense" ? "active" : ""}`}
                onClick={() => setTypeFilter("expense")}
              >
                Expenses ({expenses.filter((e) => e.type === "expense").length})
              </button>
              <button
                type="button"
                className={`expenses-tab-btn ${typeFilter === "income" ? "active" : ""}`}
                onClick={() => setTypeFilter("income")}
              >
                Income ({expenses.filter((e) => e.type === "income").length})
              </button>
            </div>

            <div className="expenses-search-row">
              <div className="expenses-search-wrap">
                <Search size={15} className="expenses-search-icon" />
                <input
                  type="search"
                  placeholder="Search merchant, notes, tags..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="expenses-search-input"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="expenses-select"
                aria-label="Filter by category"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Transactions List */}
          <div className="expenses-items-list">
            {filteredExpenses.length === 0 ? (
              <div className="expenses-empty-state">
                <Wallet size={40} className="empty-icon" />
                <h3>No transactions found</h3>
                <p>Try clearing your search or add a new transaction using the button above.</p>
              </div>
            ) : (
              filteredExpenses.map((item) => {
                const catObj = CATEGORIES.find((c) => c.id === item.category) || {
                  label: item.category || "Expense",
                  emoji: "💳",
                  color: "#ff9d32",
                };
                const isIncome = item.type === "income";
                const displayDate = new Date(item.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

                return (
                  <article key={item._id || item.id} className="expense-item-row">
                    <div className="expense-item-icon-box" style={{ background: `${catObj.color}18` }}>
                      <span className="expense-item-emoji">{catObj.emoji}</span>
                    </div>

                    <div className="expense-item-info">
                      <div className="expense-item-title-row">
                        <strong className="expense-item-title">{item.title}</strong>
                        <span className={`expense-item-badge ${item.type}`}>
                          {item.type === "income" ? "Income" : catObj.label}
                        </span>
                      </div>
                      <div className="expense-item-meta">
                        <span>{displayDate}</span>
                        {item.note && (
                          <>
                            <span className="dot-sep">•</span>
                            <span className="expense-item-note">{item.note}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="expense-item-actions">
                      <strong className={`expense-item-amount ${isIncome ? "income" : "expense"}`}>
                        {isIncome ? "+" : "-"}₹{Number(item.amount).toLocaleString("en-IN")}
                      </strong>
                      <div className="expense-btn-group">
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="expense-action-icon-btn"
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item._id || item.id)}
                          className="expense-action-icon-btn delete"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </main>
      </div>

      {/* Add / Edit Transaction Modal */}
      {isModalOpen && (
        <div className="expenses-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="expenses-modal-card glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="expenses-modal-header">
              <div className="expenses-modal-title-wrap">
                <span className="hero-pill-badge" style={{ marginBottom: 4 }}>
                  {editingItem ? "EDIT ENTRY" : "NEW TRANSACTION"}
                </span>
                <h2>{editingItem ? "Edit Transaction" : "Log New Financial Flow"}</h2>
              </div>
              <button
                type="button"
                className="round-icon-btn"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="expenses-modal-form">
              {/* Type Switcher */}
              <div className="expenses-type-toggle">
                <button
                  type="button"
                  className={`type-toggle-btn ${modalForm.type === "expense" ? "active-expense" : ""}`}
                  onClick={() => setModalForm((prev) => ({ ...prev, type: "expense" }))}
                >
                  <ArrowUpRight size={16} /> Expense (Outflow)
                </button>
                <button
                  type="button"
                  className={`type-toggle-btn ${modalForm.type === "income" ? "active-income" : ""}`}
                  onClick={() => setModalForm((prev) => ({ ...prev, type: "income", category: "salary" }))}
                >
                  <ArrowDownLeft size={16} /> Income (Inflow)
                </button>
              </div>

              {/* Amount Input */}
              <div className="expenses-form-field">
                <label htmlFor="exp-amount">Amount (₹)</label>
                <div className="expenses-amount-input-wrap">
                  <span className="expenses-curr-symbol">₹</span>
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
                  />
                </div>
                {/* Presets */}
                <div className="expenses-presets">
                  {PRESET_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      className="preset-chip"
                      onClick={() =>
                        setModalForm((prev) => ({
                          ...prev,
                          amount: (Number(prev.amount || 0) + amt).toString(),
                        }))
                      }
                    >
                      +₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Input */}
              <div className="expenses-form-field">
                <label htmlFor="exp-title">Description / Merchant</label>
                <input
                  id="exp-title"
                  type="text"
                  placeholder="e.g. Starbucks Coffee, Monthly Salary, Gym Pass"
                  value={modalForm.title}
                  onChange={(e) => setModalForm((prev) => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              {/* Category & Date Grid */}
              <div className="expenses-form-grid">
                <div className="expenses-form-field">
                  <label htmlFor="exp-category">Category</label>
                  <select
                    id="exp-category"
                    value={modalForm.category}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, category: e.target.value }))}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.emoji} {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="expenses-form-field">
                  <label htmlFor="exp-date">Date</label>
                  <input
                    id="exp-date"
                    type="date"
                    value={modalForm.date}
                    onChange={(e) => setModalForm((prev) => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Note / Details */}
              <div className="expenses-form-field">
                <label htmlFor="exp-note">Notes (Optional)</label>
                <textarea
                  id="exp-note"
                  rows={2}
                  placeholder="Additional context, receipt info, or tags..."
                  value={modalForm.note}
                  onChange={(e) => setModalForm((prev) => ({ ...prev, note: e.target.value }))}
                />
              </div>

              {/* Submit Buttons */}
              <div className="expenses-modal-actions">
                <button
                  type="button"
                  className="expenses-cancel-btn"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button type="submit" className="hero-main-cta expenses-save-btn" disabled={submitting}>
                  {submitting ? <Loader2 size={16} className="jnl-spin" /> : null}
                  <span>{editingItem ? "Update Flow" : "Save Transaction"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesPage;
