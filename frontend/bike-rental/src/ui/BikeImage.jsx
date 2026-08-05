import { useState } from "react";
import { Bike } from "lucide-react";
import { CAT_GRADIENT } from "../constants";

export function BikeImage({ bike, className = "" }) {
  const [failed, setFailed] = useState(false);
  const src = bike?.image || bike?.images?.[0] || null;
  const showPhoto = src && !failed;

  return (
    <div
      className={`relative flex items-end justify-center overflow-hidden ${className}`}
      style={{ background: CAT_GRADIENT[bike?.cat] || CAT_GRADIENT.Commuter }}
    >
      {showPhoto ? (
        <img
          src={src}
          alt={bike?.name || "Bike"}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <>
          <div
            className="absolute inset-0 opacity-20"
            style={{ background: "radial-gradient(120% 90% at 20% 15%, #fff, transparent 55%)" }}
          />
          <Bike className="mb-2 text-white/85" style={{ width: "45%", height: "45%" }} strokeWidth={1.1} />
        </>
      )}
    </div>
  );
}
