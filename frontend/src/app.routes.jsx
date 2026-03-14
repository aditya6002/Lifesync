import { createBrowserRouter } from "react-router";

// Auth pages
import Login from "./features/auth/pages/LoginPage.jsx";
import Signup from "./pages/SignupPage.jsx";

// Features Pages
import AppPage from "./pages/AppPage.jsx";
import ProfilePage from "./modules/profile/ProfilePage.jsx";

//
import Protected from "./features/auth/components/Protected.js";
import LandingPage from "./pages/LandingPage.jsx";

export const router = createBrowserRouter([
  { path: "*", element: <LandingPage /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  {
    path: "/dashboard",
    element: (
      <Protected>
        <AppPage />
      </Protected>
    ),
  },
]);
