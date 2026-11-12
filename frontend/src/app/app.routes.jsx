import { createBrowserRouter } from "react-router-dom";

// Pages
import Protected from "../components/Protected.jsx";
import AppLayout from "../components/AppLayout.jsx";

const router = createBrowserRouter([
  {
    path: "login",
    element: <h1>Login</h1>,
  },
  {
    path: "signup",
    element: <h1>Signup</h1>,
  },
  {
    path: "/",
    element: (
      <Protected>
        <AppLayout children={<h1>Home page</h1>} />
      </Protected>
    ),
  },
  {
    path: "*",
    element: <h1>Error</h1>,
  },
]);

export default router;
