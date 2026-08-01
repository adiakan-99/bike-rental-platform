// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useMemo, useState } from "react";
import { Heart, Search } from "lucide-react";
import { BikeCard, SuspendedBanner } from "../../../ui";

export function WishlistPage({ bikes, wishlist, onWish, onView, onExplore, suspended = false }) {
  const [cat, setCat] = useState("All");
  const cats = useMemo(() => ["All", ...new Set(bikes.map((b) => b.cat))], [bikes]);
  const shown = cat === "All" ? bikes : bikes.filter((b) => b.cat === cat);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      {suspended && <SuspendedBanner />}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="br-serif text-3xl font-bold">My Wishlist</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--mute)" }}>
            {bikes.length === 0 ? "Bikes you save while browsing show up here." : `${bikes.length} bike${bikes.length > 1 ? "s" : ""} saved.`}
          </p>
        </div>
        {bikes.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {cats.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`br-filter-chip br-display rounded-lg px-3 py-1.5 text-xs font-semibold ${cat === c ? "br-filter-chip-active" : ""}`}>{c}</button>
            ))}
          </div>
        )}
      </div>

      {bikes.length === 0 ? (
        <div className="br-card mt-6 grid place-items-center rounded-2xl py-20 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full" style={{ background: "var(--form-bg)" }}><Heart size={38} style={{ color: "var(--brand)" }} /></span>
          <p className="br-display mt-4 text-lg font-bold">Nothing saved yet</p>
          <p className="mt-1 max-w-sm text-sm" style={{ color: "var(--mute)" }}>Tap the heart on any bike while browsing and it will be waiting for you here.</p>
          {!suspended && <button onClick={onExplore} className="br-btn br-display mt-5 rounded-xl px-6 py-3 text-sm font-semibold">Browse Bikes</button>}
        </div>
      ) : shown.length === 0 ? (
        <div className="br-card mt-6 grid place-items-center rounded-2xl py-16 text-center"><Search size={28} style={{ color: "var(--mute)" }} /><p className="br-display mt-2 font-bold">No saved bikes in {cat}</p></div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((b) => <BikeCard key={b.id} bike={b} view="grid" wished onWish={() => onWish(b.id)} onView={() => onView(b)} />)}
        </div>
      )}
    </div>
  );
}
