import { Check, Clock3 } from "lucide-react";
import type { TicketPriority, TicketStatus } from "../types";

export function StatusBadge({ status }: { status: TicketStatus }) {
  const icon = status === "Resolved" ? <Check size={12} /> : status === "In Progress" ? <Clock3 size={12} /> : null;
  return <span className={`badge status-${status.toLowerCase().replace(" ", "-")}`}>{icon}{status}</span>;
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return <span className={`priority priority-${priority.toLowerCase()}`}><span />{priority}</span>;
}
