import { createBrowserRouter } from "react-router";
import LandingPage from "../features/auth/pages/LandingPage";
import LoginPage from "../features/auth/pages/LoginPage";
import Protected from "../features/auth/components/Protected";
import SignupPage from "../features/auth/pages/SignupPages";

export const router = createBrowserRouter([
  { path: "*", element: <LandingPage /> },
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
  {
    path: "signup",
    element: <SignupPage />,
  },
]);
