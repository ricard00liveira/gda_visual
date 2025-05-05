import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "@/context/AuthProvider";
import { App } from "./App";
import { Toaster } from "./components/ui/toaster";
import { registerSW } from "virtual:pwa-register";
const updateSW = registerSW({
  onNeedRefresh() {
    // notifique o usuário, se quiser
  },
  onOfflineReady() {
    console.log("PWA pronta para uso offline.");
  },
});
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <Toaster />
    </AuthProvider>
  </React.StrictMode>
);
