const registry = new Map();

// Call after mapping API results. Accepts one bike or an array.
export const registerBikes = (bikes) => {
  for (const b of [].concat(bikes)) {
    if (b?.id != null) {
      // Merge rather than replace: a detail fetch carries more fields than a card,
      // and we don't want the card version to wipe them out later.
      registry.set(b.id, { ...(registry.get(b.id) || {}), ...b });
    }
  }
};

export const getBike = (id) => registry.get(id) || null;

// Returns only the IDs we actually have objects for, so a stale wishlist entry
// (bike since deleted) is skipped instead of rendering as `undefined`.
export const getBikes = (ids) =>
  [...ids].map((id) => registry.get(id)).filter(Boolean);

export const clearBikeRegistry = () => registry.clear();
export const findBike = (predicate) => [...registry.values()].find(predicate) || null;