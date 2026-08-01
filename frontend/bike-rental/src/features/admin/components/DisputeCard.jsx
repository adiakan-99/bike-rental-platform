// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useState } from "react";
import { AlertCircle, AlertTriangle, Briefcase, Check, Clock3, ImagePlus, RefreshCw, User } from "lucide-react";
import { fmtDue } from "../../../lib/datetime.js";
import { inr } from "../../../lib/money.js";
import { BikeImage, Label } from "../../../ui";

export function DisputeCard({ rental, ded, onResolve }) {
  const [note, setNote] = useState("");
  const [touched, setTouched] = useState(false);
  const err = note.trim().length < 10 ? "A resolution note of at least 10 characters is required." : "";
  const act = (outcome) => { if (err) { setTouched(true); return; } onResolve(outcome, note.trim()); };
  return (
    <div className="br-card rounded-2xl p-5 shadow-sm">
      {/* header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <BikeImage bike={rental.bike} className="h-14 w-20 shrink-0 rounded-xl" />
          <div>
            <p className="br-display text-sm font-bold">{rental.bike.name}</p>
            <p className="text-xs" style={{ color: "var(--mute)" }}>{rental.id} · {rental.dealer.name} · {rental.city}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="br-display text-xl font-bold">{inr(ded.amount)}</p>
          <p className="text-[11px]" style={{ color: "var(--mute)" }}>of {inr(rental.settlement.depositAmount)} deposit</p>
        </div>
      </div>

      {/* both sides */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl px-3.5 py-3" style={{ background: "var(--form-bg)" }}>
          <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide" style={{ color: "var(--brand-strong)" }}><Briefcase size={12} /> Dealer's side</p>
          <p className="text-sm" style={{ color: "#3a4d55" }}>{ded.desc}</p>
          {ded.evidence
            ? <a href="#" className="mt-2 flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--brand-strong)" }}><ImagePlus size={13} /> {ded.evidence}</a>
            : <p className="mt-2 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold" style={{ background: "#fef3c7", color: "#b45309" }}><AlertTriangle size={13} /> No evidence attached</p>}
        </div>
        <div className="rounded-xl px-3.5 py-3" style={{ background: "var(--form-bg)" }}>
          <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide" style={{ color: "var(--brand-strong)" }}><User size={12} /> Renter's side</p>
          <p className="text-sm" style={{ color: "#3a4d55" }}>{ded.disputeReason}</p>
          <p className="mt-2 flex items-center gap-1.5 text-xs" style={{ color: "var(--mute)" }}><Clock3 size={12} /> Raised {ded.disputedAt ? fmtDue(ded.disputedAt) : "recently"}</p>
        </div>
      </div>

      {/* resolution */}
      <div className="mt-4">
        <Label required>Resolution note</Label>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} onBlur={() => setTouched(true)} rows={2} placeholder="Explain the decision — shared with both parties…" className="br-input br-field w-full rounded-xl px-3.5 py-2.5 text-sm" style={touched && err ? { borderColor: "#dc2626", boxShadow: "0 0 0 3px rgba(220,38,38,.1)" } : undefined} />
        {touched && err && <p className="mt-1 flex items-center gap-1 text-xs font-medium" style={{ color: "#dc2626" }}><AlertCircle size={12} /> {err}</p>}
      </div>
      <div className="mt-3 flex flex-col gap-2.5 sm:flex-row">
        <button onClick={() => act("reversed")} className="br-btn br-display flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold sm:flex-1" style={err ? { background: "#c3d5dd", boxShadow: "none" } : undefined}><RefreshCw size={15} /> Reverse charge <span className="opacity-80">(renter wins)</span></button>
        <button onClick={() => act("applied")} className="br-display flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold sm:flex-1" style={{ border: "1.5px solid var(--line)", color: err ? "#94a3b8" : "#334155", background: "#fff" }}><Check size={15} /> Uphold charge <span className="opacity-70">(dealer wins)</span></button>
      </div>
    </div>
  );
}
