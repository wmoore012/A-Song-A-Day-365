import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import RootLayout from "./components/RootLayout";
import "./styles/index.css";

// Providers
import { TooltipProvider } from "./components/ui/tooltip";

// Scroll animations
import { initScrollAnimations } from "./lib/scrollSetup";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TooltipProvider delayDuration={200}>
      <RootLayout>
        <App />
      </RootLayout>
    </TooltipProvider>
  </React.StrictMode>
);

// Initialize scroll animations after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initScrollAnimations();
});
