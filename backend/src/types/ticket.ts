export const ticketStatuses = ["Open", "In Progress", "Resolved"] as const;
export const ticketPriorities = ["Low", "Medium", "High"] as const;

export type TicketStatus = (typeof ticketStatuses)[number];
export type TicketPriority = (typeof ticketPriorities)[number];

export function statusToDb(status: TicketStatus) {
  switch (status) {
    case "Open": return "OPEN";
    case "In Progress": return "IN_PROGRESS";
    case "Resolved": return "RESOLVED";
  }
}

export function priorityToDb(priority: TicketPriority) {
  switch (priority) {
    case "Low": return "LOW";
    case "Medium": return "MEDIUM";
    case "High": return "HIGH";
  }
}

export function statusFromDb(status: "OPEN" | "IN_PROGRESS" | "RESOLVED"): TicketStatus {
  return status === "IN_PROGRESS" ? "In Progress" : status === "OPEN" ? "Open" : "Resolved";
}

export function priorityFromDb(priority: "LOW" | "MEDIUM" | "HIGH"): TicketPriority {
  return priority === "LOW" ? "Low" : priority === "MEDIUM" ? "Medium" : "High";
}
