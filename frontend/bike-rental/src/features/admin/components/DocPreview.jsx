// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useEffect } from "react";
import { Bike, FileText, Image as ImageIcon, X } from "lucide-react";

export function DocPreview({ doc, bikeName, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 grid place-items-center px-4 py-6"
      style={{ zIndex: 90 }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0"
        onClick={onClose}
        style={{
          background: "rgba(15,39,51,.6)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}
      />
      <div
        className="br-fade-up relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl shadow-2xl"
        style={{ background: "#fff" }}
      >
        <div
          className="flex shrink-0 items-center justify-between gap-3 px-5 py-3.5"
          style={{ borderBottom: "1px solid var(--line)" }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {doc.kind === "image" ? (
              <ImageIcon size={18} style={{ color: "#4f46e5" }} />
            ) : (
              <FileText size={18} style={{ color: "#dc2626" }} />
            )}
            <div className="min-w-0">
              <p className="br-display truncate text-sm font-bold">
                {doc.type}
              </p>
              <p
                className="truncate text-[11px]"
                style={{ color: "var(--mute)" }}
              >
                {(doc.file || "").split("?")[0].split("/").pop()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg"
            style={{ background: "var(--form-bg)" }}
          >
            <X size={16} style={{ color: "var(--mute)" }} />
          </button>
        </div>
        {/* The prototype has no stored binary — this is a faithful stand-in for the page a
            reviewer would see, with the document's own metadata rendered on it. */}
        <div
          className="br-scroll min-h-0 flex-1 overflow-y-auto"
          style={{ background: "#eef2f5" }}
        >
          {!doc.file ? (
            <p
              className="p-6 text-center text-sm"
              style={{ color: "var(--mute)" }}
            >
              No file attached to this document.
            </p>
          ) : doc.kind === "image" ? (
            <img
              src={doc.file}
              alt={doc.type}
              className="mx-auto block max-w-full"
            />
          ) : (
            <iframe
              src={doc.file}
              title={doc.type}
              className="w-full"
              style={{ minHeight: "70vh", border: 0 }}
            />
          )}
          {doc.file && (
            <p className="p-3 text-center text-[11px]">
              <a
                href={doc.file}
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--brand-strong)" }}
              >
                Open in a new tab
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
