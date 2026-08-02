// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useState } from "react";
import { AlertCircle, Clock3, ImagePlus, PlusCircle, ShieldCheck } from "lucide-react";
import { fmtDue } from "../../../lib/datetime.js";
import { CheckSection, Label } from "../../../ui";

export function PreRideReportSection({ reports = [], canAdd, onAdd }) {
  const [open, setOpen] = useState(false);
  const [desc, setDesc] = useState("");
  const [photo, setPhoto] = useState("");
  const [touched, setTouched] = useState(false);
  const err = desc.trim().length < 10 ? "Describe the existing damage in at least 10 characters." : "";
  const save = () => {
    if (err) { setTouched(true); return; }
    onAdd({ id: `p${Date.now()}`, desc: desc.trim(), photo: photo.trim() || null, at: new Date() });
    setDesc(""); setPhoto(""); setTouched(false); setOpen(false);
  };
  if (!canAdd && reports.length === 0) return null;
  return (
    <CheckSection title="Pre-ride Condition Report" icon={ShieldCheck} right={reports.length > 0 ? <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold" style={{ background: "var(--form-bg)", color: "var(--brand-strong)" }}>{reports.length} logged</span> : null}>
      <p className="text-sm" style={{ color: "#3a4d55" }}>
        Spot a scratch, dent, or missing part <em>before</em> you ride? Log it here with a photo. Anything you report is timestamped and shown to our team, so you can't be charged for damage that was already there.
      </p>

      {reports.length > 0 && (
        <div className="mt-3 flex flex-col gap-2">
          {reports.map((r) => (
            <div key={r.id} className="rounded-xl px-3.5 py-3" style={{ background: "var(--form-bg)" }}>
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold">{r.desc}</p>
                <span className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold" style={{ background: "#dcfce7", color: "#15803d" }}>Logged at pickup</span>
              </div>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 text-xs" style={{ color: "var(--mute)" }}>
                {r.photo ? <span className="flex items-center gap-1 font-semibold" style={{ color: "var(--brand-strong)" }}><ImagePlus size={12} /> {r.photo}</span> : <span className="flex items-center gap-1"><AlertCircle size={12} /> No photo attached</span>}
                <span className="flex items-center gap-1"><Clock3 size={12} /> {fmtDue(r.at)}</span>
              </p>
            </div>
          ))}
        </div>
      )}

      {canAdd && (open ? (
        <div className="mt-3 rounded-xl p-3.5" style={{ background: "var(--form-bg)" }}>
          <Label required>What's already damaged?</Label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} onBlur={() => setTouched(true)} rows={3} placeholder="e.g. Scratch across the left mirror housing, present before pickup…" className="br-input br-field w-full rounded-xl px-3.5 py-2.5 text-sm" style={{ background: "#fff", ...(touched && err ? { borderColor: "#dc2626", boxShadow: "0 0 0 3px rgba(220,38,38,.1)" } : {}) }} />
          {touched && err && <p className="mt-1 flex items-center gap-1 text-xs font-medium" style={{ color: "#dc2626" }}><AlertCircle size={12} /> {err}</p>}
          <div className="mt-2 br-field flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: "#fff" }}><ImagePlus size={14} style={{ color: "var(--brand)" }} /><input value={photo} onChange={(e) => setPhoto(e.target.value)} placeholder="Attach a photo (optional)" className="br-input w-full text-sm" /></div>
          <div className="mt-3 flex gap-2">
            <button onClick={save} className="br-btn br-display rounded-xl px-5 py-2.5 text-sm font-semibold">Log damage</button>
            <button onClick={() => { setOpen(false); setTouched(false); }} className="br-ghost br-display rounded-xl px-5 py-2.5 text-sm font-semibold">Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="br-ghost br-display mt-3 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"><PlusCircle size={15} /> Report existing damage</button>
      ))}
    </CheckSection>
  );
}
