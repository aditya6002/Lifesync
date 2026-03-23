// // src/features/expenses/hooks/useExpenseForm.ts
// import { useState } from "react";
// import { today } from "../../../shared/utils/helpers";
// import { expensesApi } from "../expenses.api";
// import { useDispatch, useSelector } from "react-redux";
// import { setExpenses } from "../../../store/features/expenses/expensesSlice";
// import {
//   setError,
//   setLoading,
//   setToast,
// } from "../../../store/features/auth/authSlice";

// const EMPTY_FORM = {
//   name: "",
//   cat: "Food",
//   amount: 0,
//   date: today(),
//   note: "",
//   type: "expense",
// };

// export function useExpenseForm() {
//   const [modal, setModal] = useState({ type: "" });
//   const [form, setForm] = useState({ ...EMPTY_FORM });
//   const dispatch = useDispatch();

//   const openAdd = () => {
//     setForm({ ...EMPTY_FORM, date: today() });
//     setModal({ type: "add" });
//   };

//   const openEdit = (expense) => {
//     setForm({
//       name: expense.name,
//       cat: expense.cat,
//       amount: Math.abs(expense.amount),
//       date: expense.date,
//       note: expense.note ?? "",
//       type: expense.amount > 0 ? "income" : "expense",
//     });
//     setModal({ type: "edit", data: expense });
//   };

//   const openView = (expense) => setModal({ type: "view", data: expense });
//   const closeModal = () => setModal({ type: "" });

//   const setField = (key, value) =>
//     setForm((prev) => ({ ...prev, [key]: value }));

//   // Build final amount (positive = income, negative = expense)
//   const buildAmount = () =>
//     form.type === "income" ? Math.abs(form.amount) : -Math.abs(form.amount);

//   const isValid = Boolean(form.name && form.amount);

//   async function getAllExpenses(year, month) {
//     try {
//       dispatch(setLoading(true));
//       const res = await expensesApi.getAll(year, month);
//       dispatch(setExpenses(res.data.expenses));
//     } catch (error) {
//       console.log(error);
//     } finally {
//       dispatch(setLoading(false));
//     }
//   }

//   return {
//     modal,
//     form,
//     isValid,
//     openAdd,
//     openEdit,
//     openView,
//     closeModal,
//     setField,
//     buildAmount,
//     getAllExpenses,
//   };
// }

// src/features/expenses/hooks/useExpenseForm.ts
import { useState } from "react";
import { today } from "../../../shared/utils/helpers";
import { expensesApi } from "../expenses.api";
import { useDispatch } from "react-redux";
import {
  addExpenses,
  deleteExpense,
  setExpenses,
  updateExpense,
} from "../../../store/features/expenses/expensesSlice";
import {
  setError,
  setLoading,
  setToast,
} from "../../../store/features/auth/authSlice";

const CAT_ICONS = {
  Food: "🍜",
  Travel: "🚇",
  Study: "📚",
  Health: "🏋️",
  Entertainment: "🎬",
  Shopping: "🛍️",
  Income: "💰",
  Other: "📦",
};

const EMPTY_FORM = {
  name: "",
  cat: "Food",
  amount: 0,
  date: today(),
  note: "",
  type: "expense" | "income", // ✅ fixed — was JS syntax error
};

export function useExpenseForm() {
  const [modal, setModal] = useState({ type: "" });
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const dispatch = useDispatch();

  // ── Modal helpers ────────────────────────────────────────────
  const openAdd = (defaultDate) => {
    setForm({ ...EMPTY_FORM, date: defaultDate ?? today() });
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
  const openConfirm = (expense) => setModal({ type: "confirm", data: expense });
  const closeModal = () => setModal({ type: "" });

  const setField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const buildAmount = () =>
    form.type === "income" ? Math.abs(form.amount) : -Math.abs(form.amount);

  const isValid = Boolean(form.name && form.amount);

  // ── GET all expenses for a month ─────────────────────────────
  async function getAllExpenses(year, month) {
    try {
      dispatch(setLoading(true));
      const res = await expensesApi.getAll(year, month);
      dispatch(setExpenses(res.data.expenses));
    } catch (err) {
      dispatch(
        setError(err?.response?.data?.message ?? "Failed to load expenses"),
      );
    } finally {
      dispatch(setLoading(false));
    }
  }

  // ── CREATE expense ────────────────────────────────────────────
  async function saveExpense() {
    if (!isValid) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        cat: form.cat,
        amount: buildAmount(),
        date: form.date,
        note: form.note,
        icon: CAT_ICONS[form.cat] ?? "📦",
        userId: "u1",
        createdAt: new Date(),
      };

      if (modal.type === "add") {
        const res = await expensesApi.create(payload);
        dispatch(addExpenses(res.data.expense)); // ✅ server id use karo
        dispatch(setToast({ message: "Expense added!", type: "success" }));
      } else if (modal.type === "edit" && modal.data) {
        const res = await expensesApi.update(modal.data.id, payload);
        dispatch(
          updateExpense({ id: modal.data.id, updated: res.data.expense }),
        );
        dispatch(setToast({ message: "Changes saved!", type: "success" }));
      }

      closeModal();
    } catch (err) {
      dispatch(setError(err?.response?.data?.message ?? "Save failed"));
    } finally {
      setSaving(false);
    }
  }

  // ── DELETE expense ────────────────────────────────────────────
  async function removeExpense(id) {
    setSaving(true);
    try {
      await expensesApi.remove(id);
      dispatch(deleteExpense(id));
      dispatch(setToast({ message: "Expense deleted", type: "success" }));
      closeModal();
    } catch (err) {
      dispatch(setError(err?.response?.data?.message ?? "Delete failed"));
    } finally {
      setSaving(false);
    }
  }

  return {
    modal,
    form,
    isValid,
    saving,
    openAdd,
    openEdit,
    openView,
    openConfirm,
    closeModal,
    setField,
    buildAmount,
    getAllExpenses,
    saveExpense,
    removeExpense,
  };
}
