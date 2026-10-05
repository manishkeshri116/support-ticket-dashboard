import React from "react";
import { createRoot } from "react-dom/client";
import TicketsPage from "./features/tickets/pages/TicketsPage";
import "./styles.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element #root was not found.");

createRoot(rootElement).render(
  <React.StrictMode>
    <TicketsPage />
  </React.StrictMode>,
);
