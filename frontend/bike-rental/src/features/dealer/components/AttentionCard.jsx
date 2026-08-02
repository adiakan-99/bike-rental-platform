// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
export function AttentionCard({ icon, label, n, tone, cta, onClick }) {
  const active = n > 0 && tone;
  const tint = { "#dc2626": "#fef2f2", "#d97706": "#fffbeb", "#16a34a": "#f0fdf4", "#2563eb": "#eff6ff" }[tone] || "#fff";
  return (
    <button onClick={onClick} className="br-card flex flex-col rounded-2xl p-4 text-left shadow-sm transition hover:-translate-y-0.5"
      style={active ? { borderColor: tone, background: tint } : undefined}>
      <p className="flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: active ? tone : "#334155" }}><span aria-hidden>{icon}</span> {label}</p>
      <p className="br-display mt-1.5 text-2xl font-bold" style={{ color: active ? tone : "var(--ink)" }}>{n}</p>
      {active && cta && <span className="br-display mt-auto pt-1.5 text-[11px] font-bold" style={{ color: tone }}>{cta} →</span>}
    </button>
  );
}
