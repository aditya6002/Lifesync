import Protected from "./Protected.jsx";
import Nav from "../common/Nav.jsx";

const AppLayout = () => {
  return (
    <>
      <Protected />
      <Nav />
    </>
  );
};

export default AppLayout;
