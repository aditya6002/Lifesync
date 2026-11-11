import { RouterProvider } from "react-router-dom";
import router from "./app/app.routes.jsx";

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
