import { useCallback, useEffect, useState } from "react";
import { getPendingBikes, reviewBike } from "../../../api/bikes.js";
import { pendingBikeDtoToRow } from "../../../lib/adapters/bike.js";

export function usePendingBikes({ enabled = true } = {}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      // Fetches real pending bikes from backend database
      const page = await getPendingBikes({ page: 0, size: 50 });
      setRows((page.content || []).map((d) => pendingBikeDtoToRow(d)));
    } catch (e) {
      setError(e.userMessage || "Failed to fetch pending bikes");
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Sends APPROVE or REJECT API request to backend
  const decide = useCallback(async (id, action, reason) => {
    await reviewBike(id, action === "approve" ? "APPROVED" : "REJECTED", reason);
    // Remove approved/rejected bike from admin view locally
    setRows((p) => p.filter((r) => r.id !== id));
  }, []);

  return { rows, loading, error, refresh, decide };
}