// import AppProviders from "./app/app.providers";
import { router } from "./app/app.routes";
import GlobalStyles from "./shared/styles/GlobalStyles";
// import { Provider } from "react-redux";
// import { store } from "./store/store";
import { RouterProvider } from "react-router";
// import { LoaderProvider } from "./shared/components/ui/GlobalLoader";
// import { SubscriptionProvider } from "./features/subscription/subscription.context";
// import { ActivityProvider } from "./features/activity/activity.context";

export default function App() {
  return (
    // <Provider store={store}>
    // <LoaderProvider>
    // <SubscriptionProvider>
    // <ActivityProvider>
    <>
      <GlobalStyles />
      <RouterProvider router={router} />
    </>
    // </ActivityProvider>
    // </SubscriptionProvider>
    // </LoaderProvider>
    // </Provider>
  );
}
