import { useCallback, useEffect, useState } from "react";
import {
  deleteBikeListing,
  getMyFleet,
  updateBikeStatus,
  updateOperationalDetails,
} from "../../../api/bikes.js";
import { fleetDtoToListing } from "../../../lib/adapters/bike.js";

export function useMyFleet({ enabled = true } = {}) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getMyFleet();
      setListings((data || []).map(fleetDtoToListing));
    } catch (e) {
      setError(e.userMessage || "Couldn't load your fleet.");
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => { refresh(); }, [refresh]);

  // Replace one row from a FleetListingDto response. The server is authoritative,
  // so we take what it returns rather than guessing the new state locally.
  const applyDto = (dto) => {
    const mapped = fleetDtoToListing(dto);
    setListings((prev) => prev.map((l) => (l.id === mapped.id ? mapped : l)));
    return mapped;
  };

  // AVAILABLE | RENTED | MAINTENANCE | INACTIVE
  const setStatus = useCallback(async (id, bikeStatus) => {
    const dto = await updateBikeStatus(id, bikeStatus);
    return applyDto(dto);
  }, []);

  // Price / deposit / services only. Deliberately NOT the full PUT: a ₹50 price
  // change shouldn't knock an approved listing back into the review queue.
  const patchOperational = useCallback(async (id, patch) => {
    const dto = await updateOperationalDetails(id, patch);
    return applyDto(dto);
  }, []);

  const remove = useCallback(async (id) => {
    await deleteBikeListing(id);
    setListings((prev) => prev.filter((l) => l.id !== id));
  }, []);

  return { listings, loading, error, refresh, setStatus, patchOperational, remove, setListings };
}
