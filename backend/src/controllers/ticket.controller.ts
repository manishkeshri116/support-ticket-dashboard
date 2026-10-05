import type { NextFunction, Request, Response } from "express";
import type { Database } from "../config/database.js";
import { prioritySchema, statusSchema, createTicketSchema, updateTicketSchema } from "../validators/ticket.validation.js";
import { createTicket, findTicket, getSummary, listTickets, updateTicket } from "../services/ticket.service.js";
import { serializeTicket } from "../utils/serializeTicket.js";
import type { ApiError } from "../utils/apiError.js";

function sendError(res: Response, status: number, error: ApiError) {
  return res.status(status).json({ error });
}

function validationDetails(error: { issues: Array<{ path: PropertyKey[]; message: string }> }) {
  return Object.fromEntries(error.issues.map((issue) => [issue.path.join(".") || "body", issue.message]));
}

function validId(rawId: string | string[] | undefined, res: Response) {
  const id = typeof rawId === "string" ? Number(rawId) : Number.NaN;
  if (!Number.isInteger(id) || id < 1) {
    sendError(res, 400, { code: "INVALID_ID", message: "Ticket ID must be a positive integer." });
    return null;
  }
  return id;
}

export function createTicketController(database: Database) {
  return {
    health: (_req: Request, res: Response) => res.json({ status: "ok" }),

    summary: async (_req: Request, res: Response, next: NextFunction) => {
      try {
        return res.json(await getSummary(database));
      } catch (error) {
        return next(error);
      }
    },

    list: async (req: Request, res: Response, next: NextFunction) => {
      const page = Number(req.query.page ?? 1);
      const perPage = Number(req.query.perPage ?? 10);
      const sort = req.query.sort ?? "newest";
      const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
      const rawStatus = req.query.status;
      const rawPriority = req.query.priority;
      if (!Number.isInteger(page) || page < 1 || !Number.isInteger(perPage) || perPage < 1 || perPage > 100) {
        return sendError(res, 400, {
          code: "INVALID_QUERY",
          message: "Page must be at least 1 and perPage must be between 1 and 100.",
        });
      }
      if (sort !== "newest" && sort !== "oldest") {
        return sendError(res, 400, { code: "INVALID_QUERY", message: "Sort must be newest or oldest." });
      }
      const parsedStatus = statusSchema.safeParse(rawStatus);
      if (rawStatus !== undefined && !parsedStatus.success) {
        return sendError(res, 400, { code: "INVALID_QUERY", message: "Status filter is invalid." });
      }
      const parsedPriority = prioritySchema.safeParse(rawPriority);
      if (rawPriority !== undefined && !parsedPriority.success) {
        return sendError(res, 400, { code: "INVALID_QUERY", message: "Priority filter is invalid." });
      }
      try {
        const result = await listTickets(database, {
          page,
          perPage,
          sort,
          search,
          ...(parsedStatus.success && rawStatus !== undefined ? { status: parsedStatus.data } : {}),
          ...(parsedPriority.success && rawPriority !== undefined ? { priority: parsedPriority.data } : {}),
        });
        return res.json({ ...result, tickets: result.tickets.map(serializeTicket) });
      } catch (error) {
        return next(error);
      }
    },

    create: async (req: Request, res: Response, next: NextFunction) => {
      const parsed = createTicketSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendError(res, 400, {
          code: "VALIDATION_ERROR",
          message: "Please correct the highlighted fields.",
          details: validationDetails(parsed.error),
        });
      }
      try {
        const ticket = await createTicket(database, parsed.data);
        return res.status(201).json({ ticket: serializeTicket(ticket) });
      } catch (error) {
        return next(error);
      }
    },

    get: async (req: Request, res: Response, next: NextFunction) => {
      const id = validId(req.params.id, res);
      if (id === null) return;
      try {
        const ticket = await findTicket(database, id);
        if (!ticket) return sendError(res, 404, { code: "NOT_FOUND", message: "Ticket not found." });
        return res.json({ ticket: serializeTicket(ticket) });
      } catch (error) {
        return next(error);
      }
    },

    update: async (req: Request, res: Response, next: NextFunction) => {
      const id = validId(req.params.id, res);
      if (id === null) return;
      const parsed = updateTicketSchema.safeParse(req.body);
      if (!parsed.success) {
        return sendError(res, 400, {
          code: "VALIDATION_ERROR",
          message: "Please correct the highlighted fields.",
          details: validationDetails(parsed.error),
        });
      }
      try {
        const ticket = await updateTicket(database, id, parsed.data);
        return res.json({ ticket: serializeTicket(ticket) });
      } catch (error) {
        if (typeof error === "object" && error !== null && "code" in error && error.code === "P2025") {
          return sendError(res, 404, { code: "NOT_FOUND", message: "Ticket not found." });
        }
        return next(error);
      }
    },
  };
}
