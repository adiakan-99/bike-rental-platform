// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useEffect, useRef } from "react";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

export function Toast({ toast, onClose }) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => closeRef.current(), 3200);
    return () => clearTimeout(id);
  }, [toast?.at]);
  if (!toast) return null;
  const tone = {
    success: { bg: "#dcfce7", fg: "#15803d", Icon: CheckCircle2 },
    warn: { bg: "#fef3c7", fg: "#b45309", Icon: AlertTriangle },
    info: { bg: "var(--form-bg)", fg: "var(--brand-strong)", Icon: Info },
  }[toast.tone || "success"];
  return (
    <div className="fixed inset-x-0 flex justify-center px-4" style={{ top: "5rem", zIndex: 100, pointerEvents: "none" }}>
      <div className="br-fade-up br-card flex items-center gap-2.5 rounded-2xl px-4 py-3 shadow-lg" style={{ background: tone.bg, borderColor: "transparent", pointerEvents: "auto", maxWidth: 420 }}>
        <tone.Icon size={17} style={{ color: tone.fg }} className="shrink-0" />
        <span className="text-sm font-medium" style={{ color: tone.fg }}>{toast.msg}</span>
        <button onClick={onClose} aria-label="Dismiss" className="ml-1 shrink-0"><X size={15} style={{ color: tone.fg, opacity: .7 }} /></button>
      </div>
    </div>
  );
}
