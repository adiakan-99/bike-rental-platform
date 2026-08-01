import { useState, useCallback } from "react";
import partnerApi from "../../../api/partnerApi";

export function usePartnerAdmin() {
  const [partners, setPartners] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async (fn) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await fn();
      setPartners(data.content ?? []);
      setTotalPages(data.totalPages ?? 0);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Could not load partners.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPending = useCallback(
    (page = 0, size = 10) => load(() => partnerApi.admin.getPending(page, size)),
    [load]
  );

  const getAll = useCallback(
    (filters) => load(() => partnerApi.admin.getAll(filters)),
    [load]
  );

  const review = useCallback(async (id, decision) => {
    setError(null);
    try {
      const { data } = await partnerApi.admin.review(id, decision);
      setPartners((prev) => prev.filter((p) => p.partnerId !== id));
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Review failed.");
      throw err;
    }
  }, []);

  const block = useCallback(async (id, reason) => {
    const { data } = await partnerApi.admin.block(id, reason);
    setPartners((prev) =>
      prev.map((p) => (p.partnerId === id ? { ...p, accountStatus: "BLOCKED" } : p))
    );
    return data;
  }, []);

  const unblock = useCallback(async (id) => {
    const { data } = await partnerApi.admin.unblock(id);
    setPartners((prev) =>
      prev.map((p) => (p.partnerId === id ? { ...p, accountStatus: "ACTIVE" } : p))
    );
    return data;
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    partners, totalPages, loading, error,
    getPending, getAll, review, block, unblock, clearError,
  };
}