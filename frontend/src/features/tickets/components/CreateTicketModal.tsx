import type { FormEventHandler } from "react";
import { Plus, X } from "lucide-react";
import { ticketPriorities } from "../constants";

type CreateTicketModalProps = {
  error: string;
  onClose: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export function CreateTicketModal({ error, onClose, onSubmit }: CreateTicketModalProps) {
  return (
    <div className="modal-overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <form className="modal create-modal" onSubmit={onSubmit}>
        <div className="modal-heading">
          <div className="modal-icon"><Plus size={18} /></div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close"><X size={18} /></button>
          <h2>Create a ticket</h2>
          <p>Add a new customer request to your support inbox.</p>
        </div>
        {error && <div className="modal-error" role="alert">{error}</div>}
        <div className="form-body">
          <label>Title <span className="required">*</span><input name="title" placeholder="e.g. Unable to access my account" maxLength={120} required /></label>
          <label>Description <span className="required">*</span><textarea name="description" placeholder="Describe the customer's issue and any relevant details..." rows={4} required /></label>
          <label>Customer email <span className="required">*</span><input name="customerEmail" type="email" maxLength={254} placeholder="name@company.com" required /></label>
          <label>Priority<select name="priority" defaultValue="Medium">{ticketPriorities.map((priority) => <option key={priority}>{priority}</option>)}</select></label>
        </div>
        <div className="modal-actions">
          <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary-button"><Plus size={16} /> Create ticket</button>
        </div>
      </form>
    </div>
  );
}
