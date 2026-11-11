import { createBrowserRouter } from "react-router-dom";

import LoginPage from "../../../frontend2/src/pages/LoginPage.jsx";
import SignupPage from "../../../frontend2/src/pages/SignupPages.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";

const router = createBrowserRouter([
  { path: "register", element: <SignupPage /> },
  { path: "login", element: <LoginPage /> },
  { path: "home", element: <DashboardPage /> },
  { path: "*", element: <DashboardPage /> },
]);

export default router;
