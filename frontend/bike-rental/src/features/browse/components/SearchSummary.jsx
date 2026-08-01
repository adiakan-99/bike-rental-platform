// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { CalendarDays, MapPin, Pencil } from "lucide-react";
import { durationHours, durationLabel, fmtDateTime } from "../../../lib/datetime.js";

export function SearchSummary({ criteria, onEdit }) {
  const dur = durationLabel(durationHours(criteria.startDate, criteria.startTime, criteria.endDate, criteria.endTime));
  return (
    <div className="sticky top-16 z-40 bg-white/95 backdrop-blur" style={{ borderBottom: "1px solid var(--line)" }}>
      <div className="mx-auto max-w-[1200px] px-4 py-3 sm:px-6 lg:px-8">
        <div className="br-card flex flex-col gap-3 rounded-2xl px-4 py-3 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
            <div className="flex items-center gap-2"><MapPin size={17} style={{ color: "var(--brand)" }} /><span className="br-display text-base font-bold">{criteria.city}</span></div>
            <div className="hidden h-5 w-px sm:block" style={{ background: "var(--line)" }} />
            <div className="flex flex-wrap items-center gap-2 text-sm" style={{ color: "#3a4d55" }}><CalendarDays size={15} style={{ color: "var(--mute)" }} /><span>{fmtDateTime(criteria.startDate, criteria.startTime)}</span><span style={{ color: "var(--brand)" }}>→</span><span>{fmtDateTime(criteria.endDate, criteria.endTime)}</span></div>
            {dur && <span className="br-chip w-fit rounded-full px-3 py-1 text-xs font-semibold">Duration · {dur}</span>}
          </div>
          <button onClick={onEdit} className="br-ghost br-display flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"><Pencil size={15} /> Edit Search</button>
        </div>
      </div>
    </div>
  );
}
