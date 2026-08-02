// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Modal } from "../../../ui";

export function RejectReasonModal({ kind, name, onClose, onConfirm }) {
  const [reason, setReason] = useState("");
  const [touched, setTouched] = useState(false);
  const PRESETS = kind === "dealer"
    ? ["Documents unclear or unreadable", "Details don't match the uploaded documents", "Business/licence not verifiable", "Incomplete KYC"]
    : ["Photos insufficient or low quality", "Registration details mismatch", "Insurance/PUC expired or missing", "Pricing or specs look incorrect"];
  const err = reason.trim().length < 10 ? "Please give a reason of at least 10 characters." : null;
  const submit = () => { setTouched(true); if (err) return; onConfirm(reason.trim()); };

  return (
    <Modal
      title={`Reject ${kind === "dealer" ? "dealer application" : "bike listing"}`}
      subtitle={name}
      onClose={onClose}
      footer={
        <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-end">
          <button onClick={onClose} className="br-ghost br-display rounded-xl px-5 py-2.5 text-sm font-semibold">Cancel</button>
          <button onClick={submit} className="br-display rounded-xl px-5 py-2.5 text-sm font-semibold" style={{ background: "#dc2626", color: "#fff" }}>Confirm rejection</button>
        </div>
      }
    >
      <div className="flex items-start gap-2.5 rounded-xl p-3" style={{ background: "#fee2e2", border: "1px solid #fecaca" }}>
        <AlertCircle size={16} className="mt-0.5 shrink-0" style={{ color: "#b91c1c" }} />
        <p className="text-xs" style={{ color: "#7f1d1d" }}>The reason is shared with the {kind === "dealer" ? "applicant" : "partner"} so they know what to fix and resubmit.</p>
      </div>

      <p className="br-display mt-4 mb-1.5 text-xs font-semibold" style={{ color: "#334155" }}>Reason for rejection</p>
      <textarea value={reason} onChange={(e) => setReason(e.target.value)} onBlur={() => setTouched(true)} rows={4} autoFocus placeholder="Explain what was wrong and what needs correcting…" className="br-input br-field w-full rounded-xl px-3.5 py-3 text-sm" />
      {touched && err && <p className="mt-1 flex items-center gap-1 text-[11px] font-medium" style={{ color: "#dc2626" }}><AlertCircle size={11} /> {err}</p>}

      <p className="br-display mt-4 mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: "var(--brand-strong)" }}>Common reasons</p>
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((r) => (
          <button key={r} type="button" onClick={() => setReason((cur) => cur ? cur : r)} className="br-filter-chip br-display rounded-lg px-3 py-1.5 text-xs font-semibold">{r}</button>
        ))}
      </div>
    </Modal>
  );
}
