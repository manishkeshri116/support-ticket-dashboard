import type { TicketPriority, TicketStatus, TicketSummary } from "./types";

export const ticketStatuses: TicketStatus[] = ["Open", "In Progress", "Resolved"];
export const ticketPriorities: TicketPriority[] = ["Low", "Medium", "High"];
export const emptyTicketSummary: TicketSummary = {
  total: 0,
  open: 0,
  inProgress: 0,
  resolved: 0,
};
