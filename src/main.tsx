import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ChartSyncProvider } from "./context/ChartSyncContext"; // FIX

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChartSyncProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ChartSyncProvider>
  </React.StrictMode>
);
