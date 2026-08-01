// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useState } from "react";
import { AlertCircle, Check, FileText } from "lucide-react";
import { Label, Modal } from "../../../ui";
import { resubmitItems } from "../utils";

export function ResubmitModal({ listing, onClose, onSubmit }) {
  const items = resubmitItems(listing);
  const [files, setFiles] = useState({});
  const [note, setNote] = useState("");
  const [touched, setTouched] = useState(false);
  const pending = items.filter((i) => !files[i.k]);
  const ready = pending.length === 0;

  const pick = (k) => (e) => { const f = e.target.files?.[0]; if (f) setFiles((p) => ({ ...p, [k]: f.name })); };
  const submit = () => { if (!ready) { setTouched(true); return; } onSubmit(listing.id, { note: note.trim() }); onClose(); };

  return (
    <Modal
      title="Resubmit details"
      subtitle={`${listing.name} · ${listing.reg}`}
      onClose={onClose}
      footer={
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <button onClick={submit} disabled={!ready} className="br-btn br-display rounded-xl py-2.5 text-sm font-semibold sm:flex-1" style={!ready ? { background: "#c3d5dd", boxShadow: "none", cursor: "not-allowed" } : undefined}>Send for review</button>
          <button onClick={onClose} className="br-ghost br-display rounded-xl px-5 py-2.5 text-sm font-semibold">Cancel</button>
        </div>
      }
    >
      {listing.note && (
        <div className="flex items-start gap-2.5 rounded-xl p-3" style={{ background: "#fee2e2", border: "1px solid #fecaca" }}>
          <AlertCircle size={16} className="mt-0.5 shrink-0" style={{ color: "#b91c1c" }} />
          <div>
            <p className="br-display text-xs font-bold" style={{ color: "#b91c1c" }}>Why this was rejected</p>
            <p className="text-xs" style={{ color: "#7f1d1d" }}>{listing.note}</p>
          </div>
        </div>
      )}

      <p className="br-display mt-4 mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: "var(--brand-strong)" }}>
        Only these {items.length === 1 ? "item needs" : "items need"} resubmitting
      </p>
      <div className="flex flex-col gap-2.5">
        {items.map((it) => {
          const done = !!files[it.k];
          return (
            <div key={it.k} className="rounded-xl p-3" style={{ background: "var(--form-bg)", border: `1px solid ${done ? "var(--brand)" : touched ? "#fca5a5" : "transparent"}` }}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="br-display flex items-center gap-1.5 text-sm font-bold">
                    {done ? <Check size={14} style={{ color: "var(--brand)" }} /> : <FileText size={14} style={{ color: "var(--mute)" }} />} {it.label}
                  </p>
                  <p className="mt-0.5 text-xs" style={{ color: "var(--mute)" }}>{done ? files[it.k] : it.hint}</p>
                </div>
                <label className="br-ghost br-display shrink-0 cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold">
                  {done ? "Replace" : "Upload"}
                  <input type="file" accept=".pdf,image/*" className="hidden" onChange={pick(it.k)} />
                </label>
              </div>
            </div>
          );
        })}
      </div>
      {touched && !ready && <p className="mt-2 flex items-center gap-1 text-xs font-medium" style={{ color: "#dc2626" }}><AlertCircle size={12} /> {pending.length} {pending.length === 1 ? "file is" : "files are"} still missing.</p>}

      <div className="mt-4">
        <Label>Note to the reviewer <span style={{ color: "var(--mute)" }}>(optional)</span></Label>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Anything the reviewer should know about the new documents…" className="br-input br-field w-full rounded-xl px-3.5 py-3 text-sm" />
      </div>
      <p className="mt-3 text-xs" style={{ color: "var(--mute)" }}>Everything else on this listing stays as it is — use Edit if you need to change the bike's details or pricing.</p>
    </Modal>
  );
}
