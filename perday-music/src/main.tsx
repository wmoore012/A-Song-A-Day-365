import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";

// Providers
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TooltipProvider delayDuration={200}>
      <App />
      <Toaster richColors position="top-center" />
    </TooltipProvider>
  </React.StrictMode>
);
