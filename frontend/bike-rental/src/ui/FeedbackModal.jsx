// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useState } from "react";
import { AlertCircle, CheckCircle2, Flag, Mail, Send, User } from "lucide-react";
import { RX } from "../lib/validation.js";
import { Field } from "./Field.jsx";
import { Modal } from "./Modal.jsx";

export function FeedbackModal({ onClose }) {
  const [v, setV] = useState({ name: "", email: "", type: "Feedback", message: "" });
  const [t, setT] = useState({});
  const [sent, setSent] = useState(false);
  const set = (k) => (ev) => setV((p) => ({ ...p, [k]: ev.target.value }));
  const blur = (k) => () => setT((p) => ({ ...p, [k]: true }));
  const e = {};
  if (!v.name.trim()) e.name = "Please tell us your name.";
  if (!v.email.trim()) e.email = "Email is required."; else if (!RX.email.test(v.email)) e.email = "Enter a valid email.";
  if (v.message.trim().length < 10) e.message = "A few more words help us act on this.";
  const valid = Object.keys(e).length === 0;
  const err = (k) => t[k] && e[k];
  const submit = () => { if (!valid) { setT({ name: true, email: true, message: true }); return; } setSent(true); };

  return (
    <Modal title={sent ? "Thanks — we've logged it" : "Write a complaint or feedback"}
      subtitle={sent ? undefined : "Tell us what's working, what isn't, or what you'd like to see."}
      onClose={onClose} maxWidth="max-w-lg"
      footer={sent
        ? <button onClick={onClose} className="br-btn br-display w-full rounded-xl py-2.5 text-sm font-semibold">Close</button>
        : <div className="flex flex-col gap-2.5 sm:flex-row">
            <button onClick={onClose} className="br-ghost br-display rounded-xl py-2.5 text-sm font-semibold sm:flex-1">Cancel</button>
            <button onClick={submit} disabled={!valid} className="br-btn br-display flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold sm:flex-1" style={!valid ? { background: "#c3d5dd", boxShadow: "none", cursor: "not-allowed" } : undefined}><Send size={15} /> Submit</button>
          </div>}>
      {sent ? (
        <div className="flex flex-col items-center py-4 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full text-white" style={{ background: "linear-gradient(135deg,var(--brand),var(--brand-2))" }}><CheckCircle2 size={30} /></span>
          <p className="mt-3 text-sm" style={{ color: "var(--mute)" }}>Your {v.type.toLowerCase()} has reached our support team. We'll reply to {v.email} within 2 working days.</p>
        </div>
      ) : (<>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field icon={User} label="Your Name" required error={e.name} show={err("name")}><input value={v.name} onChange={set("name")} onBlur={blur("name")} placeholder="Aarav Sharma" className="br-input w-full text-sm" /></Field>
          <Field icon={Mail} label="Email" required error={e.email} show={err("email")}><input value={v.email} onChange={set("email")} onBlur={blur("email")} placeholder="you@email.com" className="br-input w-full text-sm" /></Field>
        </div>
        <div className="mt-4"><Field icon={Flag} label="Type"><select value={v.type} onChange={set("type")} className="br-input w-full bg-transparent text-sm">{["Feedback", "Complaint", "Suggestion", "Bug report"].map((o) => <option key={o}>{o}</option>)}</select></Field></div>
        <div className="mt-4">
          <label className="br-display mb-1.5 block text-xs font-semibold" style={{ color: "var(--ink)" }}>Message</label>
          <textarea value={v.message} onChange={set("message")} onBlur={blur("message")} rows={4} placeholder="Tell us what happened or what you'd like to see…" className="br-input br-field w-full rounded-xl px-3.5 py-3 text-sm" style={err("message") ? { borderColor: "#dc2626", boxShadow: "0 0 0 3px rgba(220,38,38,.1)" } : undefined} />
          {err("message") && <p className="mt-1 flex items-center gap-1 text-xs font-medium" style={{ color: "#dc2626" }}><AlertCircle size={12} /> {e.message}</p>}
        </div>
      </>)}
    </Modal>
  );
}
