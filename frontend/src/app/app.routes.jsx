import { createBrowserRouter } from "react-router-dom";

// Pages
import Protected from "../components/Protected.jsx";
import AppLayout from "../components/AppLayout.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import JournalPage from "../pages/JournalPage.jsx";
import ExpensesPage from "../pages/ExpensesPage.jsx";
import CalendarPage from "../pages/CalendarPage.jsx";
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";

const router = createBrowserRouter([
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "signup",
    element: <Register />,
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
    path: "/journal",
    element: (
      <Protected>
        <AppLayout children={<JournalPage />} />
      </Protected>
    ),
  },
  {
    path: "/expenses",
    element: (
      <Protected>
        <AppLayout children={<ExpensesPage />} />
      </Protected>
    ),
  },
  {
    path: "/calendar",
    element: (
      <Protected>
        <AppLayout children={<CalendarPage />} />
      </Protected>
    ),
  },
  {
    path: "*",
    element: <Login />,
  },
]);

export default router;
