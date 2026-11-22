import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { LockProvider } from "./context/LockContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import router from "./app/app.routes.jsx";

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <LockProvider>
          <RouterProvider router={router} />
        </LockProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
