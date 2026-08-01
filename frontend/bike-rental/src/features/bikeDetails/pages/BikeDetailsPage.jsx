// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useMemo, useState } from "react";
import { BadgeCheck, ChevronRight as Caret, Check, ChevronRight, Heart, Share2, Star, ThumbsUp, TrendingUp, X } from "lucide-react";
import { BADGE_COLOR, INCLUDED, TERMS } from "../../../constants";
import { durationHours, durationLabel, fmtDateTime } from "../../../lib/datetime.js";
import { inr } from "../../../lib/money.js";
import { BIKES, REVIEWS, getDealer } from "../../../mock";
import { Accordion, Carousel, Stars } from "../../../ui";
import { Gallery, MiniCard, SpecItem } from "../components";
import { buildRentalInfo, buildSpecs } from "../utils";

export function BikeDetailsPage({ bike, criteria, onBack, onDealer, onView, onBook, wished = false, onWish }) {
  const [reviewFilter, setReviewFilter] = useState("Most Recent");
  const dealer = getDealer(bike, criteria.city);
  const hours = durationHours(criteria.startDate, criteria.startTime, criteria.endDate, criteria.endTime) || 24;
  const days = Math.max(1, Math.ceil(hours / 24));
  const rental = bike.price * days;
  const platformFee = 49;
  const taxes = Math.round(rental * 0.18);
  const total = rental + platformFee + taxes;
  const discount = bike.orig > bike.price ? Math.round(((bike.orig - bike.price) / bike.orig) * 100) : 0;
  const specs = buildSpecs(bike), rentalInfo = buildRentalInfo(bike);
  const dist = [72, 21, 4, 2, 1];

  const similar = BIKES.filter((b) => b.id !== bike.id && b.cat === bike.cat).concat(BIKES.filter((b) => b.id !== bike.id && b.cat !== bike.cat)).slice(0, 7);
  const sameDealer = BIKES.filter((b) => b.dealer === bike.dealer && b.id !== bike.id);

  const sortedReviews = useMemo(() => {
    const r = [...REVIEWS];
    if (reviewFilter === "Highest Rated") r.sort((a, b) => b.rating - a.rating);
    if (reviewFilter === "Lowest Rated") r.sort((a, b) => a.rating - b.rating);
    return r;
  }, [reviewFilter]);

  return (
    <>
      {/* breadcrumb */}
      <div className="bg-white" style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="mx-auto flex max-w-[1200px] items-center gap-1.5 px-4 py-3 text-sm sm:px-6 lg:px-8" style={{ color: "var(--mute)" }}>
          <button className="br-crumb" onClick={onBack}>Home</button><Caret size={14} />
          <button className="br-crumb" onClick={onBack}>{criteria.city}</button><Caret size={14} />
          <button className="br-crumb" onClick={onBack}>{bike.cat} Bikes</button><Caret size={14} />
          <span className="font-semibold" style={{ color: "var(--ink)" }}>{bike.name}</span>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* LEFT 70% */}
          <div className="min-w-0 lg:w-[68%]">
            <Gallery bike={bike} />

            {/* header */}
            <div className="mt-6">
              <div className="flex flex-wrap items-center gap-2">
                {[bike.badge, "Verified Listing"].map((b) => <span key={b} className="rounded-full px-2.5 py-1 text-[11px] font-bold text-white" style={{ background: BADGE_COLOR[b] || "var(--brand)" }}>{b}</span>)}
              </div>
              <h1 className="br-display mt-2.5 text-2xl font-bold sm:text-3xl">{bike.name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm" style={{ color: "var(--mute)" }}>
                <span className="font-semibold" style={{ color: "#3a4d55" }}>{bike.mf}</span><span>·</span><span>{bike.cat}</span><span>·</span>
                <span className="flex items-center gap-1"><Star size={14} fill="#f5a623" strokeWidth={0} /><span className="font-semibold" style={{ color: "var(--ink)" }}>{bike.rating}</span> ({bike.reviews} reviews)</span>
                <span>·</span><span className="flex items-center gap-1"><TrendingUp size={14} /> 1,200+ rentals</span>
              </div>
              <div className="mt-4 flex items-end gap-3">
                <span className="br-display text-3xl font-bold">{inr(bike.price)}<span className="text-base font-medium" style={{ color: "var(--mute)" }}>/day</span></span>
                {discount > 0 && <><span className="mb-1 text-sm line-through" style={{ color: "var(--mute)" }}>{inr(bike.orig)}/day</span><span className="mb-1 rounded-md px-2 py-0.5 text-xs font-bold" style={{ background: "#e7f2f9", color: "var(--brand-strong)" }}>{discount}% OFF</span></>}
              </div>
              <p className="mt-1 text-sm" style={{ color: "var(--mute)" }}>Estimated total for {durationLabel(hours)}: <span className="br-display font-bold" style={{ color: "var(--ink)" }}>{inr(rental)}</span></p>
            </div>

            {/* specifications */}
            <section className="mt-8">
              <h2 className="br-display mb-3 text-lg font-bold">Specifications</h2>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">{specs.map((s) => <SpecItem key={s.label} {...s} />)}</div>
            </section>

            {/* rental information */}
            <section className="mt-8">
              <h2 className="br-display mb-3 text-lg font-bold">Rental Information</h2>
              <div className="br-card grid grid-cols-1 gap-x-6 gap-y-3 rounded-2xl p-5 shadow-sm sm:grid-cols-2">
                {rentalInfo.map((r) => <div key={r.label} className="flex items-center justify-between gap-3" style={{ borderBottom: "1px dashed var(--line)", paddingBottom: 8 }}><span className="flex items-center gap-2 text-sm" style={{ color: "#3a4d55" }}><r.icon size={15} style={{ color: "var(--brand)" }} />{r.label}</span><span className="text-sm font-semibold">{r.value}</span></div>)}
              </div>
            </section>

            {/* description */}
            <section className="mt-8">
              <h2 className="br-display mb-3 text-lg font-bold">About this {bike.mf}</h2>
              <div className="space-y-3 text-sm leading-relaxed" style={{ color: "#3a4d55" }}>
                <p>The {bike.name} strikes a rare balance between everyday usability and genuine excitement. Around town, the upright ergonomics and light clutch make stop-and-go traffic effortless, while the responsive throttle keeps you nimble through gaps and junctions.</p>
                <p>Out on the highway it settles into a confident cruise, with enough mid-range to overtake safely and a chassis that stays planted through fast sweepers. Fuel efficiency stays impressive for the segment, so longer rides mean fewer stops and lower running costs.</p>
                <p>It suits a wide range of riders — from confident commuters who want something with character to weekend explorers heading out of the city. Thoughtful touches like the {bike.cc >= 300 ? "Bluetooth-enabled display" : "digital console"}, USB charging and a phone mount round out a genuinely practical package.</p>
              </div>
            </section>

            {/* what's included */}
            <section className="mt-8">
              <h2 className="br-display mb-3 text-lg font-bold">What's Included</h2>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                {INCLUDED.map((it) => {
                  const on = it.key !== "helmet" || bike.helmet;
                  return <div key={it.label} className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: on ? "#e7f2f9" : "#f5f5f4", opacity: on ? 1 : 0.55 }}><span className="grid h-6 w-6 place-items-center rounded-full text-white" style={{ background: on ? "var(--brand)" : "#a3aead" }}>{on ? <Check size={13} strokeWidth={3} /> : <X size={13} strokeWidth={3} />}</span><span className="text-sm font-medium">{it.label}</span></div>;
                })}
              </div>
            </section>

            {/* terms accordions */}
            <section className="mt-8">
              <h2 className="br-display mb-3 text-lg font-bold">Rental Terms & Conditions</h2>
              <div className="flex flex-col gap-2.5">{TERMS.map((t) => <Accordion key={t.q} {...t} />)}</div>
            </section>
          </div>

          {/* RIGHT 30% sticky */}
          <div className="lg:w-[32%]">
            <div className="lg:sticky lg:top-24 flex flex-col gap-4">
              {/* booking card */}
              <div className="br-card rounded-2xl p-5 shadow-sm">
                <h3 className="br-display text-base font-bold">Your booking</h3>
                <div className="mt-3 flex flex-col gap-2.5 text-sm">
                  <div className="flex items-center justify-between"><span style={{ color: "var(--mute)" }}>Duration</span><span className="font-semibold">{durationLabel(hours)}</span></div>
                  <div className="flex items-center justify-between"><span style={{ color: "var(--mute)" }}>Pickup</span><span className="font-semibold">{fmtDateTime(criteria.startDate, criteria.startTime)}</span></div>
                  <div className="flex items-center justify-between"><span style={{ color: "var(--mute)" }}>Return</span><span className="font-semibold">{fmtDateTime(criteria.endDate, criteria.endTime)}</span></div>
                </div>
                <div className="my-3 h-px" style={{ background: "var(--line)" }} />
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center justify-between"><span style={{ color: "var(--mute)" }}>Rental ({inr(bike.price)} × {days})</span><span className="font-semibold">{inr(rental)}</span></div>
                  <div className="flex items-center justify-between"><span style={{ color: "var(--mute)" }}>Security deposit</span><span className="font-semibold" style={{ color: bike.deposit === 0 ? "var(--brand)" : "inherit" }}>{bike.deposit === 0 ? "Free" : `${inr(bike.deposit)} (refundable)`}</span></div>
                  <div className="flex items-center justify-between"><span style={{ color: "var(--mute)" }}>Platform fee</span><span className="font-semibold">{inr(platformFee)}</span></div>
                  <div className="flex items-center justify-between"><span style={{ color: "var(--mute)" }}>Taxes (18%)</span><span className="font-semibold">{inr(taxes)}</span></div>
                </div>
                <div className="my-3 h-px" style={{ background: "var(--line)" }} />
                <div className="flex items-center justify-between"><span className="br-display font-bold">Total payable</span><span className="br-display text-xl font-bold">{inr(total)}</span></div>
                <button onClick={onBook} className="br-btn br-display mt-4 w-full rounded-xl py-3 text-sm font-semibold">Book Now</button>
                <div className="mt-2.5 flex gap-2">
                  <button onClick={() => onWish?.(bike.id)} className="br-ghost br-display flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold"><Heart size={16} fill={wished ? "#dc2626" : "none"} color={wished ? "#dc2626" : "currentColor"} /> {wished ? "Saved" : "Wishlist"}</button>
                  <button className="br-ghost br-display flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold"><Share2 size={16} /> Share</button>
                </div>
              </div>

              {/* dealer summary */}
              <div className="br-card rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl br-display text-base font-bold text-white" style={{ background: "var(--teal)" }}>{dealer.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5"><h4 className="br-display truncate text-sm font-bold">{dealer.name}</h4><BadgeCheck size={16} style={{ color: "var(--brand)" }} /></div>
                    <div className="flex items-center gap-1 text-xs" style={{ color: "var(--mute)" }}><Star size={12} fill="#f5a623" strokeWidth={0} /><span className="font-semibold" style={{ color: "var(--ink)" }}>{dealer.rating}</span> · {dealer.area}, {dealer.city}</div>
                  </div>
                </div>
                <p className="mt-3 text-sm" style={{ color: "#3a4d55" }}>{dealer.tagline}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg px-3 py-2" style={{ background: "#f8faf9" }}><p style={{ color: "var(--mute)" }}>On platform</p><p className="br-display font-bold">{dealer.years} years</p></div>
                  <div className="rounded-lg px-3 py-2" style={{ background: "#f8faf9" }}><p style={{ color: "var(--mute)" }}>Responds in</p><p className="br-display font-bold">{dealer.response}</p></div>
                </div>
                <button onClick={() => onDealer(dealer, bike)} className="br-ghost br-display mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold">View Dealer Details <ChevronRight size={15} /></button>
              </div>
            </div>
          </div>
        </div>

        {/* carousels */}
        <Carousel title="Similar bikes from other dealers">{similar.map((b) => <MiniCard key={b.id} bike={b} city={criteria.city} variant="similar" onView={onView} />)}</Carousel>
        {sameDealer.length > 0 && <Carousel title={`More from ${dealer.name}`}>{sameDealer.map((b) => <MiniCard key={b.id} bike={b} city={criteria.city} variant="other-dealer" onView={onView} />)}</Carousel>}

        {/* reviews */}
        <section className="mt-10">
          <h2 className="br-display mb-4 text-lg font-bold">Customer Ratings & Reviews</h2>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="text-center sm:w-48 sm:shrink-0">
              <p className="br-display text-5xl font-bold">{bike.rating}</p>
              <div className="mt-1 flex justify-center"><Stars value={bike.rating} /></div>
              <p className="mt-1 text-sm" style={{ color: "var(--mute)" }}>{bike.reviews} reviews</p>
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
            {["Most Recent","Highest Rated","Lowest Rated","Verified Rentals","With Photos","With Comments"].map((c) => (
              <button key={c} onClick={() => setReviewFilter(c)} className={`br-filter-chip rounded-full px-3.5 py-1.5 text-xs font-semibold ${reviewFilter === c ? "br-filter-chip-active" : ""}`}>{c}</button>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-4">
            {sortedReviews.map((r) => (
              <div key={r.name} className="br-card rounded-2xl p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full br-display text-sm font-bold text-white" style={{ background: "var(--teal)" }}>{r.initials}</span>
                    <div>
                      <div className="flex items-center gap-1.5"><span className="br-display text-sm font-bold">{r.name}</span>{r.verified && <span className="flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: "#e7f2f9", color: "var(--brand-strong)" }}><BadgeCheck size={11} /> Verified Rental</span>}</div>
                      <p className="text-xs" style={{ color: "var(--mute)" }}>{r.date}</p>
                    </div>
                  </div>
                  <Stars value={r.rating} size={14} />
                </div>
                <h4 className="br-display mt-3 text-sm font-bold">{r.title}</h4>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: "#3a4d55" }}>{r.body}</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <div className="rounded-lg px-3 py-2 text-xs" style={{ background: "#e7f2f9" }}><span className="font-semibold" style={{ color: "var(--brand-strong)" }}>Pros:</span> <span style={{ color: "#3a4d55" }}>{r.pros}</span></div>
                  <div className="rounded-lg px-3 py-2 text-xs" style={{ background: "#fdf2f2" }}><span className="font-semibold" style={{ color: "#b91c1c" }}>Cons:</span> <span style={{ color: "#3a4d55" }}>{r.cons}</span></div>
                </div>
                <button className="br-crumb mt-3 flex items-center gap-1.5 text-xs font-semibold"><ThumbsUp size={13} /> Helpful ({r.helpful})</button>
                {r.response && <div className="mt-3 rounded-xl px-4 py-3" style={{ background: "#f8faf9", borderLeft: "3px solid var(--brand)" }}><p className="text-xs font-semibold" style={{ color: "var(--brand-strong)" }}>Response from {dealer.name}</p><p className="mt-1 text-sm" style={{ color: "#3a4d55" }}>{r.response}</p></div>}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* mobile sticky booking bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 bg-white lg:hidden" style={{ borderTop: "1px solid var(--line)", boxShadow: "0 -6px 20px -12px rgba(8,36,54,.4)" }}>
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0"><p className="br-display truncate text-sm font-bold">{bike.name}</p><p className="text-sm"><span className="br-display font-bold">{inr(bike.price)}</span><span className="text-xs" style={{ color: "var(--mute)" }}>/day</span></p></div>
          <button onClick={onBook} className="br-btn br-display shrink-0 rounded-xl px-6 py-3 text-sm font-semibold">Book Now</button>
        </div>
      </div>
      <div className="h-16 lg:hidden" />
    </>
  );
}
