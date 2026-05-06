import React, { useState } from "react";
import { getGrainColor } from "./mapColors";
import "./Map.css";

export default function Chamber({ chamber }) {
  // 🔥 HOOKI MUSZĄ BYĆ NA SAMEJ GÓRZE
  const [showTooltip, setShowTooltip] = useState(false);

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

  const currentTons =
    typeof amount === "number"
      ? amount
      : typeof tons === "number"
      ? tons
      : 0;

  const grainName = grain || "—";

  // 🔥 Pobieramy 3 parametry do wyświetlenia na kafelku
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

  // 🔥 Normatywność
  function getQualityStatus(params) {
    if (!params) return "ok";

    for (const [key, value] of Object.entries(params)) {
      if (typeof value === "object") {
        if (value.extra > 0) return "bad";
        if (value.min !== undefined && value.max !== undefined) {
          if (value.current < value.min || value.current > value.max) {
            return "bad";
          }
        }
      }
    }
    return "ok";
  }

  const qualityStatus = getQualityStatus(params);

  const bgColor = getGrainColor({
    grain,
    protein: params?.bialko ?? params?.protein,
  });

  return (
    <div
      className={`chamber ${qualityStatus}`}
      style={{ backgroundColor: bgColor }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="chamber-header">
        <span className="chamber-tons">
          {currentTons ? `${currentTons.toFixed(1)} t` : "-"}
        </span>

        <span className="chamber-id">
          {id}
          {qualityStatus === "bad" && <span className="warn-icon">⚠️</span>}
        </span>
      </div>

      <div className="chamber-body">
        <div className="chamber-grain">{grainName}</div>

        {quality.map((q, idx) => {
          let displayValue = q.value;

          if (typeof displayValue === "object" && displayValue !== null) {
            const { min, max, extra, current } = displayValue;
            displayValue = `${current ?? ""} (${min ?? ""}–${max ?? ""}${
              extra ? ` +${extra}` : ""
            })`;
          }

          return (
            <div key={idx} className="chamber-quality-line">
              {q.label}: {displayValue}
            </div>
          );
        })}
      </div>

      <div className="chamber-footer">
        {firstFillDate && <span>Od: {firstFillDate}</span>}
      </div>

      {showTooltip && (
        <div className="chamber-tooltip">
          <div><b>Komora:</b> {id}</div>
          <div><b>Zboże:</b> {grainName}</div>
          <div><b>Tonaż:</b> {currentTons} t</div>

          {firstFillDate && (
            <div><b>Od:</b> {firstFillDate}</div>
          )}

          <div style={{ marginTop: 6 }}><b>Parametry:</b></div>

          {Object.entries(params || {}).map(([k, v], i) => (
            <div key={i}>
              {k}: {typeof v === "object" ? JSON.stringify(v) : v}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
