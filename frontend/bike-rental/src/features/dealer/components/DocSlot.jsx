// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useRef } from "react";
import { FileText } from "lucide-react";

export function DocSlot({ doc, file, onPick, error }) {
  const ref = useRef(null);
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5" style={{ background: "var(--form-bg)", border: error ? "1px solid #dc2626" : "1px solid transparent" }}>
      <span className="min-w-0">
        <span className="flex items-center gap-1.5 text-sm font-medium">
          <FileText size={14} style={{ color: "var(--brand)" }} /> {doc.label}
          {!doc.required && <span className="text-[10px]" style={{ color: "var(--mute)" }}>(optional)</span>}
        </span>
        {file && <span className="mt-0.5 block truncate text-xs" style={{ color: "var(--brand-strong)" }}>{file}</span>}
      </span>
      <button onClick={() => ref.current?.click()} className="br-ghost br-display shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold">{file ? "Replace" : "Upload"}</button>
      <input ref={ref} type="file" className="hidden" onChange={(e) => e.target.files?.[0] && onPick(e.target.files[0].name)} />
    </div>
  );
}
