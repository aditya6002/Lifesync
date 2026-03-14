// src/pages/AppPage.jsx
import { useState } from "react";
import { C } from "../styles/tokens";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { Toast } from "../components/ui/Atoms";

import DashboardPage from "../modules/dashboard/DashboardPage";
import ExpensesPage from "../modules/expenses/ExpensesPage";
import JournalPage from "../modules/journal/JournalPage";
import NotesPage from "../modules/notes/NotesPage";
import TasksPage from "../modules/tasks/TasksPage";
import AIAssistantPage from "../modules/ai/AIAssistantPage";
import ProfilePage from "../modules/profile/ProfilePage";

export default function AppPage({ user, onLogout }) {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toast, setToast] = useState(null);

  const [user2, setUser2] = useState(user);

  const screens = {
    dashboard: <DashboardPage setActive={setActive} />,
    expenses: <ExpensesPage toast={setToast} />,
    journal: <JournalPage toast={setToast} />,
    notes: <NotesPage toast={setToast} />,
    tasks: <TasksPage toast={setToast} />,
    ai: <AIAssistantPage />,
    profile: (
      <ProfilePage
        user={user2}
        onUpdateUser={(u) => setUser2(u)}
        toast={setToast}
      />
    ),
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: C.bg,
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "fixed",
          top: -150,
          left: 220,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(124,58,237,.06) 0%,transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Sidebar */}
      <Sidebar
        active={active}
        setActive={setActive}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        user={user}
        onLogout={onLogout}
      />

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Topbar user={user2} setActive={setActive} />

        {/* Screen area */}
        <div
          key={active}
          className="screen-in"
          style={{ flex: 1, overflowY: "auto", padding: 22 }}
        >
          {screens[active]}
        </div>
      </div>

      {/* Toast notification */}
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
