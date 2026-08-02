// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { ChevronRight, Clock3, FileText, Flag, Lock, Phone, Receipt, RefreshCw, Star, XCircle } from "lucide-react";
import { durationLabel, fmtDateTime, fmtDay } from "../../../lib/datetime.js";
import { canDispute, depositLabel, hasOpenDispute } from "../../../lib/deposit.js";
import { inr } from "../../../lib/money.js";
import { BikeImage } from "../../../ui";
import { OverflowMenu } from "./OverflowMenu.jsx";
import { RentalProgress } from "./RentalProgress.jsx";
import { SoftStatus } from "./SoftStatus.jsx";

export function RentalCard({ r, onView, onBook, onCancel, onReview, onReport, readOnly = false }) {
  const ongoing = r.status === "Ongoing";
  // Overflow actions differ by status; View Details stays the single primary button.
  const overflow = readOnly ? [] : {
    Upcoming: [{ icon: Phone, label: "Contact dealer" }, { icon: XCircle, label: "Cancel booking", danger: true, onClick: () => onCancel(r) }, { icon: Flag, label: "Report", onClick: () => onReport(r) }],
    Ongoing: [{ icon: Phone, label: "Contact dealer" }, { icon: Clock3, label: "Extend rental" }, { icon: Flag, label: "Report", onClick: () => onReport(r) }],
    Completed: [{ icon: Star, label: "Write review", onClick: () => onReview(r) }, { icon: FileText, label: "Download invoice" }, { icon: RefreshCw, label: "Book again", onClick: () => onBook(r.bike) }, { icon: Flag, label: "Report", onClick: () => onReport(r) }],
    Cancelled: [{ icon: Receipt, label: "View refund details" }, { icon: RefreshCw, label: "Book again", onClick: () => onBook(r.bike) }, { icon: Flag, label: "Report", onClick: () => onReport(r) }],
  }[r.status] || [];

  return (
    <div className="br-bikecard br-fade-up overflow-hidden rounded-2xl" style={ongoing ? { boxShadow: "0 0 0 1.5px #fdba74, 0 10px 24px -14px rgba(234,88,12,.4)" } : undefined}>
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-stretch">
        {/* left — identity */}
        <div className="flex gap-3 sm:w-56 sm:shrink-0">
          <BikeImage bike={r.bike} className="h-16 w-20 shrink-0 rounded-xl" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5"><h3 className="br-display text-sm font-bold leading-tight">{r.bike.name}</h3><SoftStatus status={r.status} /></div>
            <p className="text-xs" style={{ color: "var(--mute)" }}>{r.bike.cat}</p>
            <p className="mt-1 text-[11px]" style={{ color: "var(--mute)" }}>#{r.id}</p>
          </div>
        </div>

        {/* middle — trip facts */}
        <div className="grid min-w-0 flex-1 grid-cols-2 gap-x-4 gap-y-1.5 text-xs sm:border-l sm:pl-4" style={{ borderColor: "var(--line)" }}>
          <div><p style={{ color: "var(--mute)" }}>Dealer</p><p className="br-display font-semibold" style={{ color: "var(--ink)" }}>{r.dealer.name}</p></div>
          <div><p style={{ color: "var(--mute)" }}>Duration</p><p className="br-display font-semibold" style={{ color: "var(--ink)" }}>{durationLabel(r.hrs)}</p></div>
          <div><p style={{ color: "var(--mute)" }}>📅 Pickup</p><p className="font-semibold" style={{ color: "#3a4d55" }}>{fmtDateTime(r.sd, r.st)}</p></div>
          <div><p style={{ color: "var(--mute)" }}>📅 Return</p><p className="font-semibold" style={{ color: "#3a4d55" }}>{fmtDateTime(r.ed, r.et)}</p></div>
          {ongoing && <div className="col-span-2"><RentalProgress r={r} /></div>}
          {(() => {
            const st = r.settlement;
            const disputable = st ? st.deductions.filter((d) => canDispute(st, d)).length : 0;
            if (disputable) return <div className="col-span-2"><span className="rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: "#fef3c7", color: "#b45309" }}>{disputable} charge{disputable > 1 ? "s" : ""} you can dispute</span></div>;
            if (hasOpenDispute(st)) return <div className="col-span-2"><span className="rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: "#dbeafe", color: "#1d4ed8" }}>Dispute under review</span></div>;
            return null;
          })()}
        </div>

        {/* right — money, Airbnb-style stack */}
        <div className="sm:w-40 sm:shrink-0 sm:border-l sm:pl-4" style={{ borderColor: "var(--line)" }}>
          <p className="br-display text-xl font-bold" style={{ color: r.status === "Cancelled" ? "var(--mute)" : "var(--brand)" }}>{inr(r.amount)}</p>
          <p className="text-[11px]" style={{ color: "var(--mute)" }}>Amount paid</p>
          <p className="mt-2 flex items-center gap-1 text-sm font-semibold" style={{ color: depositLabel(r).tone }}>🪙 {depositLabel(r).text}</p>
          <p className="text-[11px]" style={{ color: "var(--mute)" }}>Deposit</p>
          <p className="mt-2 flex items-center gap-1 text-xs font-semibold" style={{ color: "#3a4d55" }}>📅 {fmtDay(r.bookingDate)}</p>
          <p className="text-[11px]" style={{ color: "var(--mute)" }}>Booked</p>
        </div>
      </div>

      {/* footer — one primary + overflow */}
      <div className="flex items-center justify-between gap-2 px-4 py-2.5" style={{ borderTop: "1px solid var(--line)", background: "var(--form-bg)" }}>
        {readOnly
          ? <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "#b91c1c" }}><Lock size={13} /> Actions locked while suspended</span>
          : <OverflowMenu items={overflow} />}
        <button onClick={() => onView(r)} className="br-btn br-display flex items-center justify-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold">View Details <ChevronRight size={15} /></button>
      </div>
    </div>
  );
}
