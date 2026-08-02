// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
export function QuickAction({ icon, label, onClick, primary }) {
  return (
    <button onClick={onClick} className="br-display flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5"
      style={primary ? { background: "linear-gradient(135deg,var(--brand),var(--brand-2))", color: "#fff", boxShadow: "0 8px 18px -8px rgba(15,143,181,.5)" } : { background: "#fff", color: "#334155", border: "1px solid var(--line)" }}>
      <span aria-hidden>{icon}</span> {label}
    </button>
  );
}
