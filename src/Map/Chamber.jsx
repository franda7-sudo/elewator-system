import React from "react";
import { getGrainColor } from "./mapColors";
import "./Map.css";

export default function Chamber({ chamber }) {
  if (!chamber) return null;

  const {
    id,
    grain,
    amount,
    tons,
    params,
    qualityParams,
    firstFillDate,
  } = chamber;

  const currentTons = typeof amount === "number"
    ? amount
    : typeof tons === "number"
    ? tons
    : 0;

  const grainName = grain || "—";

  // Parametry jakościowe:
  // 1) jeśli admin zdefiniuje qualityParams: [{label, value}, ...]
  // 2) jeśli nie – bierzemy z params (np. białko, wilg, opad)
  let quality = [];

  if (Array.isArray(qualityParams) && qualityParams.length > 0) {
    quality = qualityParams.slice(0, 3);
  } else if (params && typeof params === "object") {
    quality = Object.entries(params)
      .slice(0, 3)
      .map(([key, value]) => ({
        label: key,
        value,
      }));
  }

  const bgColor = getGrainColor({
    grain,
    protein: params?.bialko ?? params?.protein,
  });

  return (
    <div className="chamber" style={{ backgroundColor: bgColor }}>
      <div className="chamber-header">
        <span className="chamber-tons">
          {currentTons ? `${currentTons.toFixed(1)} t` : "-"}
        </span>
        <span className="chamber-id">{id}</span>
      </div>

      <div className="chamber-body">
        <div className="chamber-grain">{grainName}</div>

        {quality.map((q, idx) => (
          <div key={idx} className="chamber-quality-line">
            {q.label}: {q.value}
          </div>
        ))}
      </div>

      <div className="chamber-footer">
        {firstFillDate && <span>Od: {firstFillDate}</span>}
      </div>
    </div>
  );
}
