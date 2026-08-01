// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useEffect, useRef, useState } from "react";
import { AlertCircle, Bike, CheckCircle2, Clock3, LifeBuoy, Mail, MapPin, MessageSquare, Navigation2, Phone, Send, Sparkles, Tag, User } from "lucide-react";
import { ABOUT_FAQS, CONTACT_CATEGORIES, MISSION, PLATFORM_STATS, POLICIES, SOCIALS, WHY_US } from "../../../constants";
import { RX } from "../../../lib/validation.js";
import { Accordion, Field, Label, SliderCaptcha } from "../../../ui";

export function AboutContactPage({ onHome, section }) {
  const refs = { contact: useRef(null), faq: useRef(null), policies: useRef(null) };
  useEffect(() => {
    if (!section) return;
    const target = ["privacy", "terms", "refund", "deposit", "cancellation"].includes(section) ? "policies" : section;
    const el = refs[target]?.current;
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }, [section]);
  const [v, setV] = useState({ name: "", email: "", phone: "", subject: "", category: "", message: "" });
  const [t, setT] = useState({});
  const [captcha, setCaptcha] = useState(false), [agree, setAgree] = useState(false);
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setV((p) => ({ ...p, [k]: e.target.value }));
  const blur = (k) => () => setT((p) => ({ ...p, [k]: true }));

  const errors = {};
  if (!v.name.trim()) errors.name = "Please enter your name.";
  if (!v.email) errors.email = "Email is required."; else if (!RX.email.test(v.email)) errors.email = "Enter a valid email.";
  if (v.phone && !RX.phone.test(v.phone.replace(/\D/g, ""))) errors.phone = "Enter a valid 10-digit number.";
  if (!v.subject.trim()) errors.subject = "Please add a subject.";
  if (!v.category) errors.category = "Choose a category.";
  if (!v.message.trim() || v.message.trim().length < 10) errors.message = "Message should be at least 10 characters.";
  const missing = Object.keys(errors).length + (captcha ? 0 : 1) + (agree ? 0 : 1);
  const valid = missing === 0;
  const err = (k) => t[k] && errors[k];
  const submit = () => { if (!valid) { setT(Object.fromEntries(Object.keys(v).map((k) => [k, true]))); return; } setSent(true); };

  return (
    <>
      {/* hero */}
      <div className="br-hero-bg">
        <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-center">
            <div className="flex-1 text-center text-white lg:text-left">
              <span className="br-display inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur"><Sparkles size={14} /> Since 2019 · 42 cities</span>
              <h1 className="br-serif mt-4 text-4xl font-bold sm:text-5xl">About BikeRental</h1>
              <p className="mt-3 text-lg text-white/90">Helping riders find trusted bikes from verified dealers across multiple cities.</p>
              <p className="mt-3 max-w-xl text-sm text-white/75">BikeRental connects everyday riders with a vetted network of local dealers, making it effortless to rent a well-maintained bike by the hour or the week. We're built on a simple commitment: rentals that are safe, affordable, and genuinely convenient — with transparent pricing and support you can count on.</p>
            </div>
            <div className="relative w-full max-w-sm shrink-0">
              <div className="grid place-items-center rounded-3xl bg-white/10 p-12 backdrop-blur" style={{ border: "1px solid rgba(255,255,255,.2)" }}>
                <Bike size={110} className="text-white/90" strokeWidth={1} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
        {/* mission */}
        <section>
          <h2 className="br-serif text-2xl font-bold">Our Mission</h2>
          <p className="mt-1 text-sm" style={{ color: "var(--mute)" }}>What we promise every rider, every ride.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {MISSION.map((m) => (
              <div key={m.title} className="br-card rounded-2xl p-5 shadow-sm">
                <span className="grid h-11 w-11 place-items-center rounded-xl text-white" style={{ background: "linear-gradient(135deg,var(--brand),var(--brand-2))" }}><m.icon size={20} /></span>
                <p className="br-display mt-3 text-sm font-bold">{m.title}</p>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--mute)" }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* why choose us */}
        <section className="mt-12">
          <h2 className="br-serif text-2xl font-bold">Why Choose Us</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {WHY_US.map((w) => (
              <div key={w.label} className="br-card flex items-center gap-3 rounded-2xl p-4 shadow-sm">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: "var(--form-bg)" }}><w.icon size={18} style={{ color: "var(--brand)" }} /></span>
                <span className="text-sm font-semibold" style={{ color: "#334155" }}>{w.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* stats */}
        <section className="mt-12 rounded-3xl p-6 sm:p-8" style={{ background: "var(--form-bg)" }}>
          <h2 className="br-serif text-2xl font-bold">BikeRental by the numbers</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {PLATFORM_STATS.map((s) => (
              <div key={s.label} className="br-card rounded-2xl p-4 text-center shadow-sm">
                <s.icon size={20} style={{ color: "var(--brand)" }} className="mx-auto" />
                <p className="br-display mt-1 text-xl font-bold" style={{ color: "var(--brand-strong)" }}>{s.value}</p>
                <p className="text-[11px]" style={{ color: "var(--mute)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* contact: info + form */}
        <section className="mt-12 scroll-mt-24" ref={refs.contact}>
          <h2 className="br-serif text-2xl font-bold">Get in Touch</h2>
          <p className="mt-1 text-sm" style={{ color: "var(--mute)" }}>Questions, feedback, or partnership ideas — we'd love to hear from you.</p>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {/* info */}
            <div className="flex flex-col gap-4">
              <div className="br-card rounded-2xl p-5 shadow-sm">
                <h3 className="br-display mb-3 text-sm font-bold">Contact Information</h3>
                <div className="flex flex-col gap-3 text-sm">
                  {[[Phone, "Customer Support", "+91 1800 123 456"], [Mail, "Email", "hello@bikerental.in"], [MapPin, "Office", "4th Floor, Tower B, Koregaon Park, Pune 411001"], [Clock3, "Business Hours", "Mon–Sun · 8:00 AM – 9:00 PM"], [LifeBuoy, "Emergency Helpline", "1800 999 911"]].map(([Ic, l, val]) => (
                    <div key={l} className="flex items-start gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg" style={{ background: "var(--form-bg)" }}><Ic size={16} style={{ color: "var(--brand)" }} /></span><div><p className="text-[11px]" style={{ color: "var(--mute)" }}>{l}</p><p className="font-semibold">{val}</p></div></div>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href="tel:+911800123456" className="br-btn br-display flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"><Phone size={15} /> Call Us</a>
                  <a href="mailto:hello@bikerental.in" className="br-ghost br-display flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"><Mail size={15} /> Email Us</a>
                  <a href="https://www.google.com/maps/search/?api=1&query=Koregaon+Park+Pune" target="_blank" rel="noreferrer" className="br-ghost br-display flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"><Navigation2 size={15} /> Get Directions</a>
                </div>
              </div>
              <div className="relative h-56 overflow-hidden rounded-2xl" style={{ background: "linear-gradient(135deg,#dbeafe,#cffafe)" }}>
                <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(15,143,181,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(15,143,181,.12) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
                <div className="absolute inset-0 grid place-items-center text-center"><div><MapPin size={34} style={{ color: "var(--brand)" }} className="mx-auto" /><p className="br-display mt-1 text-sm font-bold" style={{ color: "var(--brand-strong)" }}>Koregaon Park, Pune</p><p className="text-xs" style={{ color: "#5b7a86" }}>Google Maps preview</p></div></div>
              </div>
            </div>

            {/* form */}
            <div className="br-card rounded-2xl p-5 shadow-sm sm:p-6">
              {sent ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <span className="br-fade-up grid h-14 w-14 place-items-center rounded-full text-white" style={{ background: "linear-gradient(135deg,var(--brand),var(--brand-2))" }}><CheckCircle2 size={30} /></span>
                  <h3 className="br-serif mt-4 text-2xl font-bold">Message sent!</h3>
                  <p className="mt-1 text-sm" style={{ color: "var(--mute)" }}>Thanks {v.name.split(" ")[0] || "there"} — our team will get back to you within 24 hours.</p>
                  <button onClick={() => { setSent(false); setV({ name: "", email: "", phone: "", subject: "", category: "", message: "" }); setT({}); setCaptcha(false); setAgree(false); }} className="br-ghost br-display mt-5 rounded-xl px-5 py-2.5 text-sm font-semibold">Send another message</button>
                </div>
              ) : (
                <>
                  <h3 className="br-display text-base font-bold">Send us a message</h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Field icon={User} label="Full Name" required error={errors.name} show={err("name")}><input value={v.name} onChange={set("name")} onBlur={blur("name")} placeholder="Your name" className="br-input w-full text-sm" /></Field>
                    <Field icon={Mail} label="Email Address" required error={errors.email} show={err("email")}><input type="email" value={v.email} onChange={set("email")} onBlur={blur("email")} placeholder="you@email.com" className="br-input w-full text-sm" /></Field>
                    <Field icon={Phone} label="Phone Number" error={errors.phone} show={err("phone")}><input value={v.phone} onChange={set("phone")} onBlur={blur("phone")} placeholder="Optional" className="br-input w-full text-sm" /></Field>
                    <Field icon={Tag} label="Category" required error={errors.category} show={err("category")}><select value={v.category} onChange={set("category")} onBlur={blur("category")} className="br-input w-full bg-transparent text-sm"><option value="">Select…</option>{CONTACT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
                  </div>
                  <div className="mt-4"><Field icon={MessageSquare} label="Subject" required error={errors.subject} show={err("subject")}><input value={v.subject} onChange={set("subject")} onBlur={blur("subject")} placeholder="How can we help?" className="br-input w-full text-sm" /></Field></div>
                  <div className="mt-4">
                    <Label required>Message</Label>
                    <textarea value={v.message} onChange={set("message")} onBlur={blur("message")} rows={4} placeholder="Tell us more…" className="br-input br-field w-full rounded-xl px-3.5 py-3 text-sm" style={err("message") ? { borderColor: "#dc2626", boxShadow: "0 0 0 3px rgba(220,38,38,.1)" } : undefined} />
                    {err("message") && <p className="mt-1 flex items-center gap-1 text-xs font-medium" style={{ color: "#dc2626" }}><AlertCircle size={12} /> {errors.message}</p>}
                  </div>
                  <div className="mt-4 w-full max-w-xs rounded-xl px-4 py-3" style={{ border: "1px solid var(--line)", background: "#fafbfb" }}>
                    <SliderCaptcha onVerify={setCaptcha} />
                  </div>
                  <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-sm" style={{ color: "#3a4d55" }}><input type="checkbox" className="br-check mt-0.5" checked={agree} onChange={(e) => setAgree(e.target.checked)} /> I agree to the <a href="#" className="font-semibold" style={{ color: "var(--brand-strong)" }}>Privacy Policy</a>.</label>
                  <button onClick={submit} disabled={!valid} className="br-btn br-display mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold" style={!valid ? { background: "#c3d5dd", boxShadow: "none", cursor: "not-allowed" } : undefined}><Send size={16} /> Send Message</button>
                  {!valid && <p className="mt-2 text-center text-xs" style={{ color: "var(--mute)" }}>{missing} {missing === 1 ? "item needs" : "items need"} attention before sending.</p>}
                </>
              )}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-12 scroll-mt-24" ref={refs.faq}>
          <h2 className="br-serif text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="mt-5 flex flex-col gap-2.5">{ABOUT_FAQS.map((f) => <Accordion key={f.q} {...f} />)}</div>
        </section>

        {/* Policies — deep-linked from the footer */}
        <section className="mt-12 scroll-mt-24" ref={refs.policies}>
          <h2 className="br-serif text-2xl font-bold">Policies</h2>
          <p className="mt-1 text-sm" style={{ color: "var(--mute)" }}>The rules that govern bookings, refunds and your data.</p>
          <div className="mt-5 flex flex-col gap-2.5">
            {POLICIES.map((pol) => <Accordion key={pol.key} q={pol.q} a={pol.a} defaultOpen={section === pol.key} />)}
          </div>
        </section>

        {/* social */}
        <section className="mt-12 text-center">
          <h2 className="br-serif text-2xl font-bold">Follow Us</h2>
          <p className="mt-1 text-sm" style={{ color: "var(--mute)" }}>Stay in the loop on new cities, offers, and rider stories.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {SOCIALS.map((s) => (
              <a key={s.label} href="#" aria-label={s.label} className="br-ghost flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"><s.icon size={18} /> <span className="hidden sm:inline">{s.label}</span></a>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
