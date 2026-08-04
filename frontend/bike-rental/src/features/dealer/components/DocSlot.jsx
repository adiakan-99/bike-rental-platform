import { useRef } from "react";
import { FileText } from "lucide-react";

export function DocSlot({ doc, entry, onPick, error }) {
  const ref = useRef(null);
  const status = entry?.status;
  const label =
    status === "uploading" ? "Uploading…" : entry ? "Replace" : "Upload";

  return (
    <div
      className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5"
      style={{
        background: "var(--form-bg)",
        border: error ? "1px solid #dc2626" : "1px solid transparent",
      }}
    >
      <span className="min-w-0">
        <span className="flex items-center gap-1.5 text-sm font-medium">
          <FileText size={14} style={{ color: "var(--brand)" }} /> {doc.label}
          {!doc.required && (
            <span className="text-[10px]" style={{ color: "var(--mute)" }}>
              (optional)
            </span>
          )}
        </span>
        {entry?.name && (
          <span
            className="mt-0.5 block truncate text-xs"
            style={{
              color: status === "error" ? "#dc2626" : "var(--brand-strong)",
            }}
          >
            {entry.name}
            {status === "uploaded" && " ✓"}
            {status === "error" && entry.error ? ` — ${entry.error}` : ""}
          </span>
        )}
      </span>
      <button
        onClick={() => ref.current?.click()}
        disabled={status === "uploading"}
        className="br-ghost br-display shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold"
      >
        {label}
      </button>
      <input
        ref={ref}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
