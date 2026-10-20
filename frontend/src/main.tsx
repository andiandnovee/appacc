import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

const initialLoading = document.getElementById("app-loading");
initialLoading?.classList.add("is-hidden");
window.setTimeout(() => initialLoading?.remove(), 250);

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
