import React from "react";
import "./CellCard.css";

export default function CellCard({ id, data }) {
  if (!data) return null;

  const { amount, grain, humidity, protein, density, fallingNumber } = data;

  const capacity = 100;
  const percent = capacity > 0 ? Math.min(100, (amount / capacity) * 100) : 0;

  // --- STATUS KOLORY ---
  let statusClass = "ok";

  // Wilgotność
  if (humidity != null) {
    const h = Number(humidity);
    if (h > 16) statusClass = "critical";
    else if (h > 14.5) statusClass = "warning";
  }

  // Białko
  if (protein != null) {
    const p = Number(protein);
    if (p < 10 && statusClass === "ok") statusClass = "quality-warning";
  }

  // Gęstość
  if (density != null) {
    const d = Number(density);
    if (d < 72 && statusClass === "ok") statusClass = "quality-warning";
  }

  // Liczba opadania
  if (fallingNumber != null) {
    const f = Number(fallingNumber);
    if (f < 200) statusClass = "critical";
    else if (f < 250 && statusClass === "ok") statusClass = "quality-warning";
  }

  return (
    <div className={`cell-card ${statusClass}`}>
      <div className="cell-header">
        <span>{id}</span>
        <span>{grain || "-"}</span>
      </div>
      <div className="tooltip">
       <strong>Komora {id}</strong><br/>
      {grain && <>Zboże: {grain}<br/></>}
      Ilość: {amount} t<br/>
      {humidity != null && <>Wilgotność: {humidity}%<br/></>}
      {protein != null && <>Białko: {protein}%<br/></>}
      {density != null && <>Gęstość: {density} kg/hl<br/></>}
      {fallingNumber != null && <>Liczba opadania: {fallingNumber} s<br/></>}
     </div>

      <div className="cell-body">
        <div className="bar">
          <div className="fill" style={{ height: `${percent}%` }} />
        </div>

        <div className="amount">
          <span>{amount?.toFixed ? amount.toFixed(1) : amount} t</span>

          {humidity != null && (
            <span className="percent">Wilg.: {Number(humidity).toFixed(1)}%</span>
          )}

          {protein != null && (
            <span className="percent">Białko: {Number(protein).toFixed(1)}%</span>
          )}

          {density != null && (
            <span className="percent">Gęst.: {Number(density).toFixed(1)} kg/hl</span>
          )}

          {fallingNumber != null && (
            <span className="percent">Opad.: {Number(fallingNumber).toFixed(0)} s</span>
          )}
        </div>
      </div>
    </div>
  );
}
