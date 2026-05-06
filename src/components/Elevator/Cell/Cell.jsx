import React from "react";
import "./Cell.css";

export default function Cell({ cell, alarms, dallas }) {
  if (!cell) {
    return <div className="cell empty">—</div>;
  }

  const getCellColor = () => {
    if (cell.status === "fault") return "#ff0000";

    switch (cell.grain) {
      case "pszenica": return "var(--grain-wheat)";
      case "żyto": return "var(--grain-rye)";
      case "owies": return "var(--grain-oats)";
      case "jęczmień": return "var(--grain-barley)";
      case "pellet": return "var(--grain-pellet)";
      default: return "transparent";
    }
  };

  const renderParams = () => {
    if (!cell.params) return "";
    const p = cell.params;

    return [
      p.bialko ? `Białko: ${p.bialko}` : null,
      p.wilg ? `Wilg.: ${p.wilg}` : null,
      p.opad ? `Opad: ${p.opad}` : null,
      p.gest ? `Gęst.: ${p.gest}` : null,
    ]
      .filter(Boolean)
      .join("  ");
  };

  const getDallasTemp = () => {
    const sensor = dallas?.find((d) => d.cellId === cell.id);
    return sensor ? `${sensor.temp}°C` : "—";
  };

  const getAlarmClass = () => {
    if (cell.status === "fault") return "alarm-red";
    if (cell.fill > 95) return "alarm-yellow";

    const hasDallasAlarm = alarms?.some(
      (a) => a.type === "temp" && a.cellId === cell.id
    );

    return hasDallasAlarm ? "alarm-blue" : "";
  };

  const weight = cell.estimatedWeight ?? "—";

  return (
    <div
      className={`cell ${getAlarmClass()}`}
      style={{ backgroundColor: getCellColor() }}
    >
      <div className="fill-level" style={{ height: `${cell.fill || 0}%` }} />

      <div className="cell-header">
        <span>{cell.label}</span>
        <span>{weight} t</span>
      </div>

      <div className="cell-line grain">{cell.grain || "—"}</div>
      <div className="cell-line params">{renderParams()}</div>
      <div className="cell-line temp">Śr. temp: {getDallasTemp()}</div>
      <div className="cell-line date">
        {cell.firstFill
          ? new Date(cell.firstFill).toLocaleDateString("pl-PL")
          : "—"}
      </div>

      <div className="tooltip">
        <strong>Komora:</strong> {cell.label}<br />
        <strong>Zboże:</strong> {cell.grain || "—"}<br />
        <strong>Status:</strong> {cell.status || "—"}<br />
        <strong>Parametry:</strong> {renderParams() || "—"}<br />
        <strong>Pierwszy zasyp:</strong>{" "}
        {cell.firstFill
          ? new Date(cell.firstFill).toLocaleDateString("pl-PL")
          : "—"}
        <br />
        <strong>Napełnienie:</strong> {cell.fill || 0}%<br />
        <strong>Temperatura:</strong> {getDallasTemp()}<br />
        <strong>Pojemność:</strong> {cell.capacity || "—"} t<br />
        <strong>Wys. zasypu:</strong> {cell.height || "—"} m
      </div>
    </div>
  );
}
