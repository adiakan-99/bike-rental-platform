// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useEffect } from "react";
import { X } from "lucide-react";

export function Modal({ title, subtitle, onClose, children, footer, maxWidth = "max-w-lg" }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    const prev = document.body.style.overflow;
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 px-4 py-6" style={{ zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center" }} role="dialog" aria-modal="true">
      <div className="absolute inset-0" onClick={onClose}
        style={{ background: "rgba(15,39,51,.45)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }} />
      <div className={`br-card br-fade-up relative w-full ${maxWidth} rounded-2xl shadow-2xl`}
        style={{ display: "flex", flexDirection: "column", maxHeight: "88vh", overflow: "hidden" }}>
        <div className="flex items-start justify-between gap-3 px-5 py-4" style={{ flexShrink: 0, borderBottom: "1px solid var(--line)" }}>
          <div className="min-w-0">
            <h3 className="br-display truncate text-base font-bold">{title}</h3>
            {subtitle && <p className="truncate text-xs" style={{ color: "var(--mute)" }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} aria-label="Close" className="grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ background: "var(--form-bg)" }}><X size={16} style={{ color: "var(--mute)" }} /></button>
        </div>
        <div className="br-scroll px-5 py-4" style={{ flex: "1 1 auto", minHeight: 0, overflowY: "auto" }}>{children}</div>
        {footer && <div className="px-5 py-4" style={{ flexShrink: 0, borderTop: "1px solid var(--line)", background: "var(--form-bg)" }}>{footer}</div>}
      </div>
    </div>
  );
}
