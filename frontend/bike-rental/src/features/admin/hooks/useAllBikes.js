import { useCallback, useEffect, useState } from "react";
import { getAllBikesAdmin } from "../../../api/bikes.js";
import { adminBikeDtoToRow } from "../../../lib/adapters/bike.js";

export function useAllBikes({ enabled = true } = {}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const page = await getAllBikesAdmin({ page: 0, size: 100 });
      setRows((page.content || []).map(adminBikeDtoToRow));
    } catch (e) {
      setError(e.userMessage || "Failed to fetch bikes");
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => { refresh(); }, [refresh]);

  return { rows, loading, error, refresh };
}