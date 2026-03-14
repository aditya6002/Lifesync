import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Protected from "./features/auth/components/Protected";
import Signup from "./features/auth/pages/Signup";
import LandingPage from "./pages/LandingPage.jsx";

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/", element: <LandingPage /> },
]);
