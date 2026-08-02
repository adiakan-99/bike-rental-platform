// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { Lock } from "lucide-react";

export function AccessDenied({ title, message, action, onAction }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full" style={{ background: "var(--form-bg)" }}><Lock size={30} style={{ color: "var(--mute)" }} /></span>
      <h1 className="br-serif mt-4 text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-sm" style={{ color: "var(--mute)" }}>{message}</p>
      {action && <button onClick={onAction} className="br-btn br-display mt-6 rounded-xl px-6 py-3 text-sm font-semibold">{action}</button>}
    </div>
  );
}
