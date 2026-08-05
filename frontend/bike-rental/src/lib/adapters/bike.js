// Translation layer between backend DTOs and the bike shape your UI already uses.
//
// Your components were built against src/mock BIKES, which uses short keys:
//   { id, name, mf, cat, cc, fuel, trans, helmet, rating, reviews,
//     price, orig, deposit, stock, badge, instant, dealer }
//
// The backend uses different names for the same things. Rather than rename fields
// across ~15 components, we translate once, here. That is a normal and deliberate
// choice — the "anti-corruption layer" pattern.
//
// IMPORTANT: some UI fields have NO backend source at all. Those are marked
// MISSING below and set to null (not a fake number) so the UI can hide them
// instead of showing invented data.

/* ================= READ: DTO -> UI ================= */

// BikeCardDto  (from /public/search/browse)
export const cardDtoToBike = (d) => ({
  id: d.id,
  name: [d.manufacturer, d.model].filter(Boolean).join(" "),
  mf: d.manufacturer,
  model: d.model,
  cat: d.category,
  cc: d.engineCc ?? 0,
  fuel: d.fuelType,
  trans: d.transmission,
  price: d.hourlyRate,
  deposit: d.deposit ?? 0,
  badge: d.badge,
  instant: !!d.instant,
  dealer: d.dealerId,
  image: d.primaryImageUrl || null,

  // MISSING from the backend — UI must hide these, not fake them:
  orig: null,    // no list price, so no strike-through / discount %
  rating: null,  // no review service yet
  reviews: null,
  stock: null,   // availability is per-date, not a count
  helmet: null,  // no helmet flag on the card DTO
});

// BikeDetailDto  (from /public/{id} and /public/compare)
export const detailDtoToBike = (d) => ({
  id: d.bikeId,
  name: d.name || [d.manufacturer, d.model].filter(Boolean).join(" "),
  mf: d.manufacturer,
  model: d.model,
  cat: d.bikeCategory,
  bikeType: d.bikeType,
  cc: d.engineCc ?? 0,
  trans: d.transmission,
  seats: d.seatingCapacity,
  year: d.yearOfManufacture,
  color: d.color,
  price: d.hourlyRate,
  deposit: d.securityDeposit ?? 0,
  dealer: d.partnerId,

  images: (d.imageUrls || [])
    .slice()
    .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .map((i) => i.imageUrl),
  image: (d.imageUrls || []).find((i) => i.isPrimary)?.imageUrl
    || d.imageUrls?.[0]?.imageUrl
    || null,

  specs: d.additionalSpecs || {},
  services: d.additionalServices || {},
  included: d.includedItems || [],
  terms: d.rentalTerms || [],

  // Derived rather than returned: engineCc of 0 means electric.
  fuel: (d.engineCc ?? 0) > 0 ? "Petrol" : "Electric",
  // The backend has no helmet flag, but includedItems is a free-text list,
  // so we can at least read it off there.
  helmet: (d.includedItems || []).some((i) => /helmet/i.test(i)),

  // MISSING:
  orig: null,
  rating: null,
  reviews: null,
  stock: null,
});

// FleetListingDto -> the listing shape DealerPortal renders.
//
// Note the enum mismatch: your UI has ONE `status` string
// ("Live" / "Pending approval" / "Rejected" / "Draft"), the backend has TWO
// independent enums (approvalStatus + bikeStatus). Approval wins while the
// listing is pending or rejected; once approved, bikeStatus takes over.
// "Draft" has no backend equivalent — a bike either exists or it doesn't.
export const fleetStatusLabel = (d) => {
  if (d.approvalStatus === "PENDING") return "Pending approval";
  if (d.approvalStatus === "REJECTED") return "Rejected";
  if (d.bikeStatus === "AVAILABLE") return "Live";
  if (d.bikeStatus === "MAINTENANCE") return "Maintenance";
  if (d.bikeStatus === "RENTED") return "Rented";
  return "Inactive";
};

