import AppProviders from "./app/app.providers";
import { router } from "./app/app.routes";
import GlobalStyles from "./shared/styles/GlobalStyles";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { RouterProvider } from "react-router";
import { LoaderProvider } from "./shared/components/ui/GlobalLoader";
import { SubscriptionProvider } from "./features/subscription/subscription.context";

export default function App() {
  return (
    <Provider store={store}>
      <LoaderProvider>
        <SubscriptionProvider>
          <GlobalStyles />
          <RouterProvider router={router} />
        </SubscriptionProvider>
      </LoaderProvider>
    </Provider>
  );
}
