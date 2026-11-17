// Źródło: child-train@b881e09:src/main.tsx (montowanie aplikacji i rejestracja service workera).
// Zmiany: rejestracja service workera przeniesiona do src/pwa/registerServiceWorker.ts.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { registerServiceWorker } from "./pwa/registerServiceWorker";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Brak elementu #root w index.html.");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

registerServiceWorker();
