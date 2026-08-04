import { useEffect, useState } from "react";
import { fetchDealer, getDealerSync } from "./dealerRegistry.js";

export function useDealer(partnerId) {
  const [dealer, setDealer] = useState(() => getDealerSync(partnerId));

  useEffect(() => {
    let alive = true;
    if (partnerId == null) return;
    fetchDealer(partnerId).then((d) => alive && setDealer(d));
    return () => {
      alive = false;
    };
  }, [partnerId]);

  return dealer;
}