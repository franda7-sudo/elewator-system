import React, { useEffect, useMemo } from "react";
import { useElevator } from "../../../context/ElevatorContext";
import Map from "./Map";          // 🔥 TA SAMA MAPA CO W ADMINMAP
import "./Map.css";              // 🔥 TE SAME STYLE
import "./MapReport.css";        // 🔥 DODATKOWE STYLE DO DRUKU

export default function MapReport() {
  const { cells } = useElevator();

  // 🔥 Auto-print
  useEffect(() => {
    setTimeout(() => window.print(), 500);
  }, []);

  // 🔥 Podsumowanie tonażu
  const summary = useMemo(() => {
    const sum = { S: 0, N: 0, G: 0 };

    cells.forEach((c) => {
      if (!c?.id) return;

      const tons =
        typeof c.amount === "number"
          ? c.amount
          : typeof c.tons === "number"
          ? c.tons
          : 0;

      if (c.id.endsWith("S")) sum.S += tons;
      if (c.id.endsWith("N")) sum.N += tons;
      if (c.id.endsWith("G")) sum.G += tons;
    });

    return sum;
  }, [cells]);

  return (
    <div className="map-report-root">

      {/* 🔥 Nagłówek */}
      <header className="map-report-header">
        <h1>Raport mapy komór</h1>
        <div className="report-date">{new Date().toLocaleString()}</div>
      </header>

      {/* 🔥 Mapa — 1:1 jak AdminMap */}
      <div className="map-report-content">
        <Map />
      </div>

      {/* 🔥 Podsumowanie tonażu */}
      <div className="summary-box">
        <h2>Podsumowanie tonażu</h2>
        <table>
          <tbody>
            <tr><td>S</td><td>{summary.S.toFixed(1)} t</td></tr>
            <tr><td>N</td><td>{summary.N.toFixed(1)} t</td></tr>
            <tr><td>G</td><td>{summary.G.toFixed(1)} t</td></tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
