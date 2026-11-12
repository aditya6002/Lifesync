import { useNavigate } from "react-router-dom";

const Protected = ({ children }) => {
  const nav = useNavigate();
  const isAuthenticated = true;

  if (!isAuthenticated) {
    nav("/login");
  }

  return children;
};

export default Protected;
