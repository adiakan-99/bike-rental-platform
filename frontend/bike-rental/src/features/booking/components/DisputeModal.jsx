// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useState } from "react";
import { AlertCircle, CheckCircle2, Flag, X } from "lucide-react";
import { inr } from "../../../lib/money.js";
import { Label } from "../../../ui";

export function DisputeModal({ deduction, onClose, onSubmit }) {
  const [reason, setReason] = useState("");
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);
  const err = reason.trim().length < 20 ? "Please explain in at least 20 characters." : "";
  const submit = () => { if (err) { setTouched(true); return; } onSubmit(deduction.id, reason.trim()); setSent(true); };
  return (
    <div className="fixed inset-0 grid place-items-center px-4" style={{ zIndex: 70 }}>
      <div className="absolute inset-0 bg-black/45" onClick={onClose} />
      <div className="br-card br-fade-up relative w-full max-w-md rounded-2xl p-5 shadow-2xl sm:p-6">
        {sent ? (
          <div className="flex flex-col items-center py-6 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full text-white" style={{ background: "linear-gradient(135deg,var(--brand),var(--brand-2))" }}><CheckCircle2 size={30} /></span>
            <h3 className="br-serif mt-4 text-2xl font-bold">Dispute submitted</h3>
            <p className="mt-2 text-sm" style={{ color: "var(--mute)" }}>Your refund is on hold until our team reviews this charge. We'll notify you once it's resolved.</p>
            <button onClick={onClose} className="br-btn br-display mt-5 w-full rounded-xl py-2.5 text-sm font-semibold">Done</button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2"><Flag size={18} style={{ color: "var(--brand)" }} /><h3 className="br-display text-base font-bold">Dispute this charge</h3></div>
              <button onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-lg br-ghost"><X size={16} /></button>
            </div>
            <div className="mt-4 rounded-xl px-3.5 py-3" style={{ background: "var(--form-bg)" }}>
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold">{deduction.desc}</p>
                <span className="br-display shrink-0 text-sm font-bold">{inr(deduction.amount)}</span>
              </div>
              <p className="mt-1 text-xs" style={{ color: "var(--mute)" }}>{deduction.evidence ? `Evidence: ${deduction.evidence}` : "No evidence attached"}</p>
            </div>
            <div className="mt-4">
              <Label required>Why are you disputing this?</Label>
              <textarea value={reason} onChange={(e) => setReason(e.target.value)} onBlur={() => setTouched(true)} rows={4} placeholder="Explain what happened and include anything that supports your case…" className="br-input br-field w-full rounded-xl px-3.5 py-3 text-sm" style={touched && err ? { borderColor: "#dc2626", boxShadow: "0 0 0 3px rgba(220,38,38,.1)" } : undefined} />
              {touched && err && <p className="mt-1 flex items-center gap-1 text-xs font-medium" style={{ color: "#dc2626" }}><AlertCircle size={12} /> {err}</p>}
            </div>
            <div className="mt-4 flex gap-2.5">
              <button onClick={submit} disabled={!!err} className="br-btn br-display flex-1 rounded-xl py-2.5 text-sm font-semibold" style={err ? { background: "#c3d5dd", boxShadow: "none", cursor: "not-allowed" } : undefined}>Submit dispute</button>
              <button onClick={onClose} className="br-ghost br-display rounded-xl px-5 py-2.5 text-sm font-semibold">Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
