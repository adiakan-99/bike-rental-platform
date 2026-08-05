// One function per bike-service endpoint. Nothing here knows about the UI —
// these return raw DTOs exactly as the backend sends them. Converting DTOs into
// the shape your components expect happens in src/lib/adapters/bike.js.
//
// Keeping those two jobs separate means when the backend renames a field, you
// change one line in the adapter and zero component files.
import { bikeHttp } from "./http.js";

const BASE = "/api/v1/bikes";

/* ============ PUBLIC (no login needed) ============ */

// GET /public/search/browse -> PageBikeCardDto
// Only these filters exist server-side. Anything else in FilterPanel has to be
// applied client-side or removed.
export const browseBikes = ({
  city,
  manufacturer,
  category,
  minPrice,
  maxPrice,
  page = 0,
  size = 12,
  sort,
} = {}) =>
  bikeHttp
    .get(`${BASE}/public/search/browse`, {
      params: { city, manufacturer, category, minPrice, maxPrice, page, size, sort },
    })
    .then((r) => r.data);

// GET /public/{id} -> BikeDetailDto
export const getBikeDetail = (id) =>
  bikeHttp.get(`${BASE}/public/${id}`).then((r) => r.data);

// GET /public/{id}/availability -> { bikeId, available }
// startDate / endDate must be ISO date-times: new Date(...).toISOString()
export const checkAvailability = (id, startDate, endDate) =>
  bikeHttp
    .get(`${BASE}/public/${id}/availability`, { params: { startDate, endDate } })
    .then((r) => r.data);

// GET /public/compare?ids=1&ids=2 -> BikeDetailDto[]
// `indexes: null` makes axios send ids=1&ids=2 instead of ids[]=1&ids[]=2,
// which is what Spring expects for a List<Integer> request param.
export const compareBikes = (ids) =>
  bikeHttp
    .get(`${BASE}/public/compare`, {
      params: { ids },
      paramsSerializer: { indexes: null },
    })
    .then((r) => r.data);

/* ============ PARTNER (needs a PARTNER-role JWT) ============ */

// GET /partner/mine -> FleetListingDto[]   (not paginated)
export const getMyFleet = () =>
  bikeHttp.get(`${BASE}/partner/mine`).then((r) => r.data);

// POST /partner -> FleetListingDto
export const createBikeListing = (dto) =>
  bikeHttp.post(`${BASE}/partner`, dto).then((r) => r.data);

// PUT /partner/{id} — full replace. Sends the listing back through approval.
export const updateBikeListing = (id, dto) =>
  bikeHttp.put(`${BASE}/partner/${id}`, dto).then((r) => r.data);

export const deleteBikeListing = (id) =>
  bikeHttp.delete(`${BASE}/partner/${id}`).then((r) => r.data);

// PATCH /partner/{id}/status — AVAILABLE | RENTED | MAINTENANCE | INACTIVE
export const updateBikeStatus = (id, bikeStatus) =>
  bikeHttp.put(`${BASE}/partner/${id}/status`, { bikeStatus }).then((r) => r.data);

// PATCH /partner/{id}/operational — price / deposit / services only.
// Use THIS for a price change, not the full PUT above, so the listing doesn't
// get knocked back into the approval queue for a ₹50 tweak.
export const updateOperationalDetails = (id, patch) =>
  bikeHttp.put(`${BASE}/partner/${id}/operational`, patch).then((r) => r.data);

/* ============ ADMIN (needs an ADMIN-role JWT) ============ */

// GET /admin/pending -> PagePendingBikeDto
export const getPendingBikes = ({ page = 0, size = 10, sort } = {}) =>
  bikeHttp
    .get(`${BASE}/admin/pending`, { params: { page, size, sort } })
    .then((r) => r.data);

// PUT /admin/review/{id} — approvalStatus is "APPROVED" or "REJECTED"
export const reviewBike = (id, approvalStatus, adminRemarks) =>
  bikeHttp
    .put(`${BASE}/admin/review/${id}`, { approvalStatus, adminRemarks })
    .then((r) => r.data);
