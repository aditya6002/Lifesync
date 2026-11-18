import Nav from "../common/Nav.jsx";
import Sidebar from "../common/Sidebar.jsx";

const AppLayout = ({ children }) => (
  <div className="app-shell">
    <Nav />
    {children}
    <Sidebar />
  </div>
);

export default AppLayout;
