// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./journal.css";
import "./components/lock/lock.css";
import "./theme-dark.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <App />
  // </StrictMode>,
);