export const fleetDtoToListing = (d) => {
  const det = d.bikeDetails || {};
  const svc = d.additionalServices || {};
  return {
    id: d.bikeId,
    partnerId: d.partnerId,
    name: [d.manufacturer, d.model].filter(Boolean).join(" "),
    mf: d.manufacturer,
    model: d.model,
    cat: det.bikeCategory,
    bikeType: det.bikeType,
    cc: det.engineCc ?? 0,
    trans: det.transmission,
    seats: det.seatingCapacity,
    color: det.color || "",
    year: det.yearOfManufacture ? String(det.yearOfManufacture) : "",
    reg: d.registrationNumber,
    price: d.hourlyRate,
    deposit: d.securityDeposit ?? 0,

    status: fleetStatusLabel(d),
    bikeStatus: d.bikeStatus,
    approvalStatus: d.approvalStatus,
    note: d.rejectionReason,
    createdAt: d.createdAt,

    fuel: (det.engineCc ?? 0) > 0 ? "Petrol" : "Electric",

    // additionalServices is the JSONB catch-all where UI-only operational fields
    // live, because the schema has no columns for them.
    kmLimit: svc.kmLimit ?? 120,
    extraKm: svc.extraKm ?? 0,
    helmet: svc.helmet ?? false,
    desc: svc.description || "",

    specs: det.additionalSpecs || {},
    images: (d.images || []).map((i) => i.imageUrl),

    certs: {
      rc: { url: d.rcUploadUrl, expiry: d.registrationExpiry },
      puc: { url: d.pucUploadUrl, expiry: d.pucExpiry },
      insurance: { expiry: d.insurance?.expiryDate, ...(d.insurance || {}) },
    },
    insurance: d.insurance || null,
  };
};

// PendingBikeDto -> the row shape AdminApp's "Approve Bikes" tab renders.
// This DTO gives you partnerId but NOT the partner's name, so `owner`/`type`
// need a partner-service lookup. Pass one in when you have it; until then the
// table shows "Partner #12".


export const adminBikeDtoToRow = (d) => ({
  id: d.bikeId,
  partnerId: d.partnerId,
  name: [d.manufacturer, d.model].filter(Boolean).join(" "),
  mf: d.manufacturer,
  cat: d.category,
  cc: d.engineCc ?? 0,
  trans: d.transmission,
  price: Number(d.hourlyRate) || 0,
  deposit: Number(d.securityDeposit) || 0,
  reg: d.registrationNumber,
  image: d.primaryImageUrl || null,
  status: d.bikeStatus,
  approval: d.approvalStatus,
  createdAt: d.createdAt,
});


export const pendingBikeDtoToRow = (d, partnerLookup = {}) => {
  const p = partnerLookup[d.partnerId];
  const kindOf = (url = "") => (/\.(jpe?g|png|webp)$/i.test(url) ? "image" : "pdf");
  return {
    id: d.bikeId,
    partnerId: d.partnerId,
    name: [d.manufacturer, d.model].filter(Boolean).join(" "),
    mf: d.manufacturer,
    cat: d.category,
    price: d.hourlyRate,
    deposit: d.securityDeposit,
    reg: d.registrationNumber,
    date: d.createdAt
      ? new Date(d.createdAt).toLocaleDateString("en-IN", {
          day: "numeric", month: "short", year: "numeric",
        })
      : "",
    owner: p?.businessName || p?.ownerName || `Partner #${d.partnerId}`,
    type: p?.sellerType === "COMMERCIAL_DEALER" ? "Business" : "Individual",
    docs: [
      d.rcUploadUrl && { type: "RC book", file: d.rcUploadUrl, kind: kindOf(d.rcUploadUrl) },
      d.pucUploadUrl && { type: "PUC", file: d.pucUploadUrl, kind: kindOf(d.pucUploadUrl) },
      d.insurance?.insuranceUploadUrl && {
        type: "Insurance",
        file: d.insurance.insuranceUploadUrl,
        kind: kindOf(d.insurance.insuranceUploadUrl),
      },
    ].filter(Boolean),
    insurance: d.insurance,
    images: (d.images || []).map((i) => i.imageUrl),
    approvalStatus: d.approvalStatus,
    cc: 0, // PendingBikeDto carries no engineCc
  };
};

