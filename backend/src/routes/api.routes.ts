import { Router } from "express";
import type { Database } from "../config/database.js";
import { createTicketController } from "../controllers/ticket.controller.js";

export function createApiRouter(database: Database) {
  const router = Router();
  const tickets = createTicketController(database);

  router.get("/health", tickets.health);
  router.get("/summary", tickets.summary);
  router.get("/tickets", tickets.list);
  router.post("/tickets", tickets.create);
  router.get("/tickets/:id", tickets.get);
  router.patch("/tickets/:id", tickets.update);

  return router;
}
