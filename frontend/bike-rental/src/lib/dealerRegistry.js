// Caches public partner profiles by partnerId. Same shape as bikeRegistry: the app
// asks for a dealer by id, gets a synchronous answer or null, and the fetch is fired
// once per partner rather than per component.
import partnerApi from "../api/index.js";

const cache = new Map();
const inflight = new Map();

// Partner Service field names -> the `dealer` shape ~8 components already read.
// Fields with no backend source get a neutral default, never a fabricated number.
const toDealer = (p) => ({
  id: p.partnerId,
  name: p.businessName || p.ownerName || `Partner #${p.partnerId}`,
  city: p.city || "",
  area: p.addressLine1 || p.area || "",
  tagline: p.description || "",
  phone: p.phoneNumber || "",
  email: p.email || "",
  address: [p.addressLine1, p.addressLine2, p.city, p.pincode].filter(Boolean).join(", "),
  sellerType: p.sellerType,

  // No review service exists yet — null so the UI can hide, not invent.
  rating: null,
  reviews: null,
  years: null,
  response: null,
  rentals: null,
  bikes: null,
});

export const getDealerSync = (id) => cache.get(id) || null;

export async function fetchDealer(id) {
  if (id == null) return null;
  if (cache.has(id)) return cache.get(id);
  if (inflight.has(id)) return inflight.get(id);

  const p = partnerApi
    .getPublicProfile(id)
    .then((r) => {
      const d = toDealer(r.data);
      cache.set(id, d);
      return d;
    })
    .catch(() => null)
    .finally(() => inflight.delete(id));

  inflight.set(id, p);
  return p;
}