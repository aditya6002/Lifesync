// src/features/expenses/hooks/useExpenseForm.ts
import { useState } from "react";
import { today } from "../../../shared/utils/helpers";
import { expensesApi } from "../expenses.api";
import { useDispatch, useSelector } from "react-redux";
import { setExpenses } from "../../../store/features/expenses/expensesSlice";
import {
  setError,
  setLoading,
  setToast,
} from "../../../store/features/auth/authSlice";

const EMPTY_FORM = {
  name: "",
  cat: "Food",
  amount: 0,
  date: today(),
  note: "",
  type: "expense",
};

export function useExpenseForm() {
  const [modal, setModal] = useState({ type: "" });
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const dispatch = useDispatch();

  const openAdd = () => {
    setForm({ ...EMPTY_FORM, date: today() });
    setModal({ type: "add" });
  };

  const openEdit = (expense) => {
    setForm({
      name: expense.name,
      cat: expense.cat,
      amount: Math.abs(expense.amount),
      date: expense.date,
      note: expense.note ?? "",
      type: expense.amount > 0 ? "income" : "expense",
    });
    setModal({ type: "edit", data: expense });
  };

  const openView = (expense) => setModal({ type: "view", data: expense });
  const closeModal = () => setModal({ type: "" });

  const setField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Build final amount (positive = income, negative = expense)
  const buildAmount = () =>
    form.type === "income" ? Math.abs(form.amount) : -Math.abs(form.amount);

  const isValid = Boolean(form.name && form.amount);

  async function getAllExpenses(year, month) {
    try {
      dispatch(setLoading(true));
      const res = await expensesApi.getAll(year, month);
      dispatch(setExpenses(res.data.expenses));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  }

  return {
    modal,
    form,
    isValid,
    openAdd,
    openEdit,
    openView,
    closeModal,
    setField,
    buildAmount,
    getAllExpenses,
  };
}
