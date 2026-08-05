// REWRITTEN for bike-service.
//
// WHAT CHANGED AND WHY
//
// 1. FETCHES ON MOUNT. The `bike` prop arrives from a search card, which carries
//    only ~12 fields. Specs, images, includedItems and rentalTerms exist only on
//    BikeDetailDto, so we fetch by id and merge. The card data renders instantly
//    as a placeholder while that request is in flight.
//
// 2. AVAILABILITY IS NOW REAL. Browse has no date filter, so this is the first
//    screen that can honestly answer "can I have it on these dates?".
//    GET /public/{id}/availability decides whether Book Now is enabled.
//
// 3. REVIEWS ARE GONE. There is no review service. The old page showed three
//    hardcoded reviews and a fixed 72/21/4/2/1 star distribution on EVERY bike —
//    fabricated social proof on a rental listing is a real problem, not a cosmetic
//    one. Restore this section when a review endpoint exists.
//
// 4. THE DEALER CARD IS GONE FOR NOW. It needs partner-service
//    (GET /api/v1/partners/public/{id}); we only have partnerId here. Wire it in
//    when you integrate that service — the `onDealer` prop is left in place.
//
// 5. "SIMILAR BIKES" IS A REAL QUERY. It used to filter the mock BIKES array.
//    It now calls browse filtered by this bike's category.
import { useEffect, useMemo, useState } from "react";
import { ChevronRight as Caret, Check, Heart, Share2, X } from "lucide-react";
import { BADGE_COLOR, INCLUDED } from "../../../constants";
import {
  durationHours,
  durationLabel,
  fmtDateTime,
} from "../../../lib/datetime.js";
import { inr } from "../../../lib/money.js";
import {
  browseBikes,
  checkAvailability,
  getBikeDetail,
} from "../../../api/bikes.js";
import { cardDtoToBike, detailDtoToBike } from "../../../lib/adapters/bike.js";
import { registerBikes } from "../../../lib/bikeRegistry.js";
import { Accordion, Carousel } from "../../../ui";
import { Gallery, MiniCard, SpecItem } from "../components";
import { buildRentalInfo, buildSpecs } from "../utils";

// The API wants ISO date-times; criteria stores date and time separately.
const toIso = (date, time) => {
  if (!date) return null;
  const d = new Date(`${date}T${time || "00:00"}`);
  return isNaN(d) ? null : d.toISOString();
};

