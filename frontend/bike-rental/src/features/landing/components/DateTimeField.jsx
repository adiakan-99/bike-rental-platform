// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
// MODIFIED: the time field was a native <input type="time">, whose browser-drawn popup
// proved unreliable (traps behind the card, doesn't dismiss on outside click — a known
// Chromium quirk with this control, not something app CSS/JS can reach into). Replaced
// with a plain <select> of 30-min slots — dismisses reliably in every browser, and the
// value is still the same "HH:MM" 24-hour string, so nothing downstream (durationHours,
// buildFare, etc.) needed to change.
import { CalendarDays, Clock } from "lucide-react";

const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  const value = `${String(h).padStart(2, "0")}:${m}`;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const label = `${h12}:${m} ${h < 12 ? "AM" : "PM"}`;
  return { value, label };
});

export function DateTimeField({ label, date, time, onDate, onTime, plain, solid }) {
  return (
    <div>
      <label className={`mb-1.5 flex items-center gap-1.5 ${solid ? "text-[11px] font-medium" : "text-xs font-semibold"}`} style={{ color: "var(--mute)" }}>{!plain && <CalendarDays size={14} style={{ color: "var(--brand)" }} />} {label}</label>
      <div className={`br-field ${solid ? "br-field-solid" : ""} flex items-stretch rounded-xl`}>
        <div className="flex min-w-0 flex-1 items-center gap-2 px-3.5 py-3"><CalendarDays size={15} style={{ color: "var(--brand)" }} className="shrink-0" /><input type="date" value={date} onChange={(e) => onDate(e.target.value)} className="br-dt w-full min-w-0 text-sm font-medium" /></div>
        <div className="w-px self-stretch my-2" style={{ background: "var(--line)" }} />
        <div className="flex min-w-0 items-center gap-2 px-3.5 py-3"><Clock size={15} style={{ color: "var(--brand)" }} className="shrink-0" /><select value={time} onChange={(e) => onTime(e.target.value)} className="br-dt min-w-0 bg-transparent text-sm font-medium">{TIME_SLOTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select></div>
      </div>
    </div>
  );
}
