import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../../features/auth/auth.context";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Toast } from "../ui/Atoms";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toast, setToast] = useState(null);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#07090f",
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

      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        user={user}
        onLogout={logout}
      />

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
        <Topbar user={user} />

        {/* Each child route renders here */}
        <div style={{ flex: 1, overflowY: "auto", padding: 22 }}>
          {/* Pass toast down via context or prop-drill — using window event here for simplicity */}
          <Outlet context={{ toast: setToast }} />
        </div>
      </div>

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
