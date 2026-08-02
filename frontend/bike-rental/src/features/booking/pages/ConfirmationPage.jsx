// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useState } from "react";
import { AlertTriangle, ArrowRight, Bike, Calendar, Check, CheckCircle2, Clock, FileText, Flag, Info, LifeBuoy, Mail, MapPin, Navigation2, Phone, Receipt, RefreshCw, ShieldCheck, Star, User } from "lucide-react";
import { CANCEL_TIERS, CONFIRM_RULES, MONTHS, REFUND_STEPS } from "../../../constants";
import { durationHours, durationLabel, fmtDateTime } from "../../../lib/datetime.js";
import { inr } from "../../../lib/money.js";
import { getDealer } from "../../../mock";
import { BikeImage, CheckSection, Row, Sum, SuspendedBanner } from "../../../ui";
import { DisputeModal, PreRideReportSection, SettlementPanel } from "../components";

export function ConfirmationPage({ bike, criteria, booking, onDealer, onHome, onBookings, onCancel, onReview, onReport, settlement, onDispute, preRideReports = [], onPreRide, suspended = false }) {
  const [disputing, setDisputing] = useState(null);
  const dealer = getDealer(bike, criteria.city);
  const hours = durationHours(criteria.startDate, criteria.startTime, criteria.endDate, criteria.endTime) || 24;
  const f = booking.fare;
  const rawStatus = booking.status || "Confirmed";
  const [cancelled, setCancelled] = useState(rawStatus === "Cancelled");

  const d = booking.paidAt instanceof Date ? booking.paidAt : new Date();
  const ap = d.getHours() >= 12 ? "PM" : "AM";
  const stamp = `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()} · ${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")} ${ap}`;

  const hoursUntil = (new Date(`${criteria.startDate}T${criteria.startTime}`) - new Date()) / 3.6e6;
  const eligible = ["Upcoming", "Confirmed"].includes(rawStatus) && hoursUntil > 24 && !cancelled;
  const refundTier = hoursUntil > 48 ? "100% refund" : hoursUntil > 24 ? "75% refund" : hoursUntil > 0 ? "50% refund" : "No refund";

  const GREEN = "#16a34a", GREEN_BG = "#dcfce7", GREEN_STRONG = "#15803d";
  const bookingStatus = cancelled ? "Cancelled" : rawStatus;
  const STATUS_META = {
    Confirmed: { title: "Booking Confirmed!", msg: "Your bike has been successfully reserved. Please arrive at the pickup location with your original Driving License.", color: GREEN, strong: GREEN_STRONG, bg: `linear-gradient(135deg,${GREEN_BG},#f0fdf4)`, icon: CheckCircle2 },
    Upcoming: { title: "Upcoming Rental", msg: "This rental is confirmed and coming up. Arrive at pickup with your original Driving License.", color: "#2563eb", strong: "#1d4ed8", bg: "linear-gradient(135deg,#dbeafe,#eff6ff)", icon: Calendar },
    Ongoing: { title: "Rental in Progress", msg: "Your ride is currently active. Ride safe and return the bike on time.", color: "#ea580c", strong: "#c2410c", bg: "linear-gradient(135deg,#ffedd5,#fff7ed)", icon: Bike },
    Completed: { title: "Rental Completed", msg: "This rental is complete. We hope you enjoyed the ride — book again anytime!", color: GREEN, strong: GREEN_STRONG, bg: `linear-gradient(135deg,${GREEN_BG},#f0fdf4)`, icon: CheckCircle2 },
    Cancelled: { title: "Booking Cancelled", msg: `This booking was cancelled and a ${refundTier === "No refund" ? "partial" : refundTier} is processed as per policy.`, color: "#d97706", strong: "#b45309", bg: "linear-gradient(135deg,#fef3c7,#fff7ed)", icon: AlertTriangle },
  };
  const meta = STATUS_META[bookingStatus] || STATUS_META.Confirmed;

  const StatusBadge = ({ label, value, tone }) => (
    <div className="flex flex-col items-center gap-1 px-4 py-1 text-center">
      <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--mute)" }}>{label}</span>
      <span className="br-display text-sm font-bold" style={{ color: tone }}>{value}</span>
    </div>
  );
  const ActionBtn = ({ icon: Icon, label, onClick, primary }) => (
    <button onClick={onClick} className={`${primary ? "br-btn" : "br-ghost"} br-display flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold`}>
      <Icon size={16} /> {label}
    </button>
  );

  return (
    <>
      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
        {suspended && <SuspendedBanner />}
        {/* success banner */}
        <div className="br-card br-fade-up overflow-hidden rounded-2xl shadow-sm">
          <div className="px-6 py-9 text-center" style={{ background: meta.bg }}>
            <span className="br-fade-up mx-auto grid h-16 w-16 place-items-center rounded-full text-white shadow-lg" style={{ background: meta.color }}>
              <meta.icon size={34} />
            </span>
            <h1 className="br-serif mt-4 text-3xl font-bold sm:text-4xl" style={{ color: meta.strong }}>{meta.title}</h1>
            <p className="mx-auto mt-2 max-w-lg text-sm" style={{ color: "#3a4d55" }}>{meta.msg}</p>
          </div>
          <div className="grid grid-cols-2 divide-x divide-y sm:grid-cols-4 sm:divide-y-0" style={{ borderColor: "var(--line)" }}>
            <div className="flex flex-col items-center gap-1 px-4 py-4 text-center" style={{ borderColor: "var(--line)" }}>
              <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--mute)" }}>Booking ID</span>
              <span className="br-display text-sm font-bold">{booking.id}</span>
            </div>
            <div className="flex flex-col items-center gap-1 px-4 py-4 text-center" style={{ borderColor: "var(--line)" }}>
              <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--mute)" }}>Payment</span>
              <span className="flex items-center gap-1 br-display text-sm font-bold" style={{ color: GREEN_STRONG }}><CheckCircle2 size={14} /> Paid</span>
            </div>
            <div className="flex flex-col items-center gap-1 px-4 py-4 text-center" style={{ borderColor: "var(--line)" }}>
              <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--mute)" }}>Status</span>
              <span className="br-display text-sm font-bold" style={{ color: meta.strong }}>{bookingStatus}</span>
            </div>
            <div className="flex flex-col items-center gap-1 px-4 py-4 text-center" style={{ borderColor: "var(--line)" }}>
              <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--mute)" }}>Booked On</span>
              <span className="br-display text-xs font-bold">{stamp}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          {/* LEFT */}
          <div className="flex min-w-0 flex-col gap-5 lg:w-[68%]">
            {/* Bike details */}
            <CheckSection title="Bike Details" icon={Bike}>
              <div className="flex flex-col gap-4 sm:flex-row">
                <BikeImage bike={bike} className="h-40 rounded-xl sm:w-56 sm:shrink-0" />
                <div className="min-w-0 flex-1">
                  <h3 className="br-display text-lg font-bold">{bike.name}</h3>
                  <p className="text-sm" style={{ color: "var(--mute)" }}>{bike.mf} · {bike.cat}</p>
                  <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                    <Row label="Reg. Number" value={booking.regNo} />
                    <Row label="Mfg. Year" value="2024" />
                    <Row label="Dealer" value={dealer.name} />
                    <Row label="Dealer Rating" value={`${dealer.rating} ★`} />
                  </div>
                </div>
              </div>
            </CheckSection>

            {/* Rental schedule */}
            <CheckSection title="Rental Schedule" icon={Clock}>
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <div className="flex-1 rounded-xl px-4 py-3" style={{ background: "var(--form-bg)" }}>
                  <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--mute)" }}>Pickup</p>
                  <p className="br-display mt-0.5 text-sm font-bold">{fmtDateTime(criteria.startDate, criteria.startTime)}</p>
                </div>
                <div className="flex flex-col items-center px-2"><span className="rounded-full px-3 py-1 text-xs font-bold text-white" style={{ background: "linear-gradient(135deg,var(--brand),var(--brand-2))" }}>{durationLabel(hours)}</span><ArrowRight size={16} className="mt-1 rotate-90 sm:rotate-0" style={{ color: "var(--brand)" }} /></div>
                <div className="flex-1 rounded-xl px-4 py-3" style={{ background: "var(--form-bg)" }}>
                  <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--mute)" }}>Return</p>
                  <p className="br-display mt-0.5 text-sm font-bold">{fmtDateTime(criteria.endDate, criteria.endTime)}</p>
                </div>
              </div>
            </CheckSection>

            {/* Pickup details */}
            <CheckSection title="Pickup Details" icon={MapPin}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Row label="Dealer" value={dealer.name} />
                  <Row label="City" value={dealer.city} />
                  <Row label="Contact" value="+91 98765 43210" />
                  <p className="mt-2 text-sm" style={{ color: "#3a4d55" }}><span className="font-semibold">Address: </span>Shop 14, {dealer.area}, {dealer.city} 411001</p>
                  <div className="mt-3">
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--mute)" }}>Pickup Instructions</p>
                    <ul className="flex flex-col gap-1.5 text-sm" style={{ color: "#3a4d55" }}>
                      {["Carry original Driving License.", "Reach 15–30 minutes before pickup.", "Show Booking ID at the counter.", "Carry a valid government-issued ID."].map((t) => <li key={t} className="flex items-start gap-2"><Check size={15} style={{ color: "var(--brand)" }} className="mt-0.5 shrink-0" /> {t}</li>)}
                    </ul>
                  </div>
                </div>
                <div className="relative h-full min-h-[180px] overflow-hidden rounded-xl" style={{ background: "linear-gradient(135deg,#dbeafe,#cffafe)" }}>
                  <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(15,143,181,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(15,143,181,.12) 1px,transparent 1px)", backgroundSize: "26px 26px" }} />
                  <div className="absolute inset-0 grid place-items-center text-center"><div><MapPin size={30} style={{ color: "var(--brand)" }} className="mx-auto" /><p className="br-display mt-1 text-sm font-bold" style={{ color: "var(--brand-strong)" }}>{dealer.area}, {dealer.city}</p><p className="text-xs" style={{ color: "#5b7a86" }}>Google Maps preview</p></div></div>
                </div>
              </div>
            </CheckSection>

            {/* Payment details */}
            <CheckSection title="Payment Details" icon={Receipt}>
              <div className="flex flex-col gap-2 text-sm">
                <Sum label="Rental Charges" value={inr(f.rentalNet)} />
                <Sum label="Security Deposit" value={inr(f.deposit)} tip="Refundable after ride completion, minus any applicable deductions." />
                <Sum label="Platform Fee" value={inr(f.platform + f.booking)} />
                <Sum label="Insurance Charges" value={inr(f.insurance)} />
                {f.addonsTotal > 0 && <Sum label="Optional Add-ons" value={inr(f.addonsTotal)} />}
                <Sum label="Taxes (GST 18%)" value={inr(f.gst)} />
                <Sum label="Discount Applied" value={`- ${inr(f.discount + f.couponAmt)}`} color={GREEN} />
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl px-4 py-3" style={{ background: GREEN_BG }}>
                <span className="br-display text-sm font-bold" style={{ color: GREEN_STRONG }}>Total Amount Paid</span>
                <span className="br-display text-2xl font-bold" style={{ color: GREEN_STRONG }}>{inr(f.payNow)}</span>
              </div>
              <div className="mt-3 flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm" style={{ background: "var(--form-bg)", color: "#3a4d55" }}>
                <Info size={15} className="mt-0.5 shrink-0" style={{ color: "var(--brand)" }} />
                <span>The security deposit will be refunded after ride completion, subject to deductions for damages, traffic fines, excess kilometers, late return charges, or other applicable penalties.</span>
              </div>
            </CheckSection>

            <PreRideReportSection reports={preRideReports} canAdd={!!onPreRide && ["Upcoming", "Ongoing", "Confirmed"].includes(bookingStatus)} onAdd={onPreRide} />

            {/* Deposit settlement */}
            {settlement
              ? <SettlementPanel settlement={settlement} onDispute={(d) => setDisputing(d)} />
              : (
                <CheckSection title="Security Deposit Refund Process" icon={RefreshCw}>
                  <div className="flex flex-col">
                    {REFUND_STEPS.map((s, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold text-white" style={{ background: i === REFUND_STEPS.length - 1 ? GREEN : "linear-gradient(135deg,var(--brand),var(--brand-2))" }}>{i + 1}</span>
                          {i < REFUND_STEPS.length - 1 && <span className="my-1 w-0.5 flex-1" style={{ background: "var(--line)" }} />}
                        </div>
                        <div className={i < REFUND_STEPS.length - 1 ? "pb-4" : ""}><p className="pt-1 text-sm font-medium" style={{ color: "#3a4d55" }}>{s}</p></div>
                      </div>
                    ))}
                  </div>
                </CheckSection>
              )}

            {/* Rental rules reminder */}
            <CheckSection title="Rental Rules Reminder" icon={ShieldCheck}>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {CONFIRM_RULES.map((r, i) => <div key={i} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium" style={{ background: "var(--form-bg)", color: "#3a4d55" }}><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white"><r.icon size={15} style={{ color: "var(--brand)" }} /></span>{r.text}</div>)}
              </div>
            </CheckSection>

            {/* Cancellation policy */}
            <CheckSection title="Cancellation Policy" icon={Info} right={<span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: eligible ? GREEN_BG : "#fee2e2", color: eligible ? GREEN_STRONG : "#b91c1c" }}>{eligible ? "Cancellation allowed" : cancelled ? "Cancelled" : "Not cancellable"}</span>}>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {CANCEL_TIERS.map((t) => (
                  <div key={t.window} className="rounded-xl px-4 py-3" style={{ background: "var(--form-bg)" }}>
                    <div className="flex items-center justify-between"><span className="text-sm font-medium" style={{ color: "#3a4d55" }}>{t.window}</span><span className="br-display text-sm font-bold" style={{ color: t.color }}>{t.refund}</span></div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full" style={{ background: "#e2e8f0" }}><div className="h-full rounded-full" style={{ width: `${t.pct}%`, background: t.color }} /></div>
                  </div>
                ))}
              </div>
              {eligible ? (
                <div className="mt-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm" style={{ color: "#3a4d55" }}>You're currently eligible for a <span className="font-bold" style={{ color: GREEN_STRONG }}>{refundTier}</span> on cancellation.</p>
                  {!suspended && <button onClick={onCancel} className="br-display shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold" style={{ border: "1.5px solid #dc2626", color: "#dc2626", background: "#fff" }}>Cancel Booking</button>}
                </div>
              ) : (
                <p className="mt-4 text-sm" style={{ color: "var(--mute)" }}>{cancelled ? "This booking has been cancelled. Refunds follow the policy above." : "This booking can no longer be cancelled as the pickup window is within 24 hours."}</p>
              )}
            </CheckSection>
          </div>

          {/* RIGHT sticky */}
          <div className="lg:w-[32%]">
            <div className="flex flex-col gap-4 lg:sticky lg:top-24">
              {/* booking summary */}
              <div className="br-card rounded-2xl p-5 shadow-sm">
                <h3 className="br-display text-sm font-bold">Booking Summary</h3>
                <div className="mt-3 flex flex-col gap-2 text-sm">
                  <div className="flex items-center justify-between"><span style={{ color: "var(--mute)" }}>Booking ID</span><span className="br-display font-bold">{booking.id}</span></div>
                  <div className="flex items-center justify-between"><span style={{ color: "var(--mute)" }}>Booking Status</span><span className="rounded-full px-2.5 py-0.5 text-xs font-bold" style={{ background: meta.bg, color: meta.strong }}>{bookingStatus}</span></div>
                  <div className="flex items-center justify-between"><span style={{ color: "var(--mute)" }}>Payment</span><span className="rounded-full px-2.5 py-0.5 text-xs font-bold" style={{ background: GREEN_BG, color: GREEN_STRONG }}>Paid</span></div>
                </div>
                <div className="my-3 h-px" style={{ background: "var(--line)" }} />
                <div className="flex gap-3">
                  <BikeImage bike={bike} className="h-16 w-20 shrink-0 rounded-xl" />
                  <div className="min-w-0"><p className="br-display truncate text-sm font-bold">{bike.name}</p><p className="truncate text-xs" style={{ color: "var(--mute)" }}>{dealer.name}</p><p className="mt-1 text-xs font-semibold" style={{ color: "var(--brand)" }}>{durationLabel(hours)}</p></div>
                </div>
              </div>

              {/* quick actions */}
              <div className="br-card rounded-2xl p-5 shadow-sm">
                <h3 className="br-display mb-3 text-sm font-bold">Quick Actions</h3>
                <div className="flex flex-col gap-2.5">
                  {bookingStatus === "Completed" && !suspended && <ActionBtn primary icon={Star} label="Write a Review" onClick={onReview} />}
                  <ActionBtn primary={bookingStatus !== "Completed"} icon={User} label="View Dealer Details" onClick={onDealer} />
                  <div className="grid grid-cols-2 gap-2.5">
                    <ActionBtn icon={FileText} label="Invoice" />
                    <ActionBtn icon={Receipt} label="Receipt" />
                  </div>
                  <ActionBtn icon={Calendar} label="View My Bookings" onClick={onBookings} />
                  <div className="grid grid-cols-2 gap-2.5">
                    <ActionBtn icon={Phone} label="Contact" />
                    <ActionBtn icon={Navigation2} label="Directions" />
                  </div>
                  {!suspended && <ActionBtn icon={Flag} label="Report an Issue" onClick={onReport} />}
                  {eligible && !suspended && <button onClick={onCancel} className="br-display w-full rounded-xl py-2.5 text-sm font-semibold" style={{ border: "1.5px solid #dc2626", color: "#dc2626", background: "#fff" }}>Cancel Booking</button>}
                </div>
              </div>

              {/* customer support */}
              <div className="br-card rounded-2xl p-5 shadow-sm">
                <h3 className="br-display mb-3 text-sm font-bold">Customer Support</h3>
                <div className="flex flex-col gap-2.5 text-sm">
                  <a href="tel:+911800123456" className="flex items-center gap-2.5" style={{ color: "#3a4d55" }}><span className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: "var(--form-bg)" }}><Phone size={15} style={{ color: "var(--brand)" }} /></span><div><p className="text-[11px]" style={{ color: "var(--mute)" }}>Support</p><p className="font-semibold">1800 123 456</p></div></a>
                  <a href="mailto:support@bikerental.in" className="flex items-center gap-2.5" style={{ color: "#3a4d55" }}><span className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: "var(--form-bg)" }}><Mail size={15} style={{ color: "var(--brand)" }} /></span><div><p className="text-[11px]" style={{ color: "var(--mute)" }}>Email</p><p className="font-semibold">support@bikerental.in</p></div></a>
                  <a href="tel:+911800999911" className="flex items-center gap-2.5" style={{ color: "#3a4d55" }}><span className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: "#fee2e2" }}><LifeBuoy size={15} style={{ color: "#dc2626" }} /></span><div><p className="text-[11px]" style={{ color: "var(--mute)" }}>Emergency Helpline</p><p className="font-semibold">1800 999 911</p></div></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 bg-white lg:hidden" style={{ borderTop: "1px solid var(--line)", boxShadow: "0 -6px 20px -12px rgba(15,39,51,.4)" }}>
        <div className="grid grid-cols-2 gap-2.5 px-4 py-3">
          <button onClick={onBookings} className="br-btn br-display flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold"><Calendar size={16} /> My Bookings</button>
          <button className="br-ghost br-display flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold"><Phone size={16} /> Contact Dealer</button>
        </div>
      </div>
      <div className="h-16 lg:hidden" />

      {disputing && <DisputeModal deduction={disputing} onClose={() => setDisputing(null)} onSubmit={(id, reason) => onDispute?.(id, reason)} />}
    </>
  );
}
