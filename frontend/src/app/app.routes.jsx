// src/app/app.routes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/auth.context";
import AppLayout from "../shared/components/layout/AppLayout";
import LandingPage from "../features/auth/pages/LandingPage";
import LoginPage from "../features/auth/pages/LoginPage";
import SignupPage from "../features/auth/pages/SignupPages";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import ExpensesPage from "../features/expenses/pages/ExpensesPage";
import JournalPage from "../features/journal/pages/JournalPage";
import NotesPage from "../features/notes/pages/NotesPage";
import TasksPage from "../features/tasks/pages/TasksPage";
import AIAssistantPage from "../features/ai/pages/AIAssistantPage";
import ProfilePage from "../features/profile/pages/ProfilePage";
import SubscriptionPage from "../features/subscription/pages/SubscriptionPage";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading)
    return <div style={{ color: "#f1f5f9", padding: 40 }}>Loading...</div>;
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return "Loading";
  return !user ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <PublicRoute>
            <AppLayout />
          </PublicRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="expenses" element={<ExpensesPage />} />
        <Route path="journal" element={<JournalPage />} />
        <Route path="notes" element={<NotesPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="ai" element={<AIAssistantPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="subscription" element={<SubscriptionPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
