import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Bell, Check, ChevronDown, CircleHelp,
  Clock3, Filter, Inbox, LayoutDashboard, LifeBuoy, LoaderCircle, MessageSquare,
  MoreHorizontal, Plus, Search, Settings, SlidersHorizontal, Sparkles, Ticket as TicketIcon,
  Users, X,
} from "lucide-react";
import { api } from "../../../services/api";
import { StatCard } from "../components/StatCard";
import { CreateTicketModal } from "../components/CreateTicketModal";
import { PriorityBadge, StatusBadge } from "../components/TicketBadges";
import { TicketDetailModal } from "../components/TicketDetailModal";
import { emptyTicketSummary, ticketPriorities, ticketStatuses } from "../constants";
import type { Ticket, TicketFilters, TicketListResponse, TicketSummary } from "../types";
import { formatDate, initials } from "../utils";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [summary, setSummary] = useState<TicketSummary>(emptyTicketSummary);
  const [pagination, setPagination] = useState({ page: 1, perPage: 10, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState<TicketFilters>({ search: "", status: "", priority: "", sort: "newest", page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<"create" | "detail" | null>(null);
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [notice, setNotice] = useState("");
  const [modalError, setModalError] = useState("");

  const query = useMemo(() => {
    const params = new URLSearchParams({ page: String(filters.page), perPage: "10", sort: filters.sort });
    if (filters.search.trim()) params.set("search", filters.search.trim());
    if (filters.status) params.set("status", filters.status);
    if (filters.priority) params.set("priority", filters.priority);
    return params.toString();
  }, [filters]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [list, counts] = await Promise.all([
        api<TicketListResponse>(`/api/tickets?${query}`),
        api<TicketSummary>("/api/summary"),
      ]);
      setTickets(list.tickets);
      setPagination(list.pagination);
      setSummary(counts);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load tickets.");
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => { refresh(); }, [refresh]);

  async function openTicket(ticket: Ticket) {
    try {
      const result = await api<{ ticket: Ticket }>(`/api/tickets/${ticket.id}`);
      setSelected(result.ticket);
      setModal("detail");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load ticket.");
    }
  }

  async function updateTicket(id: number, changes: Partial<Pick<Ticket, "status" | "priority">>) {
    try {
      setModalError("");
      const result = await api<{ ticket: Ticket }>(`/api/tickets/${id}`, { method: "PATCH", body: JSON.stringify(changes) });
      setSelected(result.ticket);
      setNotice("Ticket updated successfully");
      await refresh();
      window.setTimeout(() => setNotice(""), 2800);
    } catch (cause) {
      setModalError(cause instanceof Error ? cause.message : "Unable to update ticket.");
    }
  }

  async function createTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(["title", "description", "customerEmail", "priority"].map((key) => [key, form.get(key)]));
    try {
      await api<{ ticket: Ticket }>("/api/tickets", { method: "POST", body: JSON.stringify(payload) });
      setModal(null);
      setFilters((current) => ({ ...current, page: 1 }));
      setNotice("Ticket created successfully");
      window.setTimeout(() => setNotice(""), 2800);
      if (filters.page === 1) await refresh();
    } catch (cause) {
      setModalError(cause instanceof Error ? cause.message : "Unable to create ticket.");
    }
  }

  const activeFilters = filters.status || filters.priority || filters.search;

  return (
    <div className="app-shell min-h-screen">
      <aside className="sidebar">
        <a className="brand" href="#" aria-label="Support Desk home">
          <span className="brand-mark"><LifeBuoy size={19} strokeWidth={2.2} /></span>
          <span>clear<span className="brand-light">desk</span></span>
        </a>
        <div className="workspace-label">WORKSPACE</div>
        <button className="workspace-switch"><span className="workspace-avatar">A</span><span className="workspace-copy"><strong>Acme Studio</strong><small>Free plan</small></span><ChevronDown size={15} /></button>
        <nav className="nav-list">
          <span className="nav-caption">OVERVIEW</span>
          <a href="#" className="nav-item"><LayoutDashboard size={17} /> Dashboard</a>
          <a href="#" className="nav-item active"><TicketIcon size={17} /> Tickets <span className="nav-count">{summary.open}</span></a>
          <a href="#" className="nav-item"><Users size={17} /> Customers</a>
          <span className="nav-caption nav-caption-spaced">WORKSPACE</span>
          <a href="#" className="nav-item"><MessageSquare size={17} /> Conversations</a>
          <a href="#" className="nav-item"><Sparkles size={17} /> Knowledge base</a>
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card"><span className="help-icon"><CircleHelp size={16} /></span><strong>Need a hand?</strong><p>Visit our help center for tips and answers.</p><a href="mailto:support@cleardesk.example">Visit help center <ArrowRight size={13} /></a></div>
          <button className="nav-item"><Settings size={17} /> Settings</button>
          <div className="profile"><div className="profile-avatar">JD</div><div className="profile-copy"><strong>Jordan Davis</strong><small>Admin</small></div><MoreHorizontal size={18} /></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> <strong>Tickets</strong></div>
          <div className="topbar-actions"><button className="icon-button" aria-label="Help"><CircleHelp size={18} /></button><button className="icon-button notification" aria-label="Notifications"><Bell size={18} /><i /></button><span className="top-divider" /><div className="profile-avatar top-avatar">JD</div></div>
        </header>

        <div className="content">
          <section className="page-heading">
            <div><div className="eyebrow"><span className="eyebrow-dot" /> SUPPORT INBOX</div><h1>Tickets</h1><p className="page-subtitle">Manage and keep track of your customer support requests.</p></div>
            <button className="primary-button" onClick={() => { setError(""); setModalError(""); setModal("create"); }}><Plus size={17} /> New ticket</button>
          </section>

          {error && <div className="alert-error" role="alert"><CircleHelp size={17} /><span>{error}</span><button onClick={() => setError("")} aria-label="Dismiss error"><X size={16} /></button></div>}

          <section className="stats-grid" aria-label="Ticket summary">
            <StatCard title="Total tickets" value={summary.total} icon={<Inbox size={17} />} tone="indigo" trend="All requests" />
            <StatCard title="Open" value={summary.open} icon={<TicketIcon size={17} />} tone="blue" trend="Needs attention" />
            <StatCard title="In progress" value={summary.inProgress} icon={<Clock3 size={17} />} tone="amber" trend="Being worked on" />
            <StatCard title="Resolved" value={summary.resolved} icon={<Check size={17} />} tone="green" trend="Successfully closed" />
          </section>

          <section className="ticket-panel">
            <div className="panel-heading"><div><h2>All tickets <span className="total-pill">{pagination.total}</span></h2><p>A complete view of your customer requests</p></div><button className={`secondary-button ${activeFilters ? "filter-active" : ""}`} onClick={() => setFilters((current) => ({ ...current, status: "", priority: "", page: 1 }))}><SlidersHorizontal size={15} /> Clear filters</button></div>
            <div className="toolbar">
              <label className="search-box"><Search size={16} /><input aria-label="Search tickets" placeholder="Search by title or email..." value={filters.search} onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value, page: 1 }))} /><kbd>⌘ K</kbd></label>
              <div className="filter-controls">                            <label className="select-wrap"><Filter size={14} /><select aria-label="Filter by status" value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value as TicketFilters["status"], page: 1 }))}><option value="">All statuses</option>{ticketStatuses.map((status) => <option key={status}>{status}</option>)}</select><ChevronDown size={13} /></label>
              <label className="select-wrap priority-select"><select aria-label="Filter by priority" value={filters.priority} onChange={(event) => setFilters((current) => ({ ...current, priority: event.target.value as TicketFilters["priority"], page: 1 }))}><option value="">All priorities</option>{ticketPriorities.map((priority) => <option key={priority}>{priority}</option>)}</select><ChevronDown size={13} /></label>
                <label className="select-wrap sort-select"><select aria-label="Sort tickets" value={filters.sort} onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value as TicketFilters["sort"], page: 1 }))}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select>{filters.sort === "newest" ? <ArrowDown size={13} /> : <ArrowUp size={13} />}</label>
              </div>
            </div>
            <div className="table-wrap">
              <table><thead><tr><th className="ticket-col">TICKET</th><th>CUSTOMER</th><th>PRIORITY</th><th>STATUS</th><th>CREATED</th><th aria-label="Open ticket" /></tr></thead>
                <tbody>
                  {loading ? <tr><td colSpan={6}><div className="loading-state"><LoaderCircle className="spinner" size={21} /> Loading tickets…</div></td></tr>
                    : tickets.length === 0 ? <tr><td colSpan={6}><div className="empty-state"><span className="empty-icon"><Inbox size={21} /></span><strong>{activeFilters ? "No tickets match your filters" : "No tickets yet"}</strong><span>{activeFilters ? "Try a different search or clear some filters." : "Create your first ticket to get started."}</span>{activeFilters && <button onClick={() => setFilters({ search: "", status: "", priority: "", sort: "newest", page: 1 })}>Clear filters</button>}</div></td></tr>
                    : tickets.map((ticket) => <tr key={ticket.id} className="ticket-row" onClick={() => openTicket(ticket)} tabIndex={0} onKeyDown={(event) => event.key === "Enter" && openTicket(ticket)}>
                      <td><div className="ticket-title"><span className="ticket-indicator" /><div><strong>{ticket.title}</strong><small>#{String(ticket.id).padStart(4, "0")} <span>·</span> {ticket.description.slice(0, 58)}{ticket.description.length > 58 ? "…" : ""}</small></div></div></td>
                      <td><div className="customer-cell"><span className={`customer-avatar avatar-${ticket.id % 5}`}>{initials(ticket.customerEmail)}</span><span>{ticket.customerEmail}</span></div></td>
                      <td><PriorityBadge priority={ticket.priority} /></td><td><StatusBadge status={ticket.status} /></td><td className="date-cell">{formatDate(ticket.createdAt)}</td><td><button className="row-arrow" aria-label={`Open ${ticket.title}`} onClick={(event) => { event.stopPropagation(); openTicket(ticket); }}><ArrowRight size={15} /></button></td>
                    </tr>)}
                </tbody>
              </table>
            </div>
            <footer className="table-footer"><span>Showing <strong>{pagination.total ? (pagination.page - 1) * pagination.perPage + 1 : 0}–{Math.min(pagination.page * pagination.perPage, pagination.total)}</strong> of <strong>{pagination.total}</strong> tickets</span><div className="pagination"><button aria-label="Previous page" disabled={pagination.page <= 1 || loading} onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))}><ArrowLeft size={14} /> Previous</button><span className="page-number">{pagination.page} <span>/</span> {Math.max(1, pagination.totalPages)}</span><button aria-label="Next page" disabled={pagination.page >= pagination.totalPages || loading} onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}>Next <ArrowRight size={14} /></button></div></footer>
          </section>
          <div className="page-footnote"><span><span className="online-dot" /> All systems operational</span><span>Last synced just now <span className="footnote-divider">·</span> <a href="mailto:support@cleardesk.example">Give feedback</a></span></div>
        </div>
      </main>

      {notice && <div className="toast"><span><Check size={14} /></span>{notice}</div>}
      {modal === "create" && <CreateTicketModal error={modalError} onClose={() => setModal(null)} onSubmit={createTicket} />}
      {modal === "detail" && selected && <TicketDetailModal ticket={selected} error={modalError} onClose={() => setModal(null)} onUpdate={(changes) => updateTicket(selected.id, changes)} />}
    </div>
  );
}
