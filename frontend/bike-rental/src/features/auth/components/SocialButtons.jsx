// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { OAUTH_PROVIDERS } from "../../../constants";

export function SocialButtons({ compact = false }) {
  // Real OAuth needs a backend to exchange the authorization code, so these stay
  // presentational — but hover, focus and active states are live.
  const shown = OAUTH_PROVIDERS.filter((p) => ["google", "microsoft", "apple"].includes(p.id));
  return (
    <div className="grid gap-2.5 sm:grid-cols-3">
      {shown.map((p) => (
        <button key={p.id} type="button" title={`Continue with ${p.label}`}
          className="br-social br-display flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold"
          style={{ border: `1.5px solid ${p.border}`, background: p.bg, color: "#334155", cursor: "pointer" }}>
          <span className="br-display text-base font-bold" style={{ color: p.fg }}>{p.glyph}</span>
          {compact ? p.label : `Continue with ${p.label}`}
        </button>
      ))}
    </div>
  );
}
