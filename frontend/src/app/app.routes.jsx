import { createBrowserRouter } from "react-router";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import SignupPages from "../pages/SignupPages";
import AppLayout from "../shared/components/layout/AppLayout";
import JournalPage from "../pages/JournalPage";

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
   * @description Expenses Page
   * @access Protected
   */
  {
    path: "/expenses",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: "Expenses Page",
      },
    ],
  },

  /**
   * @description Journal Page
   * @access Protected
   */
  {
    path: "/journal",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <JournalPage />,
      },
    ],
  },

  /**
   * @description Notes Page
   * @access Protected
   */
  {
    path: "/notes",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: "Notes Page",
      },
    ],
  },

  /**
   * @description Tasks Page
   * @access Protected
   */
  {
    path: "/tasks",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: "Tasks Page",
      },
    ],
  },

  /**
   * @description Ai Page
   * @access Protected
   */
  {
    path: "/ai",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: "Ai Page",
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
