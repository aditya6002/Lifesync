// src/features/expenses/hooks/useExpenseForm.ts
import { useState } from "react";
import type { Expense, ExpenseFormData, ExpenseCategory } from "../../../shared/types";
import { today } from "../../../shared/utils/helpers";

type ModalType = "add" | "edit" | "view" | null;

interface ModalState {
  type: ModalType;
  data?: Expense;
}

const EMPTY_FORM: ExpenseFormData & { type: "expense" | "income" } = {
  name:   "",
  cat:    "Food",
  amount: 0,
  date:   today(),
  note:   "",
  type:   "expense",
};

export function useExpenseForm() {
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [form,  setForm]  = useState({ ...EMPTY_FORM });

  const openAdd = () => {
    setForm({ ...EMPTY_FORM, date: today() });
    setModal({ type: "add" });
  };

  const openEdit = (expense: Expense) => {
    setForm({
      name:   expense.name,
      cat:    expense.cat as ExpenseCategory,
      amount: Math.abs(expense.amount),
      date:   expense.date,
      note:   expense.note ?? "",
      type:   expense.amount > 0 ? "income" : "expense",
    });
    setModal({ type: "edit", data: expense });
  };

  const openView  = (expense: Expense) => setModal({ type: "view", data: expense });
  const closeModal = () => setModal({ type: null });

  const setField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  // Build final amount (positive = income, negative = expense)
  const buildAmount = (): number =>
    form.type === "income"
      ? Math.abs(form.amount)
      : -Math.abs(form.amount);

  const isValid = Boolean(form.name && form.amount);

  return {
    modal, form, isValid,
    openAdd, openEdit, openView, closeModal,
    setField, buildAmount,
  };
}
