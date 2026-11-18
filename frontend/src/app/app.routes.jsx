import { createBrowserRouter } from "react-router-dom";

// Pages
import Protected from "../components/Protected.jsx";
import AppLayout from "../components/AppLayout.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";

const router = createBrowserRouter([
  {
    path: "login",
    element: <h1>Login</h1>,
  },
  {
    path: "signup",
    element: <h1>Signup</h1>,
  },
  {
    path: "/",
    element: (
      <Protected>
        <AppLayout children={<DashboardPage />} />
      </Protected>
    ),
  },
  {
    path: "*",
    element: <h1>Error</h1>,
  },
]);

export default router;
