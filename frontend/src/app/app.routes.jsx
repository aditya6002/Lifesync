import { createBrowserRouter } from "react-router";
import LandingPage from "../features/auth/pages/LandingPage";
import LoginPage from "../features/auth/pages/LoginPage";
import Protected from "../features/auth/components/Protected";

export const router = createBrowserRouter([
  { path: "/entry", element: <LandingPage /> },
  {
    path: "/",
    element: (
      <Protected>
        <h1>Home page</h1>
      </Protected>
    ),
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);
