// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useState } from "react";
import { AlertTriangle, Bike, Eye, FileText, Image as ImageIcon, X } from "lucide-react";
import { CAT_GRADIENT } from "../../../constants";
import { inr } from "../../../lib/money.js";
import { Modal, Row } from "../../../ui";
import { DocPreview } from "./DocPreview.jsx";

export function BikeReviewModal({ bike: b, onClose, onDecide, onReject }) {
  const DOC_SET = ["RC book", "Insurance", "PUC"];
  // docs is now a list of uploaded-file objects: { type, file, kind, size, uploaded }
  const docList = Array.isArray(b.docs) ? b.docs : [];
  const docTypes = docList.map((d) => d.type);
  const missing = docList.length ? DOC_SET.filter((d) => !docTypes.includes(d)) : [];
  const [preview, setPreview] = useState(null); // document open in the viewer
  return (
    <Modal
      title={b.name}
      subtitle={`Submitted ${b.date} by ${b.owner}`}
      onClose={onClose}
      maxWidth="max-w-2xl"
      footer={
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <button onClick={() => { onDecide(b.id, "approve"); onClose(); }} className="br-btn br-display rounded-xl py-2.5 text-sm font-semibold sm:flex-1">Approve listing</button>
          <button onClick={() => onReject(b.id)} className="br-display rounded-xl py-2.5 text-sm font-semibold sm:flex-1" style={{ border: "1.5px solid #dc2626", color: "#dc2626", background: "#fff" }}>Reject listing</button>
        </div>
      }
    >
      <div className="flex h-32 items-center justify-center rounded-xl" style={{ background: CAT_GRADIENT[b.cat] || CAT_GRADIENT.Commuter }}>
        <Bike size={62} className="text-white/85" strokeWidth={1.2} />
      </div>

      {missing.length > 0 && (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl p-3" style={{ background: "#fef3c7", border: "1px solid #fde68a" }}>
          <AlertTriangle size={16} className="mt-0.5 shrink-0" style={{ color: "#b45309" }} />
          <p className="text-xs" style={{ color: "#7c5410" }}>Missing {missing.join(", ")}. Rejecting sends the listing back to the partner for resubmission.</p>
        </div>
      )}

      <p className="br-display mt-4 mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: "var(--brand-strong)" }}>Vehicle</p>
      <div className="grid gap-x-6 sm:grid-cols-2">
        <Row label="Bike Name" value={b.name} />
        <Row label="Manufacturer" value={b.mf} />
        <Row label="Category" value={b.cat} />
        <Row label="Engine" value={b.cc ? `${b.cc} cc` : "Electric"} />
        <Row label="Model Year" value={b.year || "—"} />
        <Row label="Registration" value={b.reg || "—"} />
      </div>

      <p className="br-display mt-4 mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: "var(--brand-strong)" }}>Owner &amp; pricing</p>
      <div className="grid gap-x-6 sm:grid-cols-2">
        <Row label="Listed By" value={b.owner} />
        <Row label="Owner Type" value={b.type} />
        <Row label="City" value={b.city || "—"} />
        <Row label="Daily Price" value={inr(b.price)} />
        <Row label="Submitted On" value={b.date} />
      </div>

      <p className="br-display mt-4 mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: "var(--brand-strong)" }}>Uploaded documents</p>
      {docList.length === 0 ? (
        <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm" style={{ background: "var(--form-bg)", color: "var(--mute)" }}><FileText size={15} /> No documents were attached to this submission.</div>
      ) : (
        <div className="grid gap-2.5 sm:grid-cols-2">
          {docList.map((d) => (
            <button key={d.type} type="button" onClick={() => setPreview(d)} className="br-doc-card flex items-center gap-3 rounded-xl p-3 text-left transition" style={{ border: "1px solid var(--line)", background: "#fff" }}>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg" style={{ background: d.kind === "image" ? "#eef2ff" : "#fef2f2" }}>
                {d.kind === "image" ? <ImageIcon size={20} style={{ color: "#4f46e5" }} /> : <FileText size={20} style={{ color: "#dc2626" }} />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="br-display truncate text-sm font-bold">{d.type}</p>
                <p className="truncate text-xs" style={{ color: "var(--mute)" }}>{d.file} · {d.size}</p>
              </div>
              <span className="br-display flex shrink-0 items-center gap-1 text-xs font-semibold" style={{ color: "var(--brand-strong)" }}><Eye size={13} /> View</span>
            </button>
          ))}
        </div>
      )}
      {missing.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {missing.map((m) => <span key={m} className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold" style={{ background: "#fee2e2", color: "#b91c1c" }}><X size={10} /> {m} not uploaded</span>)}
        </div>
      )}

      {b.note && (<>
        <p className="br-display mt-4 mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: "var(--brand-strong)" }}>Partner note</p>
        <p className="rounded-xl px-3 py-2.5 text-sm" style={{ background: "var(--form-bg)", color: "#3a4d55" }}>{b.note}</p>
      </>)}

      {preview && <DocPreview doc={preview} bikeName={b.name} onClose={() => setPreview(null)} />}
    </Modal>
  );
}
