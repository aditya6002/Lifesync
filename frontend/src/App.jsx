import AppProviders from "./app/app.providers";
import { router } from "./app/app.routes";
import GlobalStyles from "./shared/styles/GlobalStyles";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { RouterProvider } from "react-router";

export default function App() {
  return (
    <Provider store={store}>
      <GlobalStyles />
      <RouterProvider router={router} />
    </Provider>
  );
}