export function BikeDetailsPage({
  bike,
  criteria,
  onBack,
  onDealer,
  onView,
  onBook,
  wished = false,
  onWish,
}) {
  // Start from the card data so the page paints immediately, then merge the
  // full detail on top when it lands.
  const [full, setFull] = useState(bike);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availability, setAvailability] = useState({
    state: "idle",
    available: null,
  });
  const [similar, setSimilar] = useState([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getBikeDetail(bike.id)
      .then((dto) => {
        if (cancelled) return;
        const mapped = detailDtoToBike(dto);
        registerBikes(mapped);
        // Card fields the detail DTO doesn't repeat (badge, instant) survive the merge.
        setFull((prev) => ({ ...prev, ...mapped }));
      })
      .catch(
        (e) =>
          !cancelled && setError(e.userMessage || "Could not load this bike."),
      )
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [bike.id]);

  // Availability for the dates the user actually picked.
  useEffect(() => {
    const start = toIso(criteria.startDate, criteria.startTime);
    const end = toIso(criteria.endDate, criteria.endTime);
    if (!start || !end) return;

    let cancelled = false;
    setAvailability({ state: "loading", available: null });

    checkAvailability(bike.id, start, end)
      .then(
        (r) =>
          !cancelled &&
          setAvailability({ state: "done", available: !!r.available }),
      )
      // A failed check must not block booking — fall back to "unknown" and let
      // the backend reject at booking time if it really is taken.
      .catch(
        () =>
          !cancelled && setAvailability({ state: "error", available: null }),
      );

    return () => {
      cancelled = true;
    };
  }, [
    bike.id,
    criteria.startDate,
    criteria.startTime,
    criteria.endDate,
    criteria.endTime,
  ]);

  // Same category, excluding this bike.
  useEffect(() => {
    if (!full.cat) return;
    let cancelled = false;

    browseBikes({ city: criteria.city, category: full.cat, page: 0, size: 8 })
      .then((res) => {
        if (cancelled) return;
        const mapped = (res.content || [])
          .map(cardDtoToBike)
          .filter((b) => b.id !== bike.id);
        registerBikes(mapped);
        setSimilar(mapped.slice(0, 7));
      })
      .catch(() => !cancelled && setSimilar([]));

    return () => {
      cancelled = true;
    };
  }, [full.cat, criteria.city, bike.id]);

  const hours =
    durationHours(
      criteria.startDate,
      criteria.startTime,
      criteria.endDate,
      criteria.endTime,
    ) || 24;
  const days = Math.max(1, Math.ceil(hours / 24));
  const rental = full.price * days;
  const platformFee = 49;
  const taxes = Math.round(rental * 0.18);
  const total = rental + platformFee + taxes;

  const specs = useMemo(() => buildSpecs(full), [full]);
  const rentalInfo = useMemo(() => buildRentalInfo(full), [full]);

  // The backend sends includedItems as free text. Match it against our icon list
  // where we can, and show anything unmatched as an extra row.
  const included = useMemo(() => {
    const items = full.included || [];
    if (!items.length) return null;
    const lower = items.map((i) => i.toLowerCase());
    const known = INCLUDED.map((it) => ({
      ...it,
      on: lower.some((l) => l.includes(it.label.toLowerCase())),
    }));
    const extra = items
      .filter(
        (i) =>
          !INCLUDED.some((it) =>
            i.toLowerCase().includes(it.label.toLowerCase()),
          ),
      )
      .map((label) => ({ label, on: true }));
    return [...known, ...extra];
  }, [full.included]);

  const terms = (full.terms || []).map((t) =>
    typeof t === "string" ? { q: t, a: "" } : t,
  );

  const unavailable =
    availability.state === "done" && availability.available === false;

  return (
    <>
      <div
        className="bg-white"
        style={{ borderBottom: "1px solid var(--line)" }}
      >
        <div
          className="mx-auto flex max-w-[1200px] items-center gap-1.5 px-4 py-3 text-sm sm:px-6 lg:px-8"
          style={{ color: "var(--mute)" }}
        >
          <button className="br-crumb" onClick={onBack}>
            Home
          </button>
          <Caret size={14} />
          <button className="br-crumb" onClick={onBack}>
            {criteria.city}
          </button>
          <Caret size={14} />
          <button className="br-crumb" onClick={onBack}>
            {full.cat} Bikes
          </button>
          <Caret size={14} />
          <span className="font-semibold" style={{ color: "var(--ink)" }}>
            {full.name}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <div
            className="br-card mb-4 rounded-2xl px-4 py-3 text-sm"
            style={{ color: "#b91c1c" }}
          >
            {error} — showing the summary we already had.
          </div>
        )}

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="min-w-0 lg:w-[68%]">
            <Gallery bike={full} />

            <div className="mt-6">
              {full.badge && (
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-full px-2.5 py-1 text-[11px] font-bold text-white"
                    style={{
                      background: BADGE_COLOR[full.badge] || "var(--brand)",
                    }}
                  >
                    {full.badge}
                  </span>
                </div>
              )}
              <h1 className="br-display mt-2.5 text-2xl font-bold sm:text-3xl">
                {full.name}
              </h1>
              <div
                className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm"
                style={{ color: "var(--mute)" }}
              >
                <span className="font-semibold" style={{ color: "#3a4d55" }}>
                  {full.mf}
                </span>
                <span>·</span>
                <span>{full.cat}</span>
                {full.year && (
                  <>
                    <span>·</span>
                    <span>{full.year}</span>
                  </>
                )}
              </div>
              <div className="mt-4 flex items-end gap-3">
                <span className="br-display text-3xl font-bold">
                  {inr(full.price)}
                  <span
                    className="text-base font-medium"
                    style={{ color: "var(--mute)" }}
                  >
                    /day
                  </span>
                </span>
              </div>
              <p className="mt-1 text-sm" style={{ color: "var(--mute)" }}>
                Estimated total for {durationLabel(hours)}:{" "}
                <span
                  className="br-display font-bold"
                  style={{ color: "var(--ink)" }}
                >
                  {inr(rental)}
                </span>
              </p>
            </div>

            <section className="mt-8">
              <h2 className="br-display mb-3 text-lg font-bold">
                Specifications
              </h2>
              {loading ? (
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-16 animate-pulse rounded-xl"
                      style={{ background: "var(--form-bg)" }}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {specs.map((s) => (
                    <SpecItem key={s.label} {...s} />
                  ))}
                </div>
              )}
            </section>

            {rentalInfo.length > 0 && (
              <section className="mt-8">
                <h2 className="br-display mb-3 text-lg font-bold">
                  Rental Information
                </h2>
                <div className="br-card grid grid-cols-1 gap-x-6 gap-y-3 rounded-2xl p-5 shadow-sm sm:grid-cols-2">
                  {rentalInfo.map((r) => (
                    <div
                      key={r.label}
                      className="flex items-center justify-between gap-3"
                      style={{
                        borderBottom: "1px dashed var(--line)",
                        paddingBottom: 8,
                      }}
                    >
                      <span
                        className="flex items-center gap-2 text-sm"
                        style={{ color: "#3a4d55" }}
                      >
                        <r.icon size={15} style={{ color: "var(--brand)" }} />
                        {r.label}
                      </span>
                      <span className="text-sm font-semibold">{r.value}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* The partner's own description, from additionalServices.description.
                No auto-generated marketing copy — the old version invented claims
                about handling and fuel efficiency for bikes it knew nothing about. */}
            {full.services?.description && (
              <section className="mt-8">
                <h2 className="br-display mb-3 text-lg font-bold">
                  About this {full.mf}
                </h2>
                <p
                  className="whitespace-pre-line text-sm leading-relaxed"
                  style={{ color: "#3a4d55" }}
                >
                  {full.services.description}
                </p>
              </section>
            )}

            {included && (
              <section className="mt-8">
                <h2 className="br-display mb-3 text-lg font-bold">
                  What's Included
                </h2>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                  {included.map((it) => (
                    <div
                      key={it.label}
                      className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                      style={{
                        background: it.on ? "#e7f2f9" : "#f5f5f4",
                        opacity: it.on ? 1 : 0.55,
                      }}
                    >
                      <span
                        className="grid h-6 w-6 place-items-center rounded-full text-white"
                        style={{
                          background: it.on ? "var(--brand)" : "#a3aead",
                        }}
                      >
                        {it.on ? (
                          <Check size={13} strokeWidth={3} />
                        ) : (
                          <X size={13} strokeWidth={3} />
                        )}
                      </span>
                      <span className="text-sm font-medium">{it.label}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {terms.length > 0 && (
              <section className="mt-8">
                <h2 className="br-display mb-3 text-lg font-bold">
                  Rental Terms & Conditions
                </h2>
                <div className="flex flex-col gap-2.5">
                  {terms.map((t) => (
                    <Accordion key={t.q} {...t} />
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="lg:w-[32%]">
            <div className="lg:sticky lg:top-24 flex flex-col gap-4">
              <div className="br-card rounded-2xl p-5 shadow-sm">
                <h3 className="br-display text-base font-bold">Your booking</h3>

                <div className="mt-3 flex flex-col gap-2.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span style={{ color: "var(--mute)" }}>Duration</span>
                    <span className="font-semibold">
                      {durationLabel(hours)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: "var(--mute)" }}>Pickup</span>
                    <span className="font-semibold">
                      {fmtDateTime(criteria.startDate, criteria.startTime)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: "var(--mute)" }}>Return</span>
                    <span className="font-semibold">
                      {fmtDateTime(criteria.endDate, criteria.endTime)}
                    </span>
                  </div>
                </div>

                {/* Real availability, checked against the chosen dates. */}
                {(availability.state === "loading" ||
                  availability.state === "done") && (
                  <div
                    className="mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold"
                    style={
                      availability.state === "loading"
                        ? { background: "var(--form-bg)", color: "var(--mute)" }
                        : availability.available
                          ? {
                              background: "#e7f2f9",
                              color: "var(--brand-strong)",
                            }
                          : { background: "#fdf2f2", color: "#b91c1c" }
                    }
                  >
                    {availability.state === "loading" ? (
                      "Checking availability…"
                    ) : availability.available ? (
                      <>
                        <Check size={13} /> Available for these dates
                      </>
                    ) : (
                      "Not available for these dates"
                    )}
                  </div>
                )}

                <div
                  className="my-3 h-px"
                  style={{ background: "var(--line)" }}
                />
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span style={{ color: "var(--mute)" }}>
                      Rental ({inr(full.price)} × {days})
                    </span>
                    <span className="font-semibold">{inr(rental)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: "var(--mute)" }}>
                      Security deposit
                    </span>
                    <span
                      className="font-semibold"
                      style={{
                        color: full.deposit === 0 ? "var(--brand)" : "inherit",
                      }}
                    >
                      {full.deposit === 0
                        ? "Free"
                        : `${inr(full.deposit)} (refundable)`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: "var(--mute)" }}>Platform fee</span>
                    <span className="font-semibold">{inr(platformFee)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: "var(--mute)" }}>Taxes (18%)</span>
                    <span className="font-semibold">{inr(taxes)}</span>
                  </div>
                </div>
                <div
                  className="my-3 h-px"
                  style={{ background: "var(--line)" }}
                />
                <div className="flex items-center justify-between">
                  <span className="br-display font-bold">Total payable</span>
                  <span className="br-display text-xl font-bold">
                    {inr(total)}
                  </span>
                </div>

                <button
                  onClick={onBook}
                  disabled={unavailable}
                  className="br-btn br-display mt-4 w-full rounded-xl py-3 text-sm font-semibold"
                  style={
                    unavailable
                      ? { opacity: 0.5, cursor: "not-allowed" }
                      : undefined
                  }
                >
                  {unavailable ? "Unavailable for these dates" : "Book Now"}
                </button>

                <div className="mt-2.5 flex gap-2">
                  <button
                    onClick={() => onWish?.(full.id)}
                    className="br-ghost br-display flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold"
                  >
                    <Heart
                      size={16}
                      fill={wished ? "#dc2626" : "none"}
                      color={wished ? "#dc2626" : "currentColor"}
                    />{" "}
                    {wished ? "Saved" : "Wishlist"}
                  </button>
                  <button className="br-ghost br-display flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold">
                    <Share2 size={16} /> Share
                  </button>
                </div>
              </div>

              {/* The dealer card lived here. It needs partner-service
                  (GET /api/v1/partners/public/{full.dealer}) — add it back when
                  that service is wired, using onDealer for navigation. */}
            </div>
          </div>
        </div>

        {similar.length > 0 && (
          <Carousel title={`More ${full.cat} bikes in ${criteria.city}`}>
            {similar.map((b) => (
              <MiniCard
                key={b.id}
                bike={b}
                city={criteria.city}
                variant="similar"
                onView={onView}
              />
            ))}
          </Carousel>
        )}
      </div>

      <div
        className="fixed inset-x-0 bottom-0 z-40 bg-white lg:hidden"
        style={{
          borderTop: "1px solid var(--line)",
          boxShadow: "0 -6px 20px -12px rgba(8,36,54,.4)",
        }}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="br-display truncate text-sm font-bold">{full.name}</p>
            <p className="text-sm">
              <span className="br-display font-bold">{inr(full.price)}</span>
              <span className="text-xs" style={{ color: "var(--mute)" }}>
                /day
              </span>
            </p>
          </div>
          <button
            onClick={onBook}
            disabled={unavailable}
            className="br-btn br-display shrink-0 rounded-xl px-6 py-3 text-sm font-semibold"
            style={
              unavailable ? { opacity: 0.5, cursor: "not-allowed" } : undefined
            }
          >
            {unavailable ? "Unavailable" : "Book Now"}
          </button>
        </div>
      </div>
      <div className="h-16 lg:hidden" />
    </>
  );
}
