import type { Prisma } from "@prisma/client";
import type { Database } from "../config/database.js";
import {
  priorityToDb,
  statusToDb,
  type TicketPriority,
  type TicketStatus,
} from "../types/ticket.js";

export type ListTicketOptions = {
  page: number;
  perPage: number;
  sort: "newest" | "oldest";
  search: string;
  status?: TicketStatus;
  priority?: TicketPriority;
};

export async function listTickets(database: Database, options: ListTicketOptions) {
  const where: Prisma.TicketWhereInput = {
    ...(options.search ? {
      OR: [
        { title: { contains: options.search, mode: "insensitive" } },
        { customerEmail: { contains: options.search, mode: "insensitive" } },
      ],
    } : {}),
    ...(options.status ? { status: statusToDb(options.status) } : {}),
    ...(options.priority ? { priority: priorityToDb(options.priority) } : {}),
  };
  const [tickets, total] = await Promise.all([
    database.ticket.findMany({
      where,
      orderBy: [
        { createdAt: options.sort === "newest" ? "desc" : "asc" },
        { id: options.sort === "newest" ? "desc" : "asc" },
      ],
      skip: (options.page - 1) * options.perPage,
      take: options.perPage,
    }),
    database.ticket.count({ where }),
  ]);
  return {
    tickets,
    pagination: {
      page: options.page,
      perPage: options.perPage,
      total,
      totalPages: Math.ceil(total / options.perPage),
    },
  };
}

export async function getSummary(database: Database) {
  const [total, open, inProgress, resolved] = await Promise.all([
    database.ticket.count(),
    database.ticket.count({ where: { status: "OPEN" } }),
    database.ticket.count({ where: { status: "IN_PROGRESS" } }),
    database.ticket.count({ where: { status: "RESOLVED" } }),
  ]);
  return { total, open, inProgress, resolved };
}

export function createTicket(database: Database, input: {
  title: string;
  description: string;
  customerEmail: string;
  priority: TicketPriority;
  status?: TicketStatus;
}) {
  return database.ticket.create({
    data: {
      ...input,
      priority: priorityToDb(input.priority),
      status: input.status ? statusToDb(input.status) : "OPEN",
    },
  });
}

export function findTicket(database: Database, id: number) {
  return database.ticket.findUnique({ where: { id } });
}

export function updateTicket(database: Database, id: number, input: {
  status?: TicketStatus;
  priority?: TicketPriority;
}) {
  return database.ticket.update({
    where: { id },
    data: {
      ...(input.status ? { status: statusToDb(input.status) } : {}),
      ...(input.priority ? { priority: priorityToDb(input.priority) } : {}),
    },
  });
}
