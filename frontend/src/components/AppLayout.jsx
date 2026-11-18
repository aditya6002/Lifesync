import Nav from "../common/Nav.jsx";
import Sidebar from "../common/Sidebar.jsx";

const AppLayout = ({ children }) => {
  return (
    <div
      className="bg-[#d9d9d9]"
      //  className="bg-pink-400 w-screen h-screen p-8 overflow-x-hidden"
    >
      <Nav />
      {children}
      <Sidebar />
    </div>
  );
};

export default AppLayout;
