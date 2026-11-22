import Nav from "../common/Nav.jsx";
import Sidebar from "../common/Sidebar.jsx";
import LockScreen from "./lock/LockScreen.jsx";
import LockSetupModal from "./lock/LockSetupModal.jsx";
import LockSettingsModal from "./lock/LockSettingsModal.jsx";
import LockForgotModal from "./lock/LockForgotModal.jsx";

const AppLayout = ({ children }) => (
  <div className="app-shell">
    <Nav />
    {children}
    <Sidebar />
    <LockScreen />
    <LockSetupModal />
    <LockSettingsModal />
    <LockForgotModal />
  </div>
);

export default AppLayout;
