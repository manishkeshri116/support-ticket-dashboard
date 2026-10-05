import express from "express";
import type { Database } from "./config/database.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { createApiRouter } from "./routes/api.routes.js";

export function createApp(database: Database) {
  const app = express();
  app.use(express.json({ limit: "32kb" }));
  app.use("/api", createApiRouter(database));
  app.use(errorHandler);
  return app;
}
