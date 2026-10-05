import type { Prisma } from "@prisma/client";
import { priorityFromDb, statusFromDb } from "../types/ticket.js";

export function serializeTicket(ticket: Prisma.TicketGetPayload<object>) {
  return {
    id: ticket.id,
    title: ticket.title,
    description: ticket.description,
    customerEmail: ticket.customerEmail,
    priority: priorityFromDb(ticket.priority),
    status: statusFromDb(ticket.status),
    createdAt: ticket.createdAt.toISOString(),
    updatedAt: ticket.updatedAt.toISOString(),
  };
}
