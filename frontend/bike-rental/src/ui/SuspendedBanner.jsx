// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { Ban } from "lucide-react";

export function SuspendedBanner({ compact = false }) {
  return (
    <div className={`flex items-start gap-3 rounded-2xl p-4 ${compact ? "" : "mb-5"}`} style={{ background: "#fee2e2", border: "1px solid #fecaca" }}>
      <Ban size={18} className="mt-0.5 shrink-0" style={{ color: "#b91c1c" }} />
      <div>
        <p className="br-display text-sm font-bold" style={{ color: "#b91c1c" }}>Your account is suspended</p>
        <p className="text-xs" style={{ color: "#7f1d1d" }}>
          You can view your past bookings, but new bookings, reviews, reports, cancellations and listing tools are disabled.
          Write to <span className="font-semibold">support@bikerental.in</span> to get this reviewed.
        </p>
      </div>
    </div>
  );
}
