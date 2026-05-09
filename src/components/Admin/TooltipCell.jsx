import React from "react";
import "./TooltipCell.css";

export default function TooltipCell({ cell, role }) {
  if (!cell) return null;

  return (
    <div className="tooltip-cell">
      <h3 className="tooltip-title">Komórka {cell.id}</h3>

      <div className="tooltip-row">
        <span className="tooltip-label">Ziarno:</span>
        <span className="tooltip-value">{cell.grain || "—"}</span>
      </div>

      <div className="tooltip-row">
        <span className="tooltip-label">Waga:</span>
        <span className="tooltip-value">
          {cell.waga ? `${cell.waga} t` : "—"}
        </span>
      </div>

      <div className="tooltip-row">
        <span className="tooltip-label">Wilgotność:</span>
        <span className="tooltip-value">
          {cell.wilgotnosc ? `${cell.wilgotnosc}%` : "—"}
        </span>
      </div>

      <div className="tooltip-row">
        <span className="tooltip-label">Temperatura:</span>
        <span className="tooltip-value">
          {cell.temp ? `${cell.temp}°C` : "—"}
        </span>
      </div>

      <div className="tooltip-footer">Rola: {role}</div>
    </div>
  );
}
