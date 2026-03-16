// src/App.jsx
import AppProviders from "./app/app.providers";
import AppRoutes from "./app/app.routes";
import GlobalStyles from "./shared/styles/GlobalStyles";

export default function App() {
  return (
    <AppProviders>
      <GlobalStyles />
      <AppRoutes />
    </AppProviders>
  );
}
