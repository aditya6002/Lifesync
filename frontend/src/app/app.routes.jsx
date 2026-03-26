import { createBrowserRouter } from "react-router";
import LandingPage from "../pages/LandingPage";

export const router = createBrowserRouter([
  {
    path: "/landing",
    element: <LandingPage />,
  },
]);
