import { createBrowserRouter } from "react-router";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import SignupPages from "../pages/SignupPages";
import AppLayout from "../shared/components/layout/AppLayout";

export const router = createBrowserRouter([
  /**
   * @description Landing Page
   * @access Public
   */
  {
    path: "/landing",
    element: <LandingPage />,
  },

  /**
   * @description Login Page
   * @access Public
   */
  {
    path: "login",
    element: <LoginPage />,
  },

  /**
   * @description Signup Page
   * @access Public
   */
  {
    path: "signup",
    element: <SignupPages />,
  },

  /**
   * @description Home Page
   * @access Protected
   */
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: "Home page",
      },
    ],
  },

  /**
   * @description User Profile Page
   * @access Protected
   */
  {
    path: "profile",
    element: <AppLayout />,
    children: [{ index: true, element: "User profile" }],
  },
]);
