import { createBrowserRouter } from "react-router";
import LandingPage from "../features/auth/pages/LandingPage";
import LoginPage from "../features/auth/pages/LoginPage";
import Protected from "../features/auth/components/Protected";
import SignupPage from "../features/auth/pages/SignupPages";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import AppLayout from "../shared/components/layout/AppLayout";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  {
    path: "/dashboard",
    element: (
      <Protected>
        <AppLayout />
      </Protected>
    ),
    children: [{ index: true, element: <DashboardPage /> }],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "signup",
    element: <SignupPage />,
  },

  {
    path: "*",
    element: (
      <h1
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        Route Not found
      </h1>
    ),
  },
]);
