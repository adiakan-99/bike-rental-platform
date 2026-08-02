// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useRef, useState } from "react";
import { AlertTriangle, Bike, CalendarDays, ChevronRight as Caret, Check, CheckCircle2, Clock, Eye, ImagePlus, Info, MessageSquare, Sparkles, Star, ThumbsUp, Upload, User, X } from "lucide-react";
import { BIKE_CATS, CONS_PRESETS, DEALER_CATS, GUIDELINES, PROS_PRESETS, RECOMMEND } from "../../../constants";
import { durationHours, durationLabel, fmtDateTime } from "../../../lib/datetime.js";
import { getDealer } from "../../../mock";
import { BikeImage, CheckSection, Stars } from "../../../ui";
import { CatRating, StarInput, TagPicker } from "../components";

export function WriteReviewPage({ bike, criteria, booking, onCancel, onViewDetails, onExplore, onHome }) {
  const dealer = getDealer(bike, criteria.city);
  const hours = durationHours(criteria.startDate, criteria.startTime, criteria.endDate, criteria.endTime) || 24;
  const [bikeRating, setBikeRating] = useState(0);
  const [dealerRating, setDealerRating] = useState(0);
  const [bikeCats, setBikeCats] = useState({});
  const [dealerCats, setDealerCats] = useState({});
  const [text, setText] = useState("");
  const [pros, setPros] = useState([]);
  const [cons, setCons] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [drag, setDrag] = useState(false);
  const [recommend, setRecommend] = useState("");
  const [anon, setAnon] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef(null);

  const addFiles = (files) => {
    const room = 10 - photos.length;
    const arr = Array.from(files).slice(0, room).map((f) => ({ url: URL.createObjectURL(f), name: f.name }));
    setPhotos((p) => [...p, ...arr].slice(0, 10));
  };
  const canSubmit = bikeRating > 0 && dealerRating > 0;
  const reviewer = anon ? "Anonymous Rider" : "Aarav Sharma";
  const initials = anon ? "AR" : "AS";

  if (submitted) return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <span className="br-fade-up grid h-16 w-16 place-items-center rounded-full text-white" style={{ background: "linear-gradient(135deg,var(--brand),var(--brand-2))" }}><CheckCircle2 size={36} /></span>
      <h1 className="br-serif br-fade-up br-d1 mt-5 text-3xl font-bold">Thank You!</h1>
      <p className="br-fade-up br-d2 mt-2 text-sm" style={{ color: "var(--mute)" }}>Your review has been successfully submitted.</p>
      <div className="br-card br-fade-up br-d2 mt-4 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm shadow-sm" style={{ color: "#3a4d55" }}>
        <Sparkles size={16} style={{ color: "var(--brand)" }} className="shrink-0" /> This review will contribute to both the bike's overall rating and the dealer's overall rating.
      </div>
      <div className="br-fade-up br-d3 mt-6 flex w-full flex-col gap-2.5 sm:flex-row">
        <button onClick={onViewDetails} className="br-btn br-display flex-1 rounded-xl py-3 text-sm font-semibold">View Rental Details</button>
        <button onClick={onExplore} className="br-ghost br-display flex-1 rounded-xl py-3 text-sm font-semibold">Explore Bikes</button>
        <button onClick={onHome} className="br-ghost br-display flex-1 rounded-xl py-3 text-sm font-semibold">Go to Home</button>
      </div>
    </div>
  );

  const Preview = (
    <div className="br-card rounded-2xl p-5 shadow-sm">
      <h3 className="br-display mb-3 flex items-center gap-2 text-sm font-bold"><Eye size={16} style={{ color: "var(--brand)" }} /> Live Preview</h3>
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full br-display text-sm font-bold text-white" style={{ background: anon ? "#94a3b8" : "var(--teal)" }}>{anon ? <User size={18} /> : initials}</span>
        <div><p className="br-display text-sm font-bold">{reviewer}</p><p className="text-xs" style={{ color: "var(--mute)" }}>Rented {bike.name}</p></div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg px-3 py-2" style={{ background: "var(--form-bg)" }}><p className="text-[11px]" style={{ color: "var(--mute)" }}>Bike</p><div className="flex items-center gap-1"><Stars value={bikeRating} size={13} /><span className="text-xs font-bold">{bikeRating || "—"}</span></div></div>
        <div className="rounded-lg px-3 py-2" style={{ background: "var(--form-bg)" }}><p className="text-[11px]" style={{ color: "var(--mute)" }}>Dealer</p><div className="flex items-center gap-1"><Stars value={dealerRating} size={13} /><span className="text-xs font-bold">{dealerRating || "—"}</span></div></div>
      </div>
      <p className="mt-3 text-sm" style={{ color: text ? "#3a4d55" : "#9aa7ac" }}>{text || "Your written review will appear here…"}</p>
      {photos.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{photos.slice(0, 5).map((p, i) => <img key={i} src={p.url} alt="" className="h-14 w-14 rounded-lg object-cover" />)}</div>}
      {(pros.length > 0 || cons.length > 0) && (
        <div className="mt-3 flex flex-col gap-1.5">
          {pros.length > 0 && <p className="text-xs"><span className="font-semibold" style={{ color: "#15803d" }}>Pros:</span> <span style={{ color: "#3a4d55" }}>{pros.join(", ")}</span></p>}
          {cons.length > 0 && <p className="text-xs"><span className="font-semibold" style={{ color: "#b91c1c" }}>Cons:</span> <span style={{ color: "#3a4d55" }}>{cons.join(", ")}</span></p>}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* breadcrumb */}
      <div className="bg-white" style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="mx-auto flex max-w-[1200px] items-center gap-1.5 overflow-x-auto px-4 py-3 text-sm sm:px-6 lg:px-8" style={{ color: "var(--mute)" }}>
          <button className="br-crumb whitespace-nowrap" onClick={onHome}>Home</button><Caret size={14} />
          <button className="br-crumb whitespace-nowrap" onClick={onCancel}>My Rentals</button><Caret size={14} />
          <button className="br-crumb whitespace-nowrap" onClick={onViewDetails}>Rental Details</button><Caret size={14} />
          <span className="whitespace-nowrap font-semibold" style={{ color: "var(--ink)" }}>Write Review</span>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
        {/* booking summary */}
        <div className="br-card flex flex-col gap-4 rounded-2xl p-4 shadow-sm sm:flex-row sm:items-center">
          <BikeImage bike={bike} className="h-20 w-28 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2"><h3 className="br-display text-base font-bold">{bike.name}</h3><span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold" style={{ background: "#dcfce7", color: "#15803d" }}>Completed Rental</span></div>
            <p className="text-xs" style={{ color: "var(--mute)" }}>{booking.regNo} · {dealer.name} · {booking.id}</p>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs" style={{ color: "#3a4d55" }}>
              <span className="flex items-center gap-1.5"><CalendarDays size={12} style={{ color: "var(--brand)" }} /> {fmtDateTime(criteria.startDate, "").trim()} → {fmtDateTime(criteria.endDate, "").trim()}</span>
              <span className="flex items-center gap-1.5"><Clock size={12} style={{ color: "var(--brand)" }} /> {durationLabel(hours)}</span>
            </div>
          </div>
        </div>

        {/* header */}
        <div className="mt-6 text-center sm:text-left">
          <h1 className="br-serif text-3xl font-bold">Share Your Experience</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--mute)" }}>Your feedback helps future riders make better decisions and helps dealers improve their service.</p>
        </div>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          {/* LEFT form */}
          <div className="flex min-w-0 flex-col gap-5 lg:w-[64%]">
            {/* overall ratings */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="br-card rounded-2xl p-5 shadow-sm" style={{ borderColor: bikeRating ? "var(--brand)" : "var(--line)" }}>
                <div className="flex items-center gap-2"><Bike size={18} style={{ color: "var(--brand)" }} /><h3 className="br-display text-sm font-bold">How would you rate the bike?</h3></div>
                <div className="mt-3"><StarInput value={bikeRating} onChange={setBikeRating} /></div>
                <p className="mt-2 text-xs" style={{ color: "var(--mute)" }}>Rate the bike on its condition, comfort, cleanliness, maintenance, performance, and overall riding experience.</p>
              </div>
              <div className="br-card rounded-2xl p-5 shadow-sm" style={{ borderColor: dealerRating ? "var(--brand)" : "var(--line)" }}>
                <div className="flex items-center gap-2"><User size={18} style={{ color: "var(--brand)" }} /><h3 className="br-display text-sm font-bold">How would you rate the dealer?</h3></div>
                <div className="mt-3"><StarInput value={dealerRating} onChange={setDealerRating} /></div>
                <p className="mt-2 text-xs" style={{ color: "var(--mute)" }}>Rate the dealer on communication, professionalism, pickup experience, support, documentation, and overall service.</p>
              </div>
            </div>

            {/* category ratings */}
            <CheckSection title="Detailed Ratings" icon={Star}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide" style={{ color: "var(--brand-strong)" }}><Bike size={13} /> Bike</p>
                  <div className="flex flex-col gap-2">{BIKE_CATS.map((c) => <CatRating key={c} label={c} value={bikeCats[c] || 0} onChange={(v) => setBikeCats((p) => ({ ...p, [c]: v }))} />)}</div>
                </div>
                <div>
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide" style={{ color: "var(--brand-strong)" }}><User size={13} /> Dealer</p>
                  <div className="flex flex-col gap-2">{DEALER_CATS.map((c) => <CatRating key={c} label={c} value={dealerCats[c] || 0} onChange={(v) => setDealerCats((p) => ({ ...p, [c]: v }))} />)}</div>
                </div>
              </div>
            </CheckSection>

            {/* written review */}
            <CheckSection title="Written Review" icon={MessageSquare}>
              <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} placeholder="Tell future customers about your overall experience…" className="br-input br-field w-full rounded-xl px-3.5 py-3 text-sm" />
            </CheckSection>

            {/* pros / cons */}
            <CheckSection title="What went well?" icon={ThumbsUp}>
              <TagPicker presets={PROS_PRESETS} selected={pros} setSelected={setPros} tone="pro" />
            </CheckSection>
            <CheckSection title="What could be better?" icon={AlertTriangle}>
              <TagPicker presets={CONS_PRESETS} selected={cons} setSelected={setCons} tone="con" />
            </CheckSection>

            {/* photos */}
            <CheckSection title="Upload Photos" icon={ImagePlus} right={<span className="text-xs" style={{ color: "var(--mute)" }}>{photos.length}/10</span>}>
              <div onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }} onClick={() => fileRef.current?.click()} className="grid cursor-pointer place-items-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition" style={{ borderColor: drag ? "var(--brand)" : "#cbd8e2", background: drag ? "var(--form-bg)" : "#fff" }}>
                <Upload size={26} style={{ color: "var(--brand)" }} />
                <p className="mt-2 text-sm font-semibold">Drag & drop photos here, or click to browse</p>
                <p className="text-xs" style={{ color: "var(--mute)" }}>Up to 10 images · JPG or PNG</p>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
              </div>
              {photos.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {photos.map((p, i) => (
                    <div key={i} className="relative overflow-hidden rounded-xl" style={{ aspectRatio: "1/1" }}>
                      <img src={p.url} alt="" className="h-full w-full object-cover" />
                      <button onClick={() => setPhotos(photos.filter((_, j) => j !== i))} className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/55 text-white"><X size={13} /></button>
                    </div>
                  ))}
                </div>
              )}
            </CheckSection>

            {/* recommend */}
            <CheckSection title="Would you rent from this dealer again?" icon={ThumbsUp}>
              <div className="flex flex-wrap gap-2">
                {RECOMMEND.map((o) => {
                  const on = recommend === o;
                  return <button key={o} type="button" onClick={() => setRecommend(o)} className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition" style={on ? { border: "1.5px solid var(--brand)", background: "var(--form-bg)", color: "var(--brand)" } : { border: "1px solid var(--line)", color: "#334155" }}><span className="grid h-4 w-4 place-items-center rounded-full" style={{ border: on ? "4px solid var(--brand)" : "1.5px solid #cbd5e1" }} />{o}</button>;
                })}
              </div>
            </CheckSection>

            {/* anonymous + guidelines */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="br-card rounded-2xl p-5 shadow-sm">
                <label className="flex cursor-pointer items-start gap-2.5 text-sm" style={{ color: "#3a4d55" }}><input type="checkbox" className="br-check mt-0.5" checked={anon} onChange={(e) => setAnon(e.target.checked)} /> <span><span className="font-semibold">Submit review anonymously</span><br />Your name will be hidden and shown as an anonymous rider.</span></label>
              </div>
              <div className="br-card rounded-2xl p-5 shadow-sm">
                <p className="br-display mb-2 flex items-center gap-1.5 text-sm font-bold"><Info size={15} style={{ color: "var(--brand)" }} /> Community Guidelines</p>
                <ul className="flex flex-col gap-1 text-xs" style={{ color: "#3a4d55" }}>{GUIDELINES.map((g) => <li key={g} className="flex items-start gap-1.5"><Check size={12} style={{ color: "var(--brand)" }} className="mt-0.5 shrink-0" /> {g}</li>)}</ul>
              </div>
            </div>
          </div>

          {/* RIGHT sticky preview + submit */}
          <div className="lg:w-[36%]">
            <div className="lg:sticky lg:top-24 flex flex-col gap-4">
              {Preview}
              <div className="br-card rounded-2xl p-4 shadow-sm">
                <button onClick={() => canSubmit && setSubmitted(true)} disabled={!canSubmit} className="br-btn br-display w-full rounded-xl py-3 text-sm font-semibold" style={!canSubmit ? { background: "#c3d5dd", boxShadow: "none", cursor: "not-allowed" } : undefined}>Submit Review</button>
                {!canSubmit && <p className="mt-2 text-center text-xs" style={{ color: "var(--mute)" }}>Rate both the bike and the dealer to submit.</p>}
                <button onClick={onCancel} className="br-ghost br-display mt-2.5 w-full rounded-xl py-2.5 text-sm font-semibold">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
