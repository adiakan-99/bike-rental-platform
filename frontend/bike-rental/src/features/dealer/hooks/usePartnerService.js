import { useState, useCallback } from "react";
import partnerApi from "../../../api/partnerApi";

export function usePartnerService() {
  const [partner, setPartner] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(async (fn) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fn();
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMyProfile = useCallback(async () => {
    const data = await run(() => partnerApi.getMyProfile());
    setPartner(data);
    return data;
  }, [run]);

  const getMyDocuments = useCallback(async () => {
    const data = await run(() => partnerApi.getMyDocuments());
    setDocuments(data);
    return data;
  }, [run]);

  const onboardPartner = useCallback(
    async (body) => {
      const data = await run(() => partnerApi.onboardPartner(body));
      setPartner(data);
      return data;
    },
    [run]
  );

  const updateMyProfile = useCallback(
    async (body) => {
      const data = await run(() => partnerApi.updateMyProfile(body));
      setPartner(data);
      return data;
    },
    [run]
  );

  const updateDocuments = useCallback(
    (body) => run(() => partnerApi.updateMyDocuments(body)),
    [run]
  );

  const updatePayout = useCallback(
    (body) => run(() => partnerApi.updatePayout(body)),
    [run]
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    partner, documents, loading, error,
    getMyProfile, getMyDocuments, onboardPartner,
    updateMyProfile, updateDocuments, updatePayout, clearError,
  };
}