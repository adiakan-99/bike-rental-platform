// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useEffect } from "react";
import { Bike, FileText, Image as ImageIcon, X } from "lucide-react";

export function DocPreview({ doc, bikeName, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 grid place-items-center px-4 py-6" style={{ zIndex: 90 }} role="dialog" aria-modal="true">
      <div className="absolute inset-0" onClick={onClose} style={{ background: "rgba(15,39,51,.6)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }} />
      <div className="br-fade-up relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl shadow-2xl" style={{ background: "#fff" }}>
        <div className="flex shrink-0 items-center justify-between gap-3 px-5 py-3.5" style={{ borderBottom: "1px solid var(--line)" }}>
          <div className="flex items-center gap-2.5 min-w-0">
            {doc.kind === "image" ? <ImageIcon size={18} style={{ color: "#4f46e5" }} /> : <FileText size={18} style={{ color: "#dc2626" }} />}
            <div className="min-w-0"><p className="br-display truncate text-sm font-bold">{doc.type}</p><p className="truncate text-[11px]" style={{ color: "var(--mute)" }}>{doc.file} · {doc.size} · uploaded {doc.uploaded}</p></div>
          </div>
          <button onClick={onClose} aria-label="Close" className="grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ background: "var(--form-bg)" }}><X size={16} style={{ color: "var(--mute)" }} /></button>
        </div>
        {/* The prototype has no stored binary — this is a faithful stand-in for the page a
            reviewer would see, with the document's own metadata rendered on it. */}
        <div className="br-scroll min-h-0 flex-1 overflow-y-auto p-5" style={{ background: "#eef2f5" }}>
          <div className="mx-auto w-full max-w-sm rounded-lg bg-white p-6 shadow-md" style={{ aspectRatio: "3 / 4", border: "1px solid var(--line)" }}>
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--line)" }}>
              <span className="br-display text-[13px] font-bold" style={{ color: "var(--brand-strong)" }}>{doc.type}</span>
              <span className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase" style={{ background: "var(--form-bg)", color: "var(--mute)" }}>{doc.kind === "image" ? "Scan" : "PDF"}</span>
            </div>
            <div className="mt-4 flex flex-col gap-2.5">
              <div className="h-2.5 w-3/4 rounded" style={{ background: "#e2e8f0" }} />
              <div className="h-2.5 w-full rounded" style={{ background: "#eef2f5" }} />
              <div className="h-2.5 w-5/6 rounded" style={{ background: "#eef2f5" }} />
              <div className="mt-3 grid place-items-center rounded-lg" style={{ background: "#f8fafc", border: "1px dashed var(--line)", height: "38%" }}>
                {doc.kind === "image"
                  ? <div className="text-center"><ImageIcon size={30} style={{ color: "#cbd5e1" }} className="mx-auto" /><p className="mt-1 text-[10px]" style={{ color: "#94a3b8" }}>Document scan</p></div>
                  : <div className="text-center"><Bike size={30} style={{ color: "#cbd5e1" }} className="mx-auto" /><p className="mt-1 text-[10px]" style={{ color: "#94a3b8" }}>{bikeName}</p></div>}
              </div>
              <div className="mt-2 h-2.5 w-2/3 rounded" style={{ background: "#eef2f5" }} />
              <div className="h-2.5 w-1/2 rounded" style={{ background: "#eef2f5" }} />
            </div>
          </div>
          <p className="mt-3 text-center text-[11px]" style={{ color: "var(--mute)" }}>Preview rendering — the original file opens in full when connected to storage.</p>
        </div>
      </div>
    </div>
  );
}
