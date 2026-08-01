// AUTO-EXTRACTED (verbatim) from BikeRentalSite_optimisedUI.jsx — do not edit logic.
import { DEALER_COMMISSION } from "../../../config";
import { RESUBMIT_FALLBACK } from "../../../constants";

export const dealerCut = (r) => Math.round((r.fare?.rentalNet || 0) * (1 - DEALER_COMMISSION));

export const resubmitItems = (listing) => (listing?.needs?.length ? listing.needs : RESUBMIT_FALLBACK);
