import Nav from "../common/Nav.jsx";
import Sidebar from "../common/Sidebar.jsx";
import LockScreen from "./lock/LockScreen.jsx";
import LockSetupModal from "./lock/LockSetupModal.jsx";
import LockSettingsModal from "./lock/LockSettingsModal.jsx";
import LockForgotModal from "./lock/LockForgotModal.jsx";
import { Outlet } from "react-router-dom";

const AppLayout = ({ children }) => (
  <div className="min-h-screen relative overflow-x-hidden pt-28 pb-32 px-4 sm:px-8 md:px-12 bg-[#fbf2ef] dark:bg-[#120f17] transition-colors duration-300">
    {/* Ambient Glossy Background Blobs */}
    <div
      aria-hidden="true"
      className="fixed -top-24 -left-20 w-[480px] h-[340px] rounded-full bg-amber-200/40 dark:bg-amber-500/10 blur-[100px] pointer-events-none z-0 animate-pulse"
      style={{ animationDuration: "8s" }}
    />
    <div
      aria-hidden="true"
      className="fixed top-1/3 -right-24 w-[520px] h-[380px] rounded-full bg-purple-300/35 dark:bg-purple-600/15 blur-[120px] pointer-events-none z-0"
    />
    <div
      aria-hidden="true"
      className="fixed -bottom-20 left-1/4 w-[420px] h-[300px] rounded-full bg-rose-200/30 dark:bg-rose-500/10 blur-[90px] pointer-events-none z-0"
    />

    <Nav />
    <div className="relative z-10 max-w-7xl mx-auto">
      <Outlet />
    </div>
    <Sidebar />

    <LockScreen />
    <LockSetupModal />
    <LockSettingsModal />
    <LockForgotModal />
  </div>
);

export default AppLayout;
