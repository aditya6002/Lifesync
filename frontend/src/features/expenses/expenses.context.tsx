// src/features/expenses/expenses.context.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { Expense, ExpenseFormData } from "../../shared/types";
import { expensesApi } from "./expenses.api";
import { activityApi } from "../activity/activity.api";

interface ExpensesContextType {
  expenses: Expense[];
  loading: boolean;
  create: (data: ExpenseFormData) => Promise<Expense>;
  update: (id: string, data: Partial<ExpenseFormData>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  total: number;
  income: number;
}

const ExpensesContext = createContext<ExpensesContextType | null>(null);

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    expensesApi
      .getAll()
      .then((res) => setExpenses(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const create = async (data: ExpenseFormData): Promise<Expense> => {
    const res = await expensesApi.create(data);
    setExpenses((prev) => [res.data, ...prev]);

    // ✅ Log activity
    await activityApi.log({
      module: "expenses",
      action: "created",
      entityId: res.data.id,
      entityName: res.data.name,
      meta: { amount: res.data.amount, cat: res.data.cat },
    });

    return res.data;
  };

  const update = async (
    id: string,
    data: Partial<ExpenseFormData>,
  ): Promise<void> => {
    const res = await expensesApi.update(id, data);
    setExpenses((prev) => prev.map((e) => (e.id === id ? res.data : e)));

    await activityApi.log({
      module: "expenses",
      action: "updated",
      entityId: id,
      entityName: res.data.name,
      meta: { amount: res.data.amount },
    });
  };

  const remove = async (id: string): Promise<void> => {
    const expense = expenses.find((e) => e.id === id);
    await expensesApi.remove(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));

    await activityApi.log({
      module: "expenses",
      action: "deleted",
      entityId: id,
      entityName: expense?.name ?? "Expense",
    });
  };

  const total = expenses
    .filter((e) => e.amount < 0)
    .reduce((s, e) => s + Math.abs(e.amount), 0);
  const income = expenses
    .filter((e) => e.amount > 0)
    .reduce((s, e) => s + e.amount, 0);

  return (
    <ExpensesContext.Provider
      value={{ expenses, loading, create, update, remove, total, income }}
    >
      {children}
    </ExpensesContext.Provider>
  );
}


export function useExpenses(): ExpensesContextType {
  const ctx = useContext(ExpensesContext);
  if (!ctx) throw new Error("useExpenses must be inside ExpensesProvider");
  return ctx;
}
