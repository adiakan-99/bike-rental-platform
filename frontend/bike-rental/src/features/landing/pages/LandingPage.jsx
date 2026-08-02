// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { SearchCard } from "../components";

export function LandingPage({ onSearch }) {
  const [city, setCity] = useState("");
  const pickCity = (c) => { setCity(c); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return (
    <>
      <section className="relative isolate overflow-hidden pt-16">
        <div className="br-hero-bg absolute inset-0 -z-20" />
        <img src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=80" alt="" aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-70" onError={(e) => { e.currentTarget.style.display = "none"; }} />
        <div className="br-hero-overlay absolute inset-0 -z-10" />
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center py-16 text-center sm:py-24">
            <span className="br-fade-up br-d1 br-display mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur"><ShieldCheck size={14} /> Verified bikes · Free helmet · No hidden fees</span>
            <h1 className="br-fade-up br-d1 br-serif max-w-3xl text-4xl font-bold leading-tight text-white sm:text-6xl">Rent Your Perfect Bike</h1>
            <p className="br-fade-up br-d2 mt-4 max-w-xl text-base text-white/85 sm:text-lg">Choose your city, select your rental duration, and hit the road in minutes.</p>
            <div className="mt-9 w-full max-w-4xl"><SearchCard onSearch={onSearch} city={city} onCity={setCity} /></div>
            <div className="br-fade-up br-d3 mt-7 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-medium text-white/70">Popular:</span>
              {["Bengaluru", "Mumbai", "Pune", "Goa"].map((c) => <button key={c} onClick={() => pickCity(c)} className={`rounded-full px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur transition ${city === c ? "bg-white/30 ring-1 ring-white/60" : "bg-white/10 hover:bg-white/20"}`}>{c}</button>)}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
