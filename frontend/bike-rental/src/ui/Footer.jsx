// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useState } from "react";
import { Bike, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { FeedbackModal } from "./FeedbackModal.jsx";

export function Footer({ onHome, onAdmin, onAbout, onPartner, onSearch, onDealerPortal }) {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const col = (title, items) => (
    <div>
      <p className="br-display mb-3 text-sm font-bold text-white">{title}</p>
      <ul className="flex flex-col gap-2 text-sm">
        {items.map(([label, fn]) => <li key={label}><button onClick={fn || (() => {})} className="text-left transition hover:text-white" style={{ color: "#94a3b8" }}>{label}</button></li>)}
      </ul>
    </div>
  );
  return (
    <footer style={{ background: "var(--footer)" }}>
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-2">
            <button onClick={onHome} className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl text-white" style={{ background: "linear-gradient(135deg,var(--brand),var(--brand-2))" }}><Bike size={20} strokeWidth={2.4} /></span>
              <span className="br-display text-lg font-bold text-white">Bike<span style={{ color: "var(--brand-2)" }}>Rental</span></span>
            </button>
            <p className="mt-3 max-w-xs text-sm leading-relaxed" style={{ color: "#94a3b8" }}>Rent verified bikes from trusted dealers across India. Safe, transparent, and ready in minutes.</p>
            <div className="mt-4 flex gap-2">
              {[Facebook, Twitter, Instagram, Linkedin].map((Ic, i) => <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-full transition hover:opacity-80" style={{ background: "rgba(255,255,255,.08)", color: "#cbd5e1" }}><Ic size={16} /></a>)}
            </div>
          </div>
          {col("Quick Links", [["Home", onHome], ["Search Bikes", onHome], ["Become a Partner", onPartner], ["Write Complaint / Feedback", () => setFeedbackOpen(true)]])}
          {col("Support", [
            ["About & Contact", () => onAbout("contact")],
            ["FAQs", () => onAbout("faq")],
            ["Privacy Policy", () => onAbout("privacy")],
            ["Terms & Conditions", () => onAbout("terms")],
            ["Refund Policy", () => onAbout("refund")],
          ])}
          <div>
            <p className="br-display mb-3 text-sm font-bold text-white">Contact</p>
            <ul className="flex flex-col gap-2 text-sm" style={{ color: "#94a3b8" }}>
              <li className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0" style={{ color: "var(--brand-2)" }} /> Koregaon Park, Pune 411001</li>
              <li className="flex items-center gap-2"><Phone size={15} style={{ color: "var(--brand-2)" }} /> +91 98765 43210</li>
              <li className="flex items-center gap-2"><Mail size={15} style={{ color: "var(--brand-2)" }} /> hello@bikerental.in</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-2 pt-6 sm:flex-row" style={{ borderTop: "1px solid rgba(255,255,255,.08)" }}>
          <p className="text-xs" style={{ color: "#64748b" }}>© 2026 BikeRental Technologies Pvt. Ltd. All rights reserved.</p>
          <p className="text-xs" style={{ color: "#64748b" }}>Made for riders, ride responsibly.</p>
        </div>
      </div>
      {feedbackOpen && <FeedbackModal onClose={() => setFeedbackOpen(false)} />}
    </footer>
  );
}