/* ================= WRITE: UI -> DTO ================= */

// AddBikeForm state -> BikeListingRequestDto.
//
// `photoUrls` and `certUrls` must be REAL urls returned by uploadBikeFile().
// The form's current URL.createObjectURL() values are browser-only blob URLs
// and will fail validation on the server.
export const formToListingDto = (v, { photoUrls = [], certUrls = {} } = {}) => ({
  registrationNumber: v.reg?.trim().toUpperCase(),
  rcUploadUrl: certUrls.rc,
  pucUploadUrl: certUrls.puc,
  manufacturer: v.mf,
  // The form has one "Bike Name" field; the DTO wants manufacturer + model split.
  model:
    v.model?.trim() ||
    v.name?.replace(new RegExp(`^${v.mf}\\s*`, "i"), "").trim() ||
    v.name,
  hourlyRate: Number(v.price),
  securityDeposit: Number(v.deposit),
  registrationExpiry: v.rcExpiry,   // "yyyy-MM-dd"
  pucExpiry: v.pucExpiry,
  insurance: {
    insuranceNumber: v.insuranceNumber?.trim(),
    policyProvider: v.insuranceProvider?.trim(),
    policyHolderName: v.insuranceHolder?.trim(),
    expiryDate: v.insuranceExpiry,
    insuranceUploadUrl: certUrls.insurance,
  },
  bikeDetails: {
    bikeCategory: v.cat,
    bikeType: v.bikeType || v.cat,
    engineCc: Number(v.cc) || 0,
    transmission: v.trans,
    seatingCapacity: Number(v.seats) || 2,
    yearOfManufacture: Number(v.year),
    color: v.color || "",
    // UI collects specs as [{ name, type, value }]; JSONB wants a flat object.
    additionalSpecs: Object.fromEntries(
      (v.specs || []).map((s) => [s.name, s.value ?? s.type]),
    ),
  },
  images: photoUrls.map((imageUrl, i) => ({
    imageUrl,
    displayOrder: i,
    isPrimary: i === 0,
  })),
  // Everything the UI needs that has no column in the schema.
  additionalServices: {
    kmLimit: Number(v.kmLimit) || 0,
    extraKm: Number(v.extraKm) || 0,
    helmet: !!v.helmet,
    description: v.desc || "",
  },
});

// For the price/deposit-only PATCH.
export const formToOperationalDto = (v) => ({
  hourlyRate: Number(v.price),
  securityDeposit: Number(v.deposit),
  additionalServices: {
    kmLimit: Number(v.kmLimit) || 0,
    extraKm: Number(v.extraKm) || 0,
    helmet: !!v.helmet,
    description: v.desc || "",
  },
});

/* ================= SORT MAPPING ================= */

// Your SORT_OPTIONS list is UI wording; Spring wants "property,direction".
// Options mapped to `null` have NO backend equivalent (no rating/reviews/list
// price in the schema) and should be removed from the dropdown.
//
// WARNING: these property names must match the JPA ENTITY field names, not the
// DTO field names. Verify against your Bike entity before trusting them.
export const SORT_PARAM = {
  Recommended: undefined,
  "Price: Low to High": "hourlyRate,asc",
  "Price: High to Low": "hourlyRate,desc",
  "Newly Added": "createdAt,desc",
  "Lowest Security Deposit": "securityDeposit,asc",
  "Highest Rated": null,
  "Most Popular": null,
  "Best Deals": null,
  "Fastest Booking": null,
};

export const SUPPORTED_SORTS = Object.keys(SORT_PARAM).filter(
  (k) => SORT_PARAM[k] !== null,
);
