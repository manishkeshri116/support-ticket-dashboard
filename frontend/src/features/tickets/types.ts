export type TicketStatus = "Open" | "In Progress" | "Resolved";
export type TicketPriority = "Low" | "Medium" | "High";

export type Ticket = {
  id: number;
  title: string;
  description: string;
  customerEmail: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
};

export type TicketSummary = {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
};

export type TicketPagination = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

export type TicketListResponse = {
  tickets: Ticket[];
  pagination: TicketPagination;
};

export type TicketFilters = {
  search: string;
  status: "" | TicketStatus;
  priority: "" | TicketPriority;
  sort: "newest" | "oldest";
  page: number;
};
