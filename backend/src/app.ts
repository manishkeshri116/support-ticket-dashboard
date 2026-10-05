import express from "express";
import cors from "cors";
import type { Database } from "./config/database.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { createApiRouter } from "./routes/api.routes.js";

export function createApp(database: Database) {
  const app = express();
  const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://support-ticket-dashboard-ashen.vercel.app",
    ...(process.env.CORS_ORIGINS ?? "").split(","),
  ]
    .map((origin) => origin.trim())
    .filter(Boolean);
  app.use(cors({ origin: allowedOrigins }));
  app.use(express.json({ limit: "32kb" }));
  app.use("/api", createApiRouter(database));
  app.use(errorHandler);
  return app;
}
