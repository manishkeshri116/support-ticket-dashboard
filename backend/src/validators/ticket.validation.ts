import { z } from "zod";
import { ticketPriorities, ticketStatuses } from "../types/ticket.js";

export const statusSchema = z.enum(ticketStatuses);
export const prioritySchema = z.enum(ticketPriorities);
export const createTicketSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(120, "Title must be 120 characters or fewer."),
  description: z.string().trim().min(1, "Description is required."),
  customerEmail: z.string().trim().email("Enter a valid email address.").max(254, "Email must be 254 characters or fewer."),
  priority: prioritySchema,
  status: statusSchema.optional(),
}).strict();
export const updateTicketSchema = z.object({
  status: statusSchema.optional(),
  priority: prioritySchema.optional(),
}).strict().refine((value) => Object.keys(value).length > 0, "Provide a status or priority to update.");
