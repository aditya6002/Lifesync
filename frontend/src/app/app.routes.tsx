// src/app/app.routes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/auth.context";

// ── Layouts ───────────────────────────────────────────────
import AppLayout from "../shared/components/layout/AppLayout";

// ── Public pages ──────────────────────────────────────────
import LandingPage from "../features/auth/pages/LandingPage";
import LoginPage from "../features/auth/pages/LandingPage";
import SignupPage from "../features/auth/pages/Signup";

// ── App pages ─────────────────────────────────────────────
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import ExpensesPage from "../features/expenses/pages/ExpensesPage";
import JournalPage from "../features/journal/pages/JournalPage";
import NotesPage from "../features/notes/pages/NotesPage";
import TasksPage from "../features/tasks/pages/TasksPage";
import AIAssistantPage from "../features/ai/pages/AIAssistantPage";
import ProfilePage from "../features/profile/pages/ProfilePage";

// ── Guards ────────────────────────────────────────────────
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading)
    return <div style={{ color: "#f1f5f9", padding: 40 }}>Loading...</div>;
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

// ── Route definitions ─────────────────────────────────────
export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public routes ── */}
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

      {/* ── Protected routes — wrapped in AppLayout ── */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        {/*<Route path="expenses" element={<ExpensesPage />} />
        <Route path="journal" element={<JournalPage />} />
        <Route path="notes" element={<NotesPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="ai" element={<AIAssistantPage />} />
        <Route path="profile" element={<ProfilePage />} /> */}
      </Route>

      {/* ── Fallback ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
