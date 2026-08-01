// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
export const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Poppins:wght@400;500;600;700&display=swap');
    :root{
      --ink:#0f2733; --brand:#0F8FB5; --brand-2:#16B5B2; --brand-strong:#0b7290; --teal:#16B5B2;
      --blue-deep:#0b3a4a; --teal-deep:#0d6e8c; --mute:#64748b; --line:#e4ecf2; --page:#F7F9FC;
      --form-bg:#EEF5FA; --footer:#0F172A;
    }
    .br-root{ font-family:'Poppins',system-ui,sans-serif; color:var(--ink); background:var(--page); }
    .br-display{ font-family:'Poppins',sans-serif; letter-spacing:-0.01em; }
    .br-serif{ font-family:'Playfair Display',Georgia,serif; letter-spacing:-0.01em; }
    .br-hero-bg{ background:
      radial-gradient(120% 90% at 18% 12%, rgba(22,181,178,.32), transparent 55%),
      linear-gradient(135deg, var(--blue-deep) 0%, var(--teal-deep) 60%, #072b3a 100%); }
    .br-hero-overlay{ background:rgba(0,0,0,0.45); }
    .br-btn{ background:linear-gradient(135deg, var(--brand) 0%, var(--brand-2) 100%); color:#fff; border-radius:14px; box-shadow:0 8px 18px -8px rgba(15,143,181,.5); transition:transform .18s ease, box-shadow .18s ease, filter .18s ease; }
    .br-btn:hover{ filter:brightness(1.05); transform:translateY(-1px); box-shadow:0 12px 26px -10px rgba(15,143,181,.6); }
    .br-btn:active{ transform:translateY(0); }
    .br-nav-link{ color:#334155; transition:color .16s ease; } .br-nav-link:hover{ color:var(--brand); }
    .br-ghost{ border:1.5px solid var(--brand); color:var(--brand); background:#fff; transition:all .18s ease; }
    .br-ghost:hover{ background:var(--brand); color:#fff; }
    .br-social{ transition:border-color .16s ease, box-shadow .16s ease, transform .16s ease, background .16s ease; }
    .br-social:hover{ border-color:var(--brand); box-shadow:0 8px 20px -12px rgba(15,143,181,.55); transform:translateY(-1px); background:var(--form-bg); }
    .br-social:active{ transform:translateY(0); }
    .br-social:focus-visible{ outline:2px solid var(--brand); outline-offset:2px; }
    .br-card{ background:#fff; border:1px solid var(--line); box-shadow:0 6px 22px -14px rgba(15,39,51,.18); }
    .br-field{ background:var(--form-bg); border:1px solid transparent; box-shadow:inset 0 1px 2px rgba(15,39,51,.05); transition:box-shadow .16s ease, border-color .16s ease; }
    /* Landing search card: fields lift off the card, card lifts off the hero, CTA pops */
    .br-search-card{ box-shadow:0 30px 60px -22px rgba(9,30,42,.55), 0 8px 22px -12px rgba(9,30,42,.35); }
    .br-field-solid{ background:#fff !important; border:1px solid #d3e0e8 !important; box-shadow:0 1px 2px rgba(15,39,51,.06); }
    .br-field-solid:focus-within{ border-color:var(--brand) !important; box-shadow:0 0 0 4px rgba(15,143,181,.16); }
    .br-cta{ background:linear-gradient(135deg,#0FB5D6 0%,#12C7B0 55%,#17D89A 100%); color:#fff; border-radius:16px; box-shadow:0 14px 30px -10px rgba(16,181,178,.6); transition:transform .18s ease, box-shadow .18s ease, filter .18s ease; }
    .br-cta:hover{ filter:brightness(1.06) saturate(1.05); transform:translateY(-1px); box-shadow:0 18px 38px -12px rgba(16,181,178,.7); }
    .br-field:focus-within{ border-color:var(--brand); box-shadow:0 0 0 4px rgba(15,143,181,.14); }
    .br-field-err{ border-color:#f0a5a5 !important; background:#fdf3f3; }
    .br-doc-card:hover{ border-color:var(--brand) !important; background:var(--form-bg) !important; }
    .br-profile-hdr:hover{ background:#e2ebef !important; }
    .br-input{ font-family:inherit; color:var(--ink); background:transparent; outline:none; }
    .br-input::placeholder{ color:#94a3b8; }
    .br-dt{ accent-color:var(--brand); color:var(--ink); background:transparent; outline:none; font-family:inherit; }
    .br-dt::-webkit-calendar-picker-indicator{ opacity:.55; cursor:pointer; }
    .br-option:hover{ background:var(--form-bg); }
    .br-chip{ background:var(--form-bg); color:#33556a; }
    .br-check{ accent-color:var(--brand); width:16px; height:16px; cursor:pointer; }
    .br-range{ accent-color:var(--brand); width:100%; cursor:pointer; }
    .br-bikecard{ background:#fff; border:1px solid var(--line); box-shadow:0 6px 22px -14px rgba(15,39,51,.18); transition:transform .2s ease, box-shadow .2s ease, border-color .2s ease; }
    .br-bikecard:hover{ transform:translateY(-3px); box-shadow:0 20px 42px -18px rgba(15,39,51,.32); border-color:#cfe0ea; }
    .br-collapse-h{ transition:color .16s ease; } .br-collapse-h:hover{ color:var(--brand); }
    .br-demo-row{ background:#fff; transition:background .14s ease; } .br-demo-row:hover{ background:var(--form-bg); }
    .br-crumb{ color:var(--mute); transition:color .16s ease; } .br-crumb:hover{ color:var(--brand); }
    .br-filter-chip{ border:1px solid var(--line); color:#33556a; background:#fff; transition:all .16s ease; }
    .br-filter-chip:hover{ border-color:var(--brand); color:var(--brand); }
    .br-filter-chip-active{ background:var(--form-bg); border-color:var(--brand); color:var(--brand); }
    .br-badge-count{ background:linear-gradient(135deg,#f97316,#ef4444); color:#fff; }
    .br-scroll{ scrollbar-width:thin; scrollbar-color:#cbd8e2 transparent; }
    .br-scroll::-webkit-scrollbar{ width:8px; height:8px; } .br-scroll::-webkit-scrollbar-thumb{ background:#cbd8e2; border-radius:8px; } .br-scroll::-webkit-scrollbar-thumb:hover{ background:#aebfca; }
    .br-zoom{ transition:transform .35s ease; } .br-zoomwrap:hover .br-zoom{ transform:scale(1.08); }
    @keyframes br-fade-up{ from{opacity:0; transform:translateY(10px);} to{opacity:1; transform:none;} }
    .br-fade-up{ animation:br-fade-up .5s ease both; } .br-d1{animation-delay:.05s;} .br-d2{animation-delay:.14s;} .br-d3{animation-delay:.24s;}
    @media (prefers-reduced-motion: reduce){ .br-fade-up{animation:none;} .br-btn:hover,.br-bikecard:hover{transform:none;} .br-zoom{transition:none;} }
  `}</style>
);
