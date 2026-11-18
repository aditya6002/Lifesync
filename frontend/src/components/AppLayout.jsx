import Nav from "../common/Nav.jsx";
import Sidebar from "../common/Sidebar.jsx";

const AppLayout = ({ children }) => {
  return (
    <div className="bg-[#ececec] min-h-screen relative">
      <Nav />
      {children}
      <Sidebar />
    </div>
  );
};

export default AppLayout;
