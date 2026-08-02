// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { useEffect, useState } from "react";

export function useNow(ms = 60000) {
  const [, tick] = useState(0);
  useEffect(() => { const id = setInterval(() => tick((n) => n + 1), ms); return () => clearInterval(id); }, [ms]);
  return Date.now();
}
