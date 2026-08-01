// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useState } from "react";
import { AlertCircle, Bike, ChevronRight as Caret, CheckCircle2, Flag, Star, User } from "lucide-react";
import { REPORT_TYPES } from "../../../constants";
import { durationHours, durationLabel, fmtDateTime } from "../../../lib/datetime.js";
import { getDealer } from "../../../mock";
import { BikeImage, CheckSection, Label, Row } from "../../../ui";

export function ReportPage({ bike, criteria, booking, onBack, onRentals, onHome }) {
  const dealer = getDealer(bike, criteria.city);
  const hours = durationHours(criteria.startDate, criteria.startTime, criteria.endDate, criteria.endTime) || 24;
  const [type, setType] = useState("");
  const [reason, setReason] = useState("");
  const [touched, setTouched] = useState(false);
  const [done, setDone] = useState(false);
  const reasonErr = reason.trim().length < 15 ? "Please describe the issue in at least 15 characters." : "";
  const valid = !reasonErr;
  const refId = `RPT-2026-${booking.id.replace(/\D/g, "").slice(-5)}`;
  const submit = () => { if (!valid) { setTouched(true); return; } setDone(true); };

  if (done) return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <span className="br-fade-up grid h-16 w-16 place-items-center rounded-full text-white" style={{ background: "linear-gradient(135deg,var(--brand),var(--brand-2))" }}><CheckCircle2 size={34} /></span>
      <h1 className="br-serif br-fade-up br-d1 mt-5 text-3xl font-bold">Report submitted</h1>
      <p className="br-fade-up br-d2 mt-2 text-sm" style={{ color: "var(--mute)" }}>Thanks for flagging this. Our team will review your report and follow up within 48 hours. Reference <span className="br-display font-bold" style={{ color: "var(--ink)" }}>{refId}</span>.</p>
      <div className="br-fade-up br-d3 mt-6 flex w-full flex-col gap-2.5 sm:flex-row">
        <button onClick={onBack} className="br-btn br-display flex-1 rounded-xl py-3 text-sm font-semibold">Back to Rental Details</button>
        <button onClick={onRentals} className="br-ghost br-display flex-1 rounded-xl py-3 text-sm font-semibold">My Rentals</button>
        <button onClick={onHome} className="br-ghost br-display flex-1 rounded-xl py-3 text-sm font-semibold">Go to Home</button>
      </div>
    </div>
  );

  return (
    <>
      {/* breadcrumb */}
      <div className="bg-white" style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="mx-auto flex max-w-[1200px] items-center gap-1.5 overflow-x-auto px-4 py-3 text-sm sm:px-6 lg:px-8" style={{ color: "var(--mute)" }}>
          <button className="br-crumb whitespace-nowrap" onClick={onHome}>Home</button><Caret size={14} />
          <button className="br-crumb whitespace-nowrap" onClick={onRentals}>My Rentals</button><Caret size={14} />
          <button className="br-crumb whitespace-nowrap" onClick={onBack}>Rental Details</button><Caret size={14} />
          <span className="whitespace-nowrap font-semibold" style={{ color: "var(--ink)" }}>Report an Issue</span>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* header */}
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white" style={{ background: "linear-gradient(135deg,#f97316,#dc2626)" }}><Flag size={20} /></span>
          <div>
            <h1 className="br-serif text-3xl font-bold">Report an Issue</h1>
            <p className="mt-1 text-sm" style={{ color: "var(--mute)" }}>Tell us what went wrong with this rental. Your report is confidential and reviewed by our safety team.</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-5">
          {/* dealer details */}
          <CheckSection title="Dealer Details" icon={User}>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl br-display text-sm font-bold text-white" style={{ background: "linear-gradient(135deg,var(--brand),var(--brand-2))" }}>{dealer.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>
              <div><p className="br-display text-sm font-bold">{dealer.name}</p><p className="flex items-center gap-1 text-xs" style={{ color: "var(--mute)" }}><Star size={12} fill="#f5a623" strokeWidth={0} /> {dealer.rating} · {dealer.area}, {dealer.city}</p></div>
            </div>
            <div className="mt-3 grid gap-x-6 sm:grid-cols-2">
              <Row label="Contact" value="+91 98765 43210" />
              <Row label="Booking ID" value={booking.id} />
            </div>
          </CheckSection>

          {/* bike details */}
          <CheckSection title="Bike Details" icon={Bike}>
            <div className="flex flex-col gap-4 sm:flex-row">
              <BikeImage bike={bike} className="h-24 rounded-xl sm:w-40 sm:shrink-0" />
              <div className="min-w-0 flex-1">
                <h3 className="br-display text-base font-bold">{bike.name}</h3>
                <p className="text-xs" style={{ color: "var(--mute)" }}>{bike.mf} · {bike.cat}</p>
                <div className="mt-2 grid gap-x-6 sm:grid-cols-2">
                  <Row label="Reg. Number" value={booking.regNo} />
                  <Row label="Rental" value={`${fmtDateTime(criteria.startDate, "").trim()} · ${durationLabel(hours)}`} />
                </div>
              </div>
            </div>
          </CheckSection>

          {/* report form */}
          <CheckSection title="What happened?" icon={Flag}>
            <div className="mb-4">
              <Label>Issue Type</Label>
              <div className="br-field rounded-xl px-3 py-2.5"><select value={type} onChange={(e) => setType(e.target.value)} className="br-input w-full text-sm"><option value="">Select an issue type (optional)</option>{REPORT_TYPES.map((t) => <option key={t}>{t}</option>)}</select></div>
            </div>
            <Label required>Reason for Report</Label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} onBlur={() => setTouched(true)} rows={6} placeholder="Describe the issue in detail — what happened, when, and any relevant context…" className="br-input br-field w-full rounded-xl px-3.5 py-3 text-sm" style={touched && reasonErr ? { borderColor: "#dc2626", boxShadow: "0 0 0 3px rgba(220,38,38,.1)" } : undefined} />
            {touched && reasonErr && <p className="mt-1 flex items-center gap-1 text-xs font-medium" style={{ color: "#dc2626" }}><AlertCircle size={12} /> {reasonErr}</p>}

            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
              <button onClick={submit} disabled={!valid} className="br-display flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white sm:flex-1" style={{ background: valid ? "linear-gradient(135deg,#f97316,#dc2626)" : "#e2b8b8", boxShadow: valid ? "0 8px 18px -8px rgba(220,38,38,.5)" : "none", cursor: valid ? "pointer" : "not-allowed" }}><Flag size={16} /> Submit Report</button>
              <button onClick={onBack} className="br-ghost br-display rounded-xl px-6 py-3 text-sm font-semibold">Cancel</button>
            </div>
          </CheckSection>
        </div>
      </div>
    </>
  );
}
