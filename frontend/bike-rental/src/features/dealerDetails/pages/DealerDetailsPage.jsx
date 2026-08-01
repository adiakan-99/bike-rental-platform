// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useMemo, useRef, useState } from "react";
import { Award, BadgeCheck, Bike, Building2, ChevronRight as Caret, Check, Clock3, Copy, Info, MapPin, Navigation2, Percent, Phone, Sparkles, Star, ThumbsUp, TrendingUp } from "lucide-react";
import { DEALER_AMENITIES, DEALER_CERTS, DEALER_FAQS, DEALER_POLICIES, FLEET_DIST } from "../../../constants";
import { BIKES, DEALERS, DEALER_REVIEWS } from "../../../mock";
import { Accordion, BikeCard, Carousel, CheckSection, Row, Stars } from "../../../ui";
import { DealerStat } from "../components";

export function DealerDetailsPage({ dealer, fromBike, criteria, onBack, onView, onDealer, wishlist, onWish }) {
  const [copied, setCopied] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [reviewFilter, setReviewFilter] = useState("Most Recent");
  const fleetRef = useRef(null);
  const scrollFleet = () => fleetRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  // Only this partner's bikes — the page previously padded the list with other dealers' stock.
  const ownBikes = BIKES.filter((b) => b.dealer === dealer.id);
  const reviews = 428;
  const address = `Shop 14, ${dealer.area}, ${dealer.city} 411001`;
  const dist = [74, 19, 4, 2, 1];
  const similar = DEALERS.filter((d) => d.id !== dealer.id).map((d) => ({ ...d, city: ["Mumbai", "Bengaluru", "Delhi NCR"][d.id % 3] }));

  const sortedReviews = useMemo(() => {
    const r = [...DEALER_REVIEWS];
    if (reviewFilter === "Highest Rated") r.sort((a, b) => b.rating - a.rating);
    if (reviewFilter === "Lowest Rated") r.sort((a, b) => a.rating - b.rating);
    return r;
  }, [reviewFilter]);

  const copyAddr = () => { try { navigator.clipboard?.writeText(address); } catch {} setCopied(true); setTimeout(() => setCopied(false), 1800); };
  const PHONE = "+91 98765 43210";
  const copyPhone = () => { try { navigator.clipboard?.writeText(PHONE.replace(/\s/g, "")); } catch {} setCopiedPhone(true); setTimeout(() => setCopiedPhone(false), 1800); };
  const initials = dealer.name.split(" ").map((w) => w[0]).slice(0, 2).join("");

  const MapBox = (
    <div className="relative h-44 overflow-hidden rounded-xl" style={{ background: "linear-gradient(135deg,#dbeafe,#cffafe)" }}>
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(15,143,181,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(15,143,181,.12) 1px,transparent 1px)", backgroundSize: "26px 26px" }} />
      <div className="absolute inset-0 grid place-items-center text-center"><div><MapPin size={30} style={{ color: "var(--brand)" }} className="mx-auto" /><p className="br-display mt-1 text-sm font-bold" style={{ color: "var(--brand-strong)" }}>{dealer.area}, {dealer.city}</p><p className="text-xs" style={{ color: "#5b7a86" }}>Google Maps preview</p></div></div>
    </div>
  );

  return (
    <>
      {/* breadcrumb */}
      <div className="bg-white" style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="mx-auto flex max-w-[1200px] items-center gap-1.5 px-4 py-3 text-sm sm:px-6 lg:px-8" style={{ color: "var(--mute)" }}>
          <button className="br-crumb" onClick={() => onBack("home")}>Home</button><Caret size={14} />
          <button className="br-crumb" onClick={() => onBack("home")}>Dealers</button><Caret size={14} />
          <span className="font-semibold" style={{ color: "var(--ink)" }}>Dealer Details</span>
        </div>
      </div>

      {/* hero */}
      <div className="br-hero-bg">
        <div className="mx-auto max-w-[1200px] px-4 py-9 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <span className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl br-display text-2xl font-bold text-white" style={{ background: "rgba(255,255,255,.14)", backdropFilter: "blur(4px)" }}>{initials}</span>
            <div className="flex-1 text-white">
              <div className="flex flex-wrap items-center gap-2"><h1 className="br-serif text-3xl font-bold sm:text-4xl">{dealer.name}</h1><span className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold backdrop-blur"><BadgeCheck size={13} /> Verified Dealer</span></div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/90">
                <span className="flex items-center gap-1"><Stars value={dealer.rating} size={14} /> <span className="font-semibold text-white">{dealer.rating}</span> ({reviews} reviews)</span>
                <span className="flex items-center gap-1"><Award size={14} /> {dealer.years} years on platform</span>
                <span className="flex items-center gap-1"><TrendingUp size={14} /> {dealer.rentals} rentals</span>
                <span className="flex items-center gap-1"><Percent size={14} /> 98% response rate</span>
                <span className="flex items-center gap-1"><Clock3 size={14} /> Responds in {dealer.response}</span>
              </div>
              {/* quick stats */}
              <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {[["Fleet Size", dealer.bikes], ["Cities Served", 6], ["Repeat Customers", "72%"], ["Satisfaction", "96%"]].map(([l, v]) => (
                  <div key={l} className="rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur"><p className="br-display text-lg font-bold text-white">{v}</p><p className="text-[11px] text-white/75">{l}</p></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
        <section ref={fleetRef} className="mb-6 scroll-mt-24">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="br-display text-lg font-bold">Available Bikes from {dealer.name}</h2>
            <span className="text-sm" style={{ color: "var(--mute)" }}>{ownBikes.length} listed in {criteria?.city || dealer.city}</span>
          </div>
          {ownBikes.length === 0 ? (
            <div className="br-card grid place-items-center rounded-2xl py-14 text-center">
              <Bike size={30} style={{ color: "var(--mute)" }} />
              <p className="br-display mt-2 font-bold">No bikes listed right now</p>
              <p className="text-sm" style={{ color: "var(--mute)" }}>This dealer has no availability for the selected dates.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {ownBikes.map((b) => <BikeCard key={b.id} bike={b} view="grid" wished={wishlist?.has(b.id)} onWish={() => onWish?.(b.id)} onView={() => onView(b)} />)}
            </div>
          )}
        </section>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* LEFT */}
          <div className="flex min-w-0 flex-col gap-5 lg:w-[68%]">
            {/* dealer info */}
            <CheckSection title="Dealer Information" icon={Building2}>
              <div className="grid gap-x-6 sm:grid-cols-2">
                <Row label="Dealer Name" value={dealer.name} />
                <Row label="Business Type" value="Private Limited" />
                <Row label="Representative" value={dealer.name} />
                <Row label="Registered Since" value={String(2026 - dealer.years)} />
                <Row label="GST Number" value="27ABCDE••••1Z5" />
                <Row label="License Number" value="DL-RENT-••2291" />
              </div>
            </CheckSection>

            {/* address */}
            <CheckSection title="Address & Location" icon={MapPin}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm" style={{ color: "#3a4d55" }}><span className="font-semibold">Address: </span>{address}</p>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                    <div><p className="text-[11px]" style={{ color: "var(--mute)" }}>City</p><p className="font-semibold">{dealer.city}</p></div>
                    <div><p className="text-[11px]" style={{ color: "var(--mute)" }}>State</p><p className="font-semibold">Maharashtra</p></div>
                    <div><p className="text-[11px]" style={{ color: "var(--mute)" }}>Pincode</p><p className="font-semibold">411001</p></div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer" className="br-btn br-display flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"><Navigation2 size={15} /> Get Directions</a>
                    <button onClick={copyAddr} className="br-ghost br-display flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold">{copied ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy Address</>}</button>
                  </div>
                </div>
                {MapBox}
              </div>
            </CheckSection>

            {/* contact */}
            <CheckSection title="Contact Information" icon={Phone}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Row label="Phone" value={PHONE} />
                <Row label="Email" value={`${dealer.name.split(" ")[0].toLowerCase()}@bikerental.in`} />
                <Row label="Business Hours" value="8:00 AM – 9:00 PM" />
                <Row label="Emergency Contact" value="+91 1800 999 911" />
              </div>
              <div className="mt-3">
                <button onClick={copyPhone} className="br-btn br-display flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold">
                  {copiedPhone ? <><Check size={15} /> Copied</> : <><Copy size={15} /> Copy Mobile Number</>}
                </button>
              </div>
            </CheckSection>

            {/* about */}
            <CheckSection title={`About ${dealer.name}`} icon={Info}>
              <div className="space-y-3 text-sm leading-relaxed" style={{ color: "#3a4d55" }}>
                <p>{dealer.name} has been a trusted name in bike rentals across {dealer.city} for over {dealer.years} years. What began as a small neighbourhood garage has grown into a {dealer.bikes}-strong fleet serving thousands of riders every year, with a focus on reliability and transparent pricing.</p>
                <p>The team believes renting a bike should feel effortless and safe. Every vehicle undergoes a multi-point inspection between rentals, tyres and brakes are checked before each handover, and bikes are sanitized for every new rider. Doorstep delivery, flexible pickup windows, and helpful local route advice come as standard.</p>
                <p>Above all, {dealer.name} is committed to customer safety — insured rides, complete documentation, round-the-clock support, and a no-surprises deposit policy that keeps riders coming back.</p>
              </div>
            </CheckSection>

            {/* fleet overview */}
            <div>
              <CheckSection title="Fleet Overview" icon={Bike}>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  <DealerStat label="Total Bikes" value={dealer.bikes} icon={Bike} />
                  {FLEET_DIST.slice(0, 3).map((c) => <DealerStat key={c.label} label={c.label} value={Math.round((c.pct / 100) * dealer.bikes)} />)}
                </div>
                <div className="mt-4 flex flex-col gap-2.5">
                  {FLEET_DIST.map((c) => (
                    <div key={c.label} className="flex items-center gap-3 text-sm">
                      <span className="w-28 shrink-0" style={{ color: "#3a4d55" }}>{c.label}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: "#e2e8f0" }}><div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: "linear-gradient(90deg,var(--brand),var(--brand-2))" }} /></div>
                      <span className="w-8 text-right font-semibold">{Math.round((c.pct / 100) * dealer.bikes)}</span>
                    </div>
                  ))}
                </div>
              </CheckSection>
            </div>

            {/* amenities */}
            <CheckSection title="Amenities & Services" icon={Sparkles}>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                {DEALER_AMENITIES.map((a) => <div key={a.label} className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: "var(--form-bg)" }}><a.icon size={16} style={{ color: "var(--brand)" }} className="shrink-0" /><span className="text-xs font-medium" style={{ color: "#3a4d55" }}>{a.label}</span></div>)}
              </div>
            </CheckSection>

            {/* certifications */}
            <CheckSection title="Certifications & Trust Indicators" icon={BadgeCheck}>
              <div className="flex flex-wrap gap-2">
                {DEALER_CERTS.map((c) => <span key={c.label} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold" style={{ background: "var(--form-bg)", color: "var(--brand-strong)" }}><c.icon size={14} /> {c.label}</span>)}
              </div>
            </CheckSection>
          </div>

          {/* RIGHT sticky contact card */}
          <div className="lg:w-[32%]">
            {/* The dealer's name, rating and contact already appear in the hero and in the
                Contact Information section — the sidebar keeps only the jump-to-fleet action. */}
            <div className="lg:sticky lg:top-24">
              <button onClick={scrollFleet} className="br-btn br-display flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold"><Bike size={16} /> View Available Bikes ({ownBikes.length})</button>
            </div>
          </div>
        </div>

        {/* other bikes */}
        {/* reviews */}
        <section className="mt-10">
          <h2 className="br-display mb-4 text-lg font-bold">Customer Reviews</h2>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="text-center sm:w-48 sm:shrink-0">
              <p className="br-display text-5xl font-bold">{dealer.rating}</p>
              <div className="mt-1 flex justify-center"><Stars value={dealer.rating} /></div>
              <p className="mt-1 text-sm" style={{ color: "var(--mute)" }}>{reviews} reviews</p>
            </div>
            <div className="flex-1">
              {dist.map((pct, i) => (
                <div key={i} className="flex items-center gap-3 py-0.5 text-xs">
                  <span className="w-6" style={{ color: "var(--mute)" }}>{5 - i}★</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: "#eef2f0" }}><div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--brand)" }} /></div>
                  <span className="w-8 text-right" style={{ color: "var(--mute)" }}>{pct}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {["Most Recent", "Highest Rated", "Lowest Rated", "Verified Rentals", "With Photos"].map((c) => <button key={c} onClick={() => setReviewFilter(c)} className={`br-filter-chip rounded-full px-3.5 py-1.5 text-xs font-semibold ${reviewFilter === c ? "br-filter-chip-active" : ""}`}>{c}</button>)}
          </div>
          <div className="mt-5 flex flex-col gap-4">
            {sortedReviews.map((r) => (
              <div key={r.name} className="br-card rounded-2xl p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full br-display text-sm font-bold text-white" style={{ background: "var(--teal)" }}>{r.initials}</span>
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5"><span className="br-display text-sm font-bold">{r.name}</span>{r.verified && <span className="flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: "var(--form-bg)", color: "var(--brand-strong)" }}><BadgeCheck size={11} /> Verified Rental</span>}</div>
                      <p className="text-xs" style={{ color: "var(--mute)" }}>{r.date} · Rented {r.bike}</p>
                    </div>
                  </div>
                  <Stars value={r.rating} size={14} />
                </div>
                <h4 className="br-display mt-3 text-sm font-bold">{r.title}</h4>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: "#3a4d55" }}>{r.body}</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <div className="rounded-lg px-3 py-2 text-xs" style={{ background: "#eaf6ef" }}><span className="font-semibold" style={{ color: "#15803d" }}>Pros:</span> <span style={{ color: "#3a4d55" }}>{r.pros}</span></div>
                  <div className="rounded-lg px-3 py-2 text-xs" style={{ background: "#fdf2f2" }}><span className="font-semibold" style={{ color: "#b91c1c" }}>Cons:</span> <span style={{ color: "#3a4d55" }}>{r.cons}</span></div>
                </div>
                <button className="br-crumb mt-3 flex items-center gap-1.5 text-xs font-semibold"><ThumbsUp size={13} /> Helpful ({r.helpful})</button>
                {r.response && <div className="mt-3 rounded-xl px-4 py-3" style={{ background: "var(--form-bg)", borderLeft: "3px solid var(--brand)" }}><p className="text-xs font-semibold" style={{ color: "var(--brand-strong)" }}>Response from {dealer.name}</p><p className="mt-1 text-sm" style={{ color: "#3a4d55" }}>{r.response}</p></div>}
              </div>
            ))}
          </div>
        </section>

        {/* policies */}
        <section className="mt-8">
          <h2 className="br-display mb-3 text-lg font-bold">Dealer Policies</h2>
          <div className="flex flex-col gap-2.5">{DEALER_POLICIES.map((t) => <Accordion key={t.q} {...t} />)}</div>
        </section>

        {/* FAQ */}
        <section className="mt-8">
          <h2 className="br-display mb-3 text-lg font-bold">Frequently Asked Questions</h2>
          <div className="flex flex-col gap-2.5">{DEALER_FAQS.map((t) => <Accordion key={t.q} {...t} />)}</div>
        </section>

        {/* similar dealers */}
        <Carousel title="Similar Dealers">
          {similar.map((d) => (
            <div key={d.id} className="br-bikecard flex w-64 shrink-0 flex-col rounded-2xl p-5" style={{ scrollSnapAlign: "start" }}>
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl br-display text-sm font-bold text-white" style={{ background: "linear-gradient(135deg,var(--brand),var(--brand-2))" }}>{d.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>
                <div className="min-w-0"><p className="br-display truncate text-sm font-bold">{d.name}</p><p className="flex items-center gap-1 text-xs" style={{ color: "var(--mute)" }}><MapPin size={11} /> {d.city}</p></div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs" style={{ color: "#3a4d55" }}>
                <span className="flex items-center gap-1"><Star size={13} fill="#f5a623" strokeWidth={0} /> {d.rating}</span>
                <span className="flex items-center gap-1"><Bike size={13} style={{ color: "var(--brand)" }} /> {d.bikes} bikes</span>
              </div>
              <button onClick={() => onDealer(d)} className="br-ghost br-display mt-3 rounded-lg py-2 text-xs font-semibold">View Dealer</button>
            </div>
          ))}
        </Carousel>
      </div>

      {/* mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 bg-white lg:hidden" style={{ borderTop: "1px solid var(--line)", boxShadow: "0 -6px 20px -12px rgba(15,39,51,.4)" }}>
        <div className="grid grid-cols-2 gap-2.5 px-4 py-3">
          <button onClick={scrollFleet} className="br-btn br-display flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold"><Bike size={16} /> View Bikes ({ownBikes.length})</button>
          <button onClick={copyPhone} className="br-ghost br-display flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold">{copiedPhone ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy Number</>}</button>
        </div>
      </div>
      <div className="h-16 lg:hidden" />
    </>
  );
}
