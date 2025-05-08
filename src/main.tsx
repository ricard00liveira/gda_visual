/// <reference types="vite-plugin-pwa/client" />
import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "@/context/AuthProvider";
import { App } from "./App";
import { Toaster } from "./components/ui/toaster";
import { registerSW } from "virtual:pwa-register";
import { ThemeProvider } from "next-themes";
registerSW({
  onNeedRefresh() {
    console.log("Nova versão disponível");
  },
  onOfflineReady() {
    console.log("App pronto para uso offline");
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="light">
      <AuthProvider>
        <App />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
