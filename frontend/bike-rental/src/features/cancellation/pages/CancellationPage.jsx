// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useState } from "react";
import { AlertTriangle, ArrowRight, Bike, Calendar, CalendarDays, ChevronRight as Caret, Check, CheckCircle2, CircleDollarSign, Clock, Clock3, FileText, Info, Loader2, MessageSquare, Receipt, RefreshCw, XCircle } from "lucide-react";
import { CANCEL_NOTES, CANCEL_REASONS, MONTHS } from "../../../constants";
import { durationHours, durationLabel, fmtDateTime } from "../../../lib/datetime.js";
import { inr } from "../../../lib/money.js";
import { getDealer } from "../../../mock";
import { BikeImage, CheckSection, Row, Sum } from "../../../ui";

export function CancellationPage({ bike, criteria, booking, onKeep, onViewDetails, onRentals, onExplore }) {
  const [stage, setStage] = useState("form"); // form | loading | done
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [c1, setC1] = useState(false), [c2, setC2] = useState(false);

  const f = booking.fare;
  const dealer = getDealer(bike, criteria.city);
  const hours = durationHours(criteria.startDate, criteria.startTime, criteria.endDate, criteria.endTime) || 24;
  const hoursUntil = (new Date(`${criteria.startDate}T${criteria.startTime}`) - new Date()) / 3.6e6;
  const nonRefundable = f.platform + f.booking;
  const penalty = hoursUntil > 24 ? 0 : Math.round(f.rentalNet * 0.5);
  const refund = Math.max(0, f.payNow - nonRefundable - penalty);
  const canConfirm = c1 && c2;

  const now = new Date();
  const ap = now.getHours() >= 12 ? "PM" : "AM";
  const stamp = `${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()} · ${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, "0")} ${ap}`;
  const rrn = `RRN${booking.id.replace(/\D/g, "").slice(-6)}${now.getHours()}${now.getMinutes()}`;

  const confirm = () => { if (!canConfirm) return; setStage("loading"); setTimeout(() => setStage("done"), 2600); };

  const AMBER = "#d97706", AMBER_STRONG = "#b45309", GREEN = "#16a34a", GREEN_BG = "#dcfce7", GREEN_STRONG = "#15803d";

  /* ---------- loading ---------- */
  if (stage === "loading") return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <Loader2 size={44} className="animate-spin" style={{ color: "var(--brand)" }} />
      <h1 className="br-serif mt-5 text-2xl font-bold">Processing your cancellation…</h1>
      <div className="br-card mt-5 w-full rounded-2xl p-5 text-left shadow-sm">
        {["Validating cancellation eligibility", "Calculating your refund", "Initiating refund via payment gateway", "Updating booking status"].map((s, i) => (
          <div key={s} className="flex items-center gap-2.5 py-1.5 text-sm" style={{ color: "#3a4d55" }}><Loader2 size={14} className="animate-spin" style={{ color: "var(--brand)", animationDelay: `${i * 0.2}s` }} /> {s}…</div>
        ))}
      </div>
    </div>
  );

  /* ---------- success ---------- */
  if (stage === "done") {
    const tl = [["Booking Confirmed", true], ["Cancelled", true], ["Refund Initiated", true], ["Refund Completed", false]];
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <div className="br-card br-fade-up overflow-hidden rounded-2xl shadow-sm">
          <div className="px-6 py-9 text-center" style={{ background: `linear-gradient(135deg,${GREEN_BG},#f0fdf4)` }}>
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full text-white shadow-lg" style={{ background: GREEN }}><CheckCircle2 size={36} /></span>
            <h1 className="br-serif mt-4 text-3xl font-bold" style={{ color: GREEN_STRONG }}>Booking Cancelled Successfully</h1>
            <p className="mt-2 text-sm" style={{ color: "#3a4d55" }}>Your refund of <span className="font-bold" style={{ color: GREEN_STRONG }}>{inr(refund)}</span> has been initiated to your original payment method.</p>
          </div>
          <div className="p-5 sm:p-6">
            <div className="grid gap-x-6 sm:grid-cols-2">
              <Row label="Booking ID" value={booking.id} />
              <Row label="Cancelled On" value={stamp} />
              <Row label="Refund Reference" value={rrn} />
              <Row label="Refund Method" value="Original Payment Method" />
              <Row label="Refund Amount" value={inr(refund)} />
              {penalty > 0 && <Row label="Cancellation Penalty" value={inr(penalty)} />}
              <Row label="Est. Completion" value="3–7 business days" />
              <Row label="Booking Status" value="Cancelled" />
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold" style={{ background: GREEN_BG, color: GREEN_STRONG }}><Receipt size={15} /> Payment Status: Refund Initiated</div>

            {/* timeline */}
            <div className="mt-5 flex flex-col">
              {tl.map(([label, done], i) => (
                <div key={label} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-white" style={{ background: done ? GREEN : "#cbd5e1" }}>{done ? <Check size={14} strokeWidth={3} /> : <Clock3 size={13} />}</span>
                    {i < tl.length - 1 && <span className="my-1 w-0.5 flex-1" style={{ background: "var(--line)" }} />}
                  </div>
                  <div className={i < tl.length - 1 ? "pb-3" : ""}><p className="pt-0.5 text-sm font-semibold" style={{ color: done ? "var(--ink)" : "var(--mute)" }}>{label}</p>{!done && <p className="text-xs" style={{ color: "var(--mute)" }}>Pending</p>}</div>
                </div>
              ))}
            </div>

            {/* actions */}
            <button onClick={onViewDetails} className="br-btn br-display mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold">View Rental Details <ArrowRight size={16} /></button>
            <div className="mt-2.5 grid grid-cols-2 gap-2.5">
              <button className="br-ghost br-display flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold"><FileText size={15} /> Receipt</button>
              <button onClick={onRentals} className="br-ghost br-display flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold"><Calendar size={15} /> My Rentals</button>
              <button onClick={onExplore} className="br-ghost br-display flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold"><Bike size={15} /> Explore Bikes</button>
              <button className="br-ghost br-display flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold"><MessageSquare size={15} /> Support</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- form ---------- */
  const refundLines = (
    <>
      <Sum label="Booking Amount" value={inr(f.payNow)} />
      <Sum label="Rental Charges" value={inr(f.rentalNet)} />
      <Sum label="Security Deposit" value={inr(f.deposit)} />
      <Sum label="Platform Fee (non-refundable)" value={`- ${inr(nonRefundable)}`} color="#b45309" />
      <Sum label="Taxes (GST)" value={inr(f.gst)} />
      <Sum label="Cancellation Penalty" value={penalty > 0 ? `- ${inr(penalty)}` : "None"} color={penalty > 0 ? "#dc2626" : GREEN} />
    </>
  );

  return (
    <>
      {/* breadcrumb */}
      <div className="bg-white" style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="mx-auto flex max-w-[1200px] items-center gap-1.5 overflow-x-auto px-4 py-3 text-sm sm:px-6 lg:px-8" style={{ color: "var(--mute)" }}>
          <button className="br-crumb whitespace-nowrap" onClick={onExplore}>Home</button><Caret size={14} />
          <button className="br-crumb whitespace-nowrap" onClick={onRentals}>My Rentals</button><Caret size={14} />
          <button className="br-crumb whitespace-nowrap" onClick={onKeep}>Rental Details</button><Caret size={14} />
          <span className="whitespace-nowrap font-semibold" style={{ color: "var(--ink)" }}>Cancel Booking</span>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* LEFT */}
          <div className="flex min-w-0 flex-col gap-5 lg:w-[64%]">
            {/* warning banner */}
            <div className="rounded-2xl p-5 shadow-sm" style={{ background: "linear-gradient(135deg,#fff7ed,#fffbeb)", border: "1px solid #fde68a" }}>
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white" style={{ background: AMBER }}><AlertTriangle size={22} /></span>
                <div>
                  <h1 className="br-serif text-2xl font-bold" style={{ color: AMBER_STRONG }}>Cancel Booking</h1>
                  <p className="mt-1 text-sm" style={{ color: "#7c5410" }}>You are about to cancel this booking. This action cannot be undone. Please review the cancellation policy and refund details before proceeding.</p>
                </div>
              </div>
            </div>

            {/* booking summary */}
            <CheckSection title="Booking Summary" icon={Receipt}>
              <div className="flex flex-col gap-4 sm:flex-row">
                <BikeImage bike={bike} className="h-32 rounded-xl sm:w-48 sm:shrink-0" />
                <div className="min-w-0 flex-1">
                  <h3 className="br-display text-lg font-bold">{bike.name}</h3>
                  <p className="text-sm" style={{ color: "var(--mute)" }}>{bike.mf} · {bike.cat}</p>
                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <Row label="Reg. Number" value={booking.regNo} />
                    <Row label="Dealer" value={dealer.name} />
                    <Row label="Booking ID" value={booking.id} />
                    <Row label="Status" value={booking.status || "Confirmed"} />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: "#3a4d55" }}>
                    <span className="flex items-center gap-1.5"><CalendarDays size={13} style={{ color: "var(--brand)" }} /> {fmtDateTime(criteria.startDate, criteria.startTime)}</span>
                    <span className="flex items-center gap-1.5"><CalendarDays size={13} style={{ color: "var(--brand)" }} /> {fmtDateTime(criteria.endDate, criteria.endTime)}</span>
                    <span className="flex items-center gap-1.5"><Clock size={13} style={{ color: "var(--brand)" }} /> {durationLabel(hours)}</span>
                  </div>
                </div>
              </div>
            </CheckSection>

            {/* cancellation policy timeline */}
            <CheckSection title="Cancellation Policy" icon={Info}>
              <div className="flex flex-col gap-3">
                {[
                  { icon: CheckCircle2, color: GREEN, title: "More than 24 hours before pickup", items: ["Full refund of Rental Charges", "Full refund of Security Deposit"], active: hoursUntil > 24 },
                  { icon: AlertTriangle, color: AMBER, title: "Less than 24 hours before pickup", items: ["Security Deposit fully refunded", "Rental charges partially refunded after penalty"], active: hoursUntil <= 24 && hoursUntil > 0 },
                  { icon: XCircle, color: "#dc2626", title: "After pickup time", items: ["Booking cannot be cancelled"], active: hoursUntil <= 0 },
                ].map((t) => (
                  <div key={t.title} className="flex gap-3 rounded-xl p-3" style={{ background: t.active ? "var(--form-bg)" : "transparent", border: t.active ? `1px solid ${t.color}55` : "1px solid var(--line)" }}>
                    <t.icon size={20} style={{ color: t.color }} className="mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-bold" style={{ color: t.active ? "var(--ink)" : "var(--mute)" }}>{t.title}{t.active && <span className="ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: t.color, color: "#fff" }}>Applies to you</span>}</p>
                      <ul className="mt-1 flex flex-col gap-0.5 text-xs" style={{ color: "#3a4d55" }}>{t.items.map((it) => <li key={it}>• {it}</li>)}</ul>
                    </div>
                  </div>
                ))}
              </div>
            </CheckSection>

            {/* refund calculation */}
            <CheckSection title="Refund Calculation" icon={CircleDollarSign}>
              <div className="flex flex-col gap-2 text-sm">{refundLines}</div>
              <div className="mt-3 flex items-center justify-between rounded-xl px-4 py-3" style={{ background: GREEN_BG }}>
                <span className="br-display text-sm font-bold" style={{ color: GREEN_STRONG }}>Refund Amount</span>
                <span className="br-display text-2xl font-bold" style={{ color: GREEN_STRONG }}>{inr(refund)}</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl px-3 py-2.5" style={{ background: "var(--form-bg)" }}><p className="text-[11px]" style={{ color: "var(--mute)" }}>Refund Method</p><p className="font-semibold">Original Payment Method</p></div>
                <div className="rounded-xl px-3 py-2.5" style={{ background: "var(--form-bg)" }}><p className="text-[11px]" style={{ color: "var(--mute)" }}>Estimated Time</p><p className="font-semibold">3–7 Business Days</p></div>
              </div>
            </CheckSection>

            {/* cancellation process timeline */}
            <CheckSection title="Cancellation Timeline" icon={RefreshCw}>
              <div className="flex flex-col">
                {["Current Booking", "Cancellation Requested", "Refund Processing", "Refund Completed"].map((s, i, arr) => (
                  <div key={s} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold text-white" style={{ background: i === 0 ? "var(--brand)" : "#cbd5e1" }}>{i + 1}</span>
                      {i < arr.length - 1 && <span className="my-1 w-0.5 flex-1" style={{ background: "var(--line)" }} />}
                    </div>
                    <p className={`pt-1 text-sm ${i === 0 ? "font-bold" : "font-medium"}`} style={{ color: i === 0 ? "var(--ink)" : "var(--mute)", paddingBottom: i < arr.length - 1 ? 12 : 0 }}>{s}</p>
                  </div>
                ))}
              </div>
            </CheckSection>

            {/* reason */}
            <CheckSection title="Reason for Cancellation" icon={MessageSquare}>
              <div className="br-field rounded-xl px-3 py-2.5"><select value={reason} onChange={(e) => setReason(e.target.value)} className="br-input w-full text-sm"><option value="">Select a reason</option>{CANCEL_REASONS.map((r) => <option key={r}>{r}</option>)}</select></div>
              {reason === "Other" && <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Tell us more…" className="br-input br-field mt-2 w-full rounded-xl px-3 py-2.5 text-sm" />}
            </CheckSection>

            {/* important notes */}
            <CheckSection title="Important Notes" icon={Info}>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {CANCEL_NOTES.map((n) => <div key={n.text} className="flex items-start gap-2.5 rounded-xl px-3 py-2.5 text-sm" style={{ background: "var(--form-bg)", color: "#3a4d55" }}><n.icon size={16} style={{ color: "var(--brand)" }} className="mt-0.5 shrink-0" />{n.text}</div>)}
              </div>
            </CheckSection>
          </div>

          {/* RIGHT sticky */}
          <div className="lg:w-[36%]">
            <div className="lg:sticky lg:top-24 flex flex-col gap-4">
              <div className="br-card rounded-2xl p-5 shadow-sm">
                <h3 className="br-display text-sm font-bold">Refund Summary</h3>
                <div className="mt-3 flex flex-col gap-2 text-sm">
                  <Sum label="Booking Amount" value={inr(f.payNow)} />
                  <Sum label="Rental Charges" value={inr(f.rentalNet)} />
                  <Sum label="Security Deposit" value={inr(f.deposit)} />
                  <Sum label="Cancellation Penalty" value={penalty > 0 ? `- ${inr(penalty)}` : "None"} color={penalty > 0 ? "#dc2626" : GREEN} />
                  <Sum label="Taxes (GST)" value={inr(f.gst)} />
                </div>
                <div className="my-3 h-px" style={{ background: "var(--line)" }} />
                <div className="flex items-center justify-between rounded-xl px-3 py-2.5" style={{ background: GREEN_BG }}>
                  <span className="br-display text-sm font-bold" style={{ color: GREEN_STRONG }}>Amount to be Refunded</span>
                  <span className="br-display text-xl font-bold" style={{ color: GREEN_STRONG }}>{inr(refund)}</span>
                </div>

                <div className="mt-4 flex flex-col gap-2.5">
                  <label className="flex cursor-pointer items-start gap-2.5 text-sm" style={{ color: "#3a4d55" }}><input type="checkbox" className="br-check mt-0.5" checked={c1} onChange={(e) => setC1(e.target.checked)} /> I understand the cancellation policy.</label>
                  <label className="flex cursor-pointer items-start gap-2.5 text-sm" style={{ color: "#3a4d55" }}><input type="checkbox" className="br-check mt-0.5" checked={c2} onChange={(e) => setC2(e.target.checked)} /> I understand that this action cannot be undone.</label>
                </div>

                <button onClick={confirm} disabled={!canConfirm} className="br-display mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white" style={{ background: canConfirm ? "linear-gradient(135deg,#f97316,#dc2626)" : "#e2b8b8", boxShadow: canConfirm ? "0 8px 18px -8px rgba(220,38,38,.5)" : "none", cursor: canConfirm ? "pointer" : "not-allowed" }}><AlertTriangle size={16} /> Confirm Cancellation</button>
                {!canConfirm && <p className="mt-2 text-center text-xs" style={{ color: "var(--mute)" }}>Accept both statements to continue.</p>}
                <button onClick={onKeep} className="br-btn br-display mt-2.5 w-full rounded-xl py-2.5 text-sm font-semibold">Keep Booking</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
