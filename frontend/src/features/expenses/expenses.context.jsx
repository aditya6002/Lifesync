// src/features/expenses/expenses.context.jsx
import { createContext, useContext, useState } from "react";
import { uid } from "../../shared/utils/helpers";

const DEMO = [
  {
    id: "e1",
    name: "Zomato Order",
    cat: "Food",
    amount: -340,
    date: "2026-03-11",
    note: "Late night dinner",
    icon: "🍜",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "e2",
    name: "Metro Card",
    cat: "Travel",
    amount: -200,
    date: "2026-03-10",
    note: "Monthly pass",
    icon: "🚇",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "e3",
    name: "Pocket Money",
    cat: "Income",
    amount: 3000,
    date: "2026-03-10",
    note: "From dad",
    icon: "💰",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "e4",
    name: "Notion Pro",
    cat: "Study",
    amount: -299,
    date: "2026-03-09",
    note: "Annual sub",
    icon: "📚",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "e5",
    name: "Gym Membership",
    cat: "Health",
    amount: -800,
    date: "2026-03-08",
    note: "Monthly fee",
    icon: "🏋️",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "e6",
    name: "Movie Ticket",
    cat: "Entertainment",
    amount: -280,
    date: "2026-03-07",
    note: "With friends",
    icon: "🎬",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "e7",
    name: "Swiggy Order",
    cat: "Food",
    amount: -420,
    date: "2026-02-28",
    note: "Weekend dinner",
    icon: "🍜",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "e8",
    name: "Part-time stipend",
    cat: "Income",
    amount: 5000,
    date: "2026-02-20",
    note: "Feb stipend",
    icon: "💰",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "e9",
    name: "New Year dinner",
    cat: "Food",
    amount: -650,
    date: "2026-01-01",
    note: "Restaurant",
    icon: "🍜",
    userId: "u1",
    createdAt: "",
  },
  {
    id: "e10",
    name: "Monthly allowance",
    cat: "Income",
    amount: 3000,
    date: "2026-01-05",
    note: "From parents",
    icon: "💰",
    userId: "u1",
    createdAt: "",
  },
];

const ExpensesContext = createContext(null);

export function ExpensesProvider({ children }) {
  const [expenses, setExpenses] = useState(DEMO);
  const create = async (data) => {
    const e = {
      ...data,
      id: uid(),
      userId: "u1",
      createdAt: new Date().toISOString(),
    };
    setExpenses((p) => [e, ...p]);
    return e;
  };
  const update = async (id, data) =>
    setExpenses((p) => p.map((e) => (e.id === id ? { ...e, ...data } : e)));
  const remove = async (id) => setExpenses((p) => p.filter((e) => e.id !== id));
  const total = expenses
    .filter((e) => e.amount < 0)
    .reduce((s, e) => s + Math.abs(e.amount), 0);
  const income = expenses
    .filter((e) => e.amount > 0)
    .reduce((s, e) => s + e.amount, 0);
  return (
    <ExpensesContext.Provider
      value={{
        expenses,
        loading: false,
        create,
        update,
        remove,
        total,
        income,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpenses() {
  const ctx = useContext(ExpensesContext);
  if (!ctx) throw new Error("useExpenses must be inside ExpensesProvider");
  return ctx;
}

