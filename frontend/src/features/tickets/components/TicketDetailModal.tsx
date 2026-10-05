import { ArrowLeft, Mail, X } from "lucide-react";
import { ticketPriorities, ticketStatuses } from "../constants";
import type { Ticket, TicketPriority, TicketStatus } from "../types";
import { formatDate, initials } from "../utils";
import { PriorityBadge, StatusBadge } from "./TicketBadges";

type TicketDetailModalProps = {
  ticket: Ticket;
  error: string;
  onClose: () => void;
  onUpdate: (changes: Partial<Pick<Ticket, "status" | "priority">>) => void;
};

export function TicketDetailModal({ ticket, error, onClose, onUpdate }: TicketDetailModalProps) {
  return (
    <div className="modal-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal detail-modal">
        <div className="detail-top">
          <button className="back-button" onClick={onClose}><ArrowLeft size={15} /> Back to tickets</button>
          <button className="icon-button" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        <div className="detail-kicker">TICKET #{String(ticket.id).padStart(4, "0")}</div>
        <h2 className="detail-title">{ticket.title}</h2>
        <div className="detail-badges"><StatusBadge status={ticket.status} /><PriorityBadge priority={ticket.priority} /></div>
        {error && <div className="modal-error" role="alert">{error}</div>}
        <div className="detail-section"><h3>Description</h3><p>{ticket.description}</p></div>
        <div className="detail-section customer-detail">
          <h3>Customer</h3>
          <div className="customer-cell">
            <span className={`customer-avatar avatar-${ticket.id % 5}`}>{initials(ticket.customerEmail)}</span>
            <span><strong>{ticket.customerEmail}</strong><small>Customer</small></span>
          </div>
        </div>
        <div className="detail-section meta-grid">
          <div><span>Created</span><strong>{formatDate(ticket.createdAt)}</strong></div>
          <div><span>Last updated</span><strong>{formatDate(ticket.updatedAt)}</strong></div>
        </div>
        <div className="edit-fields">
          <label>Status<select value={ticket.status} onChange={(event) => onUpdate({ status: event.target.value as TicketStatus })}>{ticketStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
          <label>Priority<select value={ticket.priority} onChange={(event) => onUpdate({ priority: event.target.value as TicketPriority })}>{ticketPriorities.map((priority) => <option key={priority}>{priority}</option>)}</select></label>
        </div>
        <div className="detail-footer">
          <span><Mail size={14} /> Updates save automatically</span>
          <button className="primary-button" onClick={onClose}>Done</button>
        </div>
      </section>
    </div>
  );
}
