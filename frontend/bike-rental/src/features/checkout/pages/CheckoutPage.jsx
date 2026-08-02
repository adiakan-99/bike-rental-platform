// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useMemo, useState } from "react";
import { AlertCircle, ArrowRight, ChevronRight as Caret, Check, CheckCircle2, CircleDollarSign, Clock, Clock3, FileText, Info, Loader2, Lock, MapPin, Phone, PlusCircle, Receipt, RefreshCw, Route, ShieldCheck, Star, Tag, User, Wallet } from "lucide-react";
import { ADDONS, CANCEL_TIERS, PAYMENTS, RENTAL_RULES, TC_SECTIONS } from "../../../constants";
import { durationHours, durationLabel, fmtDateTime } from "../../../lib/datetime.js";
import { inr } from "../../../lib/money.js";
import { getDealer } from "../../../mock";
import { Accordion, BikeImage, CheckSection, Row, Sum } from "../../../ui";
import { TL } from "../components";

export function CheckoutPage({ bike, criteria, onBack, onHome, onConfirmed }) {
  const dealer = getDealer(bike, criteria.city);
  const hours = durationHours(criteria.startDate, criteria.startTime, criteria.endDate, criteria.endTime) || 24;
  const days = Math.max(1, Math.ceil(hours / 24));
  const [addons, setAddons] = useState(new Set());
  const [promo, setPromo] = useState("");
  const [coupon, setCoupon] = useState(null); // {code, amount, label}
  const [promoMsg, setPromoMsg] = useState(null);
  const [pay, setPay] = useState("upi");
  const [a1, setA1] = useState(false), [a2, setA2] = useState(false), [a3, setA3] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | creating | launching

  const bookingId = `BR-2026-${100000 + bike.id * 137}`;
  const regNo = `${criteria.city.slice(0, 2).toUpperCase()}12 AB ${1000 + bike.id * 7}`;

  const toggleAddon = (k) => setAddons((p) => { const s = new Set(p); s.has(k) ? s.delete(k) : s.add(k); return s; });
  const addonsTotal = ADDONS.filter((a) => addons.has(a.key)).reduce((s, a) => s + a.price, 0);

  const applyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (!code) return setPromoMsg({ ok: false, text: "Enter a coupon code." });
    if (code === "RIDE100") { setCoupon({ code, amount: 100, label: "RIDE100" }); setPromoMsg({ ok: true, text: "₹100 off applied!" }); }
    else if (code === "WEEKEND") { setCoupon({ code, amount: Math.round(bike.price * days * 0.1), label: "WEEKEND" }); setPromoMsg({ ok: true, text: "10% weekend discount applied!" }); }
    else { setCoupon(null); setPromoMsg({ ok: false, text: "Invalid coupon code." }); }
  };

  const p = useMemo(() => {
    const rentalGross = bike.orig * days;
    const rentalNet = bike.price * days;
    const discount = rentalGross - rentalNet;
    const platform = 49, booking = 25, insurance = 79;
    const helmet = bike.helmet ? 0 : 40;
    const delivery = 0;
    const couponAmt = coupon ? coupon.amount : 0;
    const taxable = rentalNet + platform + booking + insurance + helmet + delivery + addonsTotal - couponAmt;
    const gst = Math.max(0, Math.round(taxable * 0.18));
    const payNow = taxable + gst + bike.deposit;
    return { rentalGross, rentalNet, discount, platform, booking, insurance, helmet, delivery, couponAmt, addonsTotal, gst, deposit: bike.deposit, payNow };
  }, [bike, days, addonsTotal, coupon]);

  const canPay = a1 && a2 && a3;
  const busy = phase !== "idle";
  const phaseLabel = phase === "creating" ? "Creating secure order…" : "Launching Razorpay…";
  // In production: POST to backend → create Razorpay order → open Razorpay Checkout modal → verify signature.
  // Here we mock the async hand-off with loading states; the modal itself is provided by the Razorpay SDK.
  const startPayment = () => {
    if (!canPay || busy) return;
    setPhase("creating");
    setTimeout(() => setPhase("launching"), 1100);
    setTimeout(() => { setPhase("idle"); onConfirmed({ id: bookingId, regNo, fare: p, addons: ADDONS.filter((a) => addons.has(a.key)), coupon, paidAt: new Date() }); }, 2300);
  };

  const RightSummary = (
    <div className="flex flex-col gap-4">
      {/* booking mini */}
      <div className="br-card overflow-hidden rounded-2xl shadow-sm">
        <div className="flex gap-3 p-4">
          <BikeImage bike={bike} className="h-16 w-20 shrink-0 rounded-xl" />
          <div className="min-w-0">
            <p className="br-display truncate text-sm font-bold">{bike.name}</p>
            <p className="truncate text-xs" style={{ color: "var(--mute)" }}>{dealer.name}</p>
            <p className="mt-1 text-xs" style={{ color: "#3a4d55" }}>{durationLabel(hours)} · {fmtDateTime(criteria.startDate, "").split("·")[0]}→ {fmtDateTime(criteria.endDate, "").split("·")[0]}</p>
          </div>
        </div>
      </div>

      {/* payment summary */}
      <div className="br-card rounded-2xl p-5 shadow-sm">
        <h3 className="br-display text-sm font-bold">Payment Summary</h3>
        <div className="mt-3 flex flex-col gap-2 text-sm">
          <Sum label="Rental charges" value={inr(p.rentalNet)} />
          <Sum label="Security deposit" value={inr(p.deposit)} tip="Fully refundable after the bike is returned and inspected, minus any damages, fines or extra charges." />
          <Sum label="Taxes (GST 18%)" value={inr(p.gst)} />
          <Sum label="Platform + booking fee" value={inr(p.platform + p.booking)} />
          <Sum label="Insurance" value={inr(p.insurance)} />
          {p.helmet > 0 && <Sum label="Helmet rental" value={inr(p.helmet)} />}
          {p.addonsTotal > 0 && <Sum label="Add-ons" value={inr(p.addonsTotal)} />}
          <Sum label="Discount" value={`- ${inr(p.discount)}`} color="var(--brand)" />
          {p.couponAmt > 0 && <Sum label={`Coupon (${coupon.label})`} value={`- ${inr(p.couponAmt)}`} color="var(--brand)" />}
        </div>
        <div className="my-3 h-px" style={{ background: "var(--line)" }} />
        <div className="flex items-center justify-between rounded-xl px-3 py-2.5" style={{ background: "var(--form-bg)" }}>
          <span className="br-display text-sm font-bold">Amount Payable Now</span>
          <span className="br-display text-xl font-bold" style={{ color: "var(--brand)" }}>{inr(p.payNow)}</span>
        </div>
      </div>

      {/* promo */}
      <div className="br-card rounded-2xl p-5 shadow-sm">
        <label className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--mute)" }}><Tag size={13} style={{ color: "var(--brand)" }} /> Promo Code</label>
        <div className="flex gap-2">
          <div className="br-field flex flex-1 items-center gap-2 rounded-xl px-3 py-2.5"><input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Try RIDE100 or WEEKEND" className="br-input w-full text-sm" /></div>
          <button onClick={applyPromo} className="br-ghost br-display rounded-xl px-4 py-2.5 text-sm font-semibold">Apply</button>
        </div>
        {promoMsg && <p className="mt-1.5 flex items-center gap-1 text-xs font-medium" style={{ color: promoMsg.ok ? "var(--brand)" : "#dc2626" }}>{promoMsg.ok ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />} {promoMsg.text}</p>}
      </div>

      {/* payment method */}
      <div className="br-card rounded-2xl p-5 shadow-sm">
        <h3 className="br-display text-sm font-bold">Payment Method</h3>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {PAYMENTS.map((m) => {
            const on = pay === m.key;
            return (
              <button key={m.key} onClick={() => setPay(m.key)} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition" style={on ? { border: "1.5px solid var(--brand)", background: "var(--form-bg)", color: "var(--brand)" } : { border: "1px solid var(--line)", color: "#334155" }}>
                <span className="grid h-4 w-4 place-items-center rounded-full" style={{ border: on ? "4px solid var(--brand)" : "1.5px solid #cbd5e1" }} />
                <m.icon size={15} /> <span className="truncate">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* agreements + CTA */}
      <div className="br-card rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col gap-2.5">
          <label className="flex cursor-pointer items-start gap-2.5 text-sm" style={{ color: "#3a4d55" }}><input type="checkbox" className="br-check mt-0.5" checked={a1} onChange={(e) => setA1(e.target.checked)} /> I agree to the Rental Agreement.</label>
          <label className="flex cursor-pointer items-start gap-2.5 text-sm" style={{ color: "#3a4d55" }}><input type="checkbox" className="br-check mt-0.5" checked={a2} onChange={(e) => setA2(e.target.checked)} /> I understand the security deposit may be adjusted against damages, fines, or additional charges.</label>
          <label className="flex cursor-pointer items-start gap-2.5 text-sm" style={{ color: "#3a4d55" }}><input type="checkbox" className="br-check mt-0.5" checked={a3} onChange={(e) => setA3(e.target.checked)} /> I accept the cancellation policy.</label>
        </div>
        <button onClick={startPayment} disabled={!canPay || busy} className="br-btn br-display mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold" style={(!canPay || busy) ? { background: busy ? undefined : "#c3d5dd", boxShadow: busy ? undefined : "none", cursor: busy ? "wait" : "not-allowed" } : undefined}>
          {busy ? <><Loader2 size={16} className="animate-spin" /> {phaseLabel}</> : <>Proceed to Payment · {inr(p.payNow)}</>}
        </button>
        {!canPay && !busy && <p className="mt-2 text-center text-xs" style={{ color: "var(--mute)" }}>Accept all three agreements to continue.</p>}
        <p className="mt-2 flex items-center justify-center gap-1.5 text-[11px]" style={{ color: "var(--mute)" }}><Lock size={12} /> Secured by Razorpay — payment completes in a secure modal.</p>
        <button onClick={onBack} disabled={busy} className="br-ghost br-display mt-2.5 w-full rounded-xl py-2.5 text-sm font-semibold" style={busy ? { opacity: 0.5, cursor: "not-allowed" } : undefined}>Back to Bike Details</button>
      </div>
    </div>
  );

  return (
    <>
      {/* breadcrumb */}
      <div className="bg-white" style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="mx-auto flex max-w-[1200px] items-center gap-1.5 overflow-x-auto px-4 py-3 text-sm sm:px-6 lg:px-8" style={{ color: "var(--mute)" }}>
          <button className="br-crumb" onClick={onHome}>Home</button><Caret size={14} />
          <button className="br-crumb" onClick={onBack}>Search Results</button><Caret size={14} />
          <button className="br-crumb whitespace-nowrap" onClick={onBack}>Bike Details</button><Caret size={14} />
          <span className="whitespace-nowrap font-semibold" style={{ color: "var(--ink)" }}>Checkout</span>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="br-serif text-3xl font-bold">Review & Confirm Booking</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--mute)" }}>You're almost there — review the details, add extras, and pay securely.</p>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          {/* LEFT */}
          <div className="flex min-w-0 flex-col gap-5 lg:w-[68%]">
            {/* Booking summary card */}
            <CheckSection title="Booking Summary" icon={Receipt} right={<span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: "#fef3c7", color: "#b45309" }}>Pending Payment</span>}>
              <div className="flex flex-col gap-4 sm:flex-row">
                <BikeImage bike={bike} className="h-40 rounded-xl sm:w-56 sm:shrink-0" />
                <div className="min-w-0 flex-1">
                  <h3 className="br-display text-lg font-bold">{bike.name}</h3>
                  <p className="text-sm" style={{ color: "var(--mute)" }}>{bike.mf} · {bike.cat}</p>
                  <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                    <Row label="Reg. Number" value={regNo} />
                    <Row label="Mfg. Year" value="2024" />
                    <Row label="Category" value={bike.cat} />
                    <Row label="Booking ID" value={bookingId} />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl px-3 py-2.5 text-sm" style={{ background: "var(--form-bg)" }}>
                    <span className="flex items-center gap-1.5 font-semibold"><User size={14} style={{ color: "var(--brand)" }} /> {dealer.name}</span>
                    <span className="flex items-center gap-1"><Star size={13} fill="#f5a623" strokeWidth={0} /> {dealer.rating}</span>
                    <span className="flex items-center gap-1.5" style={{ color: "#3a4d55" }}><Phone size={13} style={{ color: "var(--brand)" }} /> +91 {dealer.rentals ? "98765 43210" : "98765 43210"}</span>
                  </div>
                </div>
              </div>
            </CheckSection>

            {/* Rental duration */}
            <CheckSection title="Rental Duration" icon={Clock}>
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
                      <li className="flex items-start gap-2"><Check size={15} style={{ color: "var(--brand)" }} className="mt-0.5 shrink-0" /> Bring your original Driving License.</li>
                      <li className="flex items-start gap-2"><Check size={15} style={{ color: "var(--brand)" }} className="mt-0.5 shrink-0" /> Arrive within 30 minutes of scheduled pickup.</li>
                      <li className="flex items-start gap-2"><Check size={15} style={{ color: "var(--brand)" }} className="mt-0.5 shrink-0" /> Carry your booking confirmation.</li>
                    </ul>
                  </div>
                </div>
                <div className="relative h-full min-h-[180px] overflow-hidden rounded-xl" style={{ background: "linear-gradient(135deg,#dbeafe,#cffafe)" }}>
                  <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(15,143,181,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(15,143,181,.12) 1px,transparent 1px)", backgroundSize: "26px 26px" }} />
                  <div className="absolute inset-0 grid place-items-center text-center">
                    <div><MapPin size={30} style={{ color: "var(--brand)" }} className="mx-auto" /><p className="br-display mt-1 text-sm font-bold" style={{ color: "var(--brand-strong)" }}>{dealer.area}, {dealer.city}</p><p className="text-xs" style={{ color: "#5b7a86" }}>Google Maps preview</p></div>
                  </div>
                </div>
              </div>
            </CheckSection>

            {/* Return details */}
            <CheckSection title="Return Details" icon={RefreshCw}>
              <Row label="Return Address" value={`Same as pickup · ${dealer.area}`} />
              <Row label="Return Date & Time" value={fmtDateTime(criteria.endDate, criteria.endTime)} />
              <div className="mt-2 flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm" style={{ background: "#fff7ed", color: "#b45309" }}><AlertCircle size={15} className="mt-0.5 shrink-0" /> <span><span className="font-semibold">Late return policy: </span>₹150 per hour beyond the scheduled return time, deducted from your deposit.</span></div>
            </CheckSection>

            {/* Fare breakdown */}
            <CheckSection title="Fare Breakdown" icon={Receipt}>
              <div className="flex flex-col gap-2 text-sm">
                <Sum label={`Rental charges (${inr(bike.orig)} × ${days})`} value={inr(p.rentalGross)} />
                <Sum label="Discount applied" value={`- ${inr(p.discount)}`} color="var(--brand)" />
                <Sum label="Security deposit (refundable)" value={inr(p.deposit)} tip="Held now and refunded after the ride, minus any deductions for damage, fines or extra usage." />
                <Sum label="Platform / convenience fee" value={inr(p.platform)} />
                <Sum label="Booking fee" value={inr(p.booking)} />
                <Sum label="Insurance charges" value={inr(p.insurance)} />
                {p.helmet > 0 && <Sum label="Helmet rental" value={inr(p.helmet)} />}
                <Sum label="Delivery / pickup charges" value={p.delivery === 0 ? "Free" : inr(p.delivery)} color={p.delivery === 0 ? "var(--brand)" : undefined} />
                {p.addonsTotal > 0 && <Sum label="Optional add-ons" value={inr(p.addonsTotal)} />}
                {p.couponAmt > 0 && <Sum label={`Coupon (${coupon.label})`} value={`- ${inr(p.couponAmt)}`} color="var(--brand)" />}
                <Sum label="GST (18%)" value={inr(p.gst)} />
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl px-4 py-3" style={{ background: "var(--form-bg)" }}>
                <span className="br-display text-sm font-bold">Amount Payable Now</span>
                <span className="br-display text-2xl font-bold" style={{ color: "var(--brand)" }}>{inr(p.payNow)}</span>
              </div>
            </CheckSection>

            {/* Add-ons */}
            <CheckSection title="Additional Services" icon={PlusCircle} right={<span className="text-xs" style={{ color: "var(--mute)" }}>Optional</span>}>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {ADDONS.map((a) => {
                  const on = addons.has(a.key);
                  return (
                    <button key={a.key} onClick={() => toggleAddon(a.key)} className="flex items-center justify-between gap-2 rounded-xl px-3.5 py-3 text-left transition" style={on ? { border: "1.5px solid var(--brand)", background: "var(--form-bg)" } : { border: "1px solid var(--line)" }}>
                      <span className="flex items-center gap-2.5 text-sm font-medium"><a.icon size={16} style={{ color: "var(--brand)" }} /> {a.label}</span>
                      <span className="flex items-center gap-2"><span className="text-sm font-semibold">{inr(a.price)}</span><span className="grid h-5 w-5 place-items-center rounded-md text-white" style={{ background: on ? "var(--brand)" : "#cbd5e1" }}>{on ? <Check size={13} strokeWidth={3} /> : <PlusCircle size={13} />}</span></span>
                    </button>
                  );
                })}
              </div>
            </CheckSection>

            {/* Payment timeline */}
            <CheckSection title="Payment Timeline" icon={CircleDollarSign}>
              <div className="flex flex-col">
                <TL color="var(--brand)" icon={Wallet} title="At Booking" badge="Payment Required" badgeColor="#b45309" badgeBg="#fef3c7" last={false}>
                  <p className="text-sm" style={{ color: "#3a4d55" }}>You pay rental charges, refundable security deposit, and taxes & fees now.</p>
                </TL>
                <TL color="#0d9488" icon={Route} title="During Rental" badge="If applicable" badgeColor="#0f766e" badgeBg="#ccfbf1" last={false}>
                  <p className="text-sm" style={{ color: "#3a4d55" }}>Possible extra charges: extra kilometres, fuel, traffic challans, damage, missing accessories, late return, or cleaning.</p>
                </TL>
                <TL color="#7c3aed" icon={RefreshCw} title="After Ride Completion" badge="Refund" badgeColor="#6d28d9" badgeBg="#ede9fe" last>
                  <p className="text-sm" style={{ color: "#3a4d55" }}>The bike is inspected and your deposit is refunded after deducting any extra km, challans, damage, late-return or penalty charges.</p>
                  <p className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--brand-strong)" }}><Clock3 size={14} /> Estimated refund processing: 3–7 business days</p>
                </TL>
              </div>
            </CheckSection>

            {/* Cancellation policy */}
            <CheckSection title="Cancellation Policy" icon={Info}>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {CANCEL_TIERS.map((t) => (
                  <div key={t.window} className="rounded-xl px-4 py-3" style={{ background: "var(--form-bg)" }}>
                    <div className="flex items-center justify-between"><span className="text-sm font-medium" style={{ color: "#3a4d55" }}>{t.window}</span><span className="br-display text-sm font-bold" style={{ color: t.color }}>{t.refund}</span></div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full" style={{ background: "#e2e8f0" }}><div className="h-full rounded-full" style={{ width: `${t.pct}%`, background: t.color }} /></div>
                  </div>
                ))}
              </div>
            </CheckSection>

            {/* Rental rules */}
            <CheckSection title="Important Rental Rules" icon={ShieldCheck}>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {RENTAL_RULES.map((r, i) => <div key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "#3a4d55" }}><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg" style={{ background: "var(--form-bg)" }}><r.icon size={15} style={{ color: "var(--brand)" }} /></span><span className="pt-1">{r.text}</span></div>)}
              </div>
            </CheckSection>

            {/* T&C */}
            <CheckSection title="Terms & Conditions" icon={FileText}>
              <div className="flex flex-col gap-2.5">{TC_SECTIONS.map((t) => <Accordion key={t.q} {...t} />)}</div>
            </CheckSection>
          </div>

          {/* RIGHT sticky */}
          <div className="lg:w-[32%]"><div className="lg:sticky lg:top-24">{RightSummary}</div></div>
        </div>
      </div>

      {/* mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 bg-white lg:hidden" style={{ borderTop: "1px solid var(--line)", boxShadow: "0 -6px 20px -12px rgba(15,39,51,.4)" }}>
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div><p className="text-[11px]" style={{ color: "var(--mute)" }}>Amount payable now</p><p className="br-display text-lg font-bold" style={{ color: "var(--brand)" }}>{inr(p.payNow)}</p></div>
          <button onClick={startPayment} disabled={!canPay || busy} className="br-btn br-display flex shrink-0 items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold" style={(!canPay || busy) ? { background: busy ? undefined : "#c3d5dd", boxShadow: busy ? undefined : "none" } : undefined}>{busy ? <><Loader2 size={15} className="animate-spin" /> {phase === "creating" ? "Processing…" : "Launching…"}</> : "Proceed to Payment"}</button>
        </div>
      </div>
      <div className="h-16 lg:hidden" />
    </>
  );
}
