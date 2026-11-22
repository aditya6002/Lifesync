import { createBrowserRouter } from "react-router-dom";

// Components
import Protected from "../components/Protected.jsx";
import AppLayout from "../components/AppLayout.jsx";

// Pages
import DashboardPage from "../pages/DashboardPage.jsx";
import JournalPage from "../pages/JournalPage.jsx";
import ExpensesPage from "../pages/ExpensesPage.jsx";
import CalendarPage from "../pages/CalendarPage.jsx";
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";

const router = createBrowserRouter([
  // Public Routes

  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Register />,
  },

  // Protected Routes
  {
    path: "/",
    element: <Protected />,
    children: [
      {
        element: <AppLayout />,
        children: [
          // Dashboard
          {
            index: true,
            element: <DashboardPage />,
          },

          // Journal
          {
            path: "journal",
            element: <JournalPage />,
          },

          // Expenses
          {
            path: "expenses",
            element: <ExpensesPage />,
          },

          // Calendar
          {
            path: "calendar",
            element: <CalendarPage />,
          },
          {
            path: "tasks",
            element: <h1>Tasks</h1>,
          },
          {
            path: "notes",
            element: <h1>Notes</h1>,
          },
          {
            path: "profile",
            element: <h1>Profile</h1>,
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: (
      <h2 className="text-center text-2xl font-bold mt-20">
        404 - Page Not Found
      </h2>
    ),
  },
]);

export default router;
