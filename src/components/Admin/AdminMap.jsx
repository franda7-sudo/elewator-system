import React, { useState, useMemo } from "react";
import { useElevator } from "../../context/ElevatorContext";
import SidePanel from "./SidePanel";
import TooltipCell from "./TooltipCell";
import "./AdminMap.css";

const LABELS = {
  bialko: "B",
  wilgotnosc: "W",
  gluten: "G",
  opadanie: "OP",
  gestosc: "GE",
};

export default function AdminMap() {
  const { 
    cells, 
    role, 
    updateCell, 
    qualityConfig, 
    grainDefinitions 
  } = useElevator();

  const [selectedCell, setSelectedCell] = useState(null);
  const [tooltipCell, setTooltipCell] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleSave = async (updatedData) => {
    try {
      if (updatedData.id) {
        await updateCell(updatedData.id, updatedData);
        if (selectedCell?.id === updatedData.id) {
          setSelectedCell({ ...selectedCell, ...updatedData });
        }
        setTooltipCell(null);
      }
    } catch (err) {
      console.error("Błąd zapisu:", err);
    }
  };

  const handleCellClick = (cell, event) => {
    event.stopPropagation();
    setSelectedCell(cell);
    const rect = event.currentTarget.getBoundingClientRect();
    let xPos = rect.right + 10;
    if (xPos + 300 > window.innerWidth) xPos = rect.left - 310;
    setTooltipPos({ x: xPos, y: rect.top });
    setTooltipCell(cell);
  };

  const normalize = (str) =>
    (str || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const getColor = (cell) => {
    if (!cell || !cell.grain) return "#27272a";
    const grain = normalize(cell.grain);
    if (grain.includes("pszenica")) {
      const bialko = parseFloat(cell.bialko ?? cell.protein);
      return !isNaN(bialko) && bialko < 11.5 ? "#fbbf24" : "#f59e0b";
    }
    if (grain.includes("zyto")) return "#65a30d";
    if (grain.includes("owies")) return "#facc15";
    if (grain.includes("jeczmien")) return "#38bdf8";
    if (grain.includes("rzepak")) return "#444444";
    return "#3f3f46";
  };

  const renderCell = (cell) => {
    const subParams = [];
    if (cell.wilgotnosc) subParams.push(`W: ${cell.wilgotnosc}%`);
    if (cell.gestosc) subParams.push(`GE: ${cell.gestosc}`);

    return (
      <div
        key={cell.id}
        className={`cell-box ${cell.alarm ? "alarm-blink" : ""} ${
          selectedCell?.id === cell.id ? "is-selected" : ""
        }`}
        onClick={(e) => handleCellClick(cell, e)}
        style={{ borderTop: `4px solid ${getColor(cell)}` }}
      >
        <div className="cell-header">
          <span className="cell-number">{cell.id}</span>
          <span className="cell-weight">{cell.waga ? `${cell.waga}t` : "0t"}</span>
        </div>
        <div className="cell-body">
          <div className="cell-grain-label">{cell.grain || "PUSTA"}</div>
          {cell.keyParam && cell[cell.keyParam] && (
            <div className="cell-param-main">
              {LABELS[cell.keyParam] || cell.keyParam}: <strong>{cell[cell.keyParam]}</strong>
            </div>
          )}
          <div className="cell-params-list">
            {subParams.map((p, i) => (
              <span key={i} className="param-tag">{p}</span>
            ))}
          </div>
        </div>
        <div className="cell-footer">
          <span className="cell-date">{cell.firstFill || ""}</span>
          <div className="cell-icons">
            {cell.alarm && <span>⚠️</span>}
          </div>
        </div>
      </div>
    );
  };

  const sectionS = useMemo(() => 
    cells.filter(c => String(c.id).endsWith("S")).sort((a,b) => parseInt(a.id) - parseInt(b.id)), [cells]);

  const sectionN_even = useMemo(() => 
    cells.filter(c => String(c.id).endsWith("N") && parseInt(c.id) % 2 === 0).sort((a,b) => parseInt(a.id) - parseInt(b.id)), [cells]);

  const sectionN_odd = useMemo(() => 
    cells.filter(c => String(c.id).endsWith("N") && parseInt(c.id) % 2 !== 0).sort((a,b) => parseInt(a.id) - parseInt(b.id)), [cells]);

  const sectionG = useMemo(() => 
    cells.filter(c => String(c.id).endsWith("G")).sort((a,b) => parseInt(a.id) - parseInt(b.id)), [cells]);

  const sectionW = useMemo(() => 
    cells.filter(c => String(c.id).endsWith("W") || (parseInt(c.id) >= 42 && parseInt(c.id) <= 52)).sort((a,b) => parseInt(a.id) - parseInt(b.id)), [cells]);

  return (
    <div className="admin-map-wrapper" onClick={() => setTooltipCell(null)}>
      <header className="map-top-bar">
        <h1>Panel Dyspozytora - Mapa Silosów</h1>
      </header>

      {/* SEKCJA S - 10 KOLUMN */}
      <section className="elevator-section">
        <h3><span className="section-badge">S</span> Stary Elewator (4x10)</h3>
        <div className="grid-10-cols">
          {sectionS.map(renderCell)}
        </div>
      </section>

      {/* SEKCJA N - 10 KOLUMN (PARZYSTE GÓRA, NIEPARZYSTE DÓŁ) */}
      <section className="elevator-section">
        <h3><span className="section-badge">N</span> Nowy Elewator</h3>
        <div className="grid-10-cols">
          {sectionN_even.map(renderCell)}
          {sectionN_odd.map(renderCell)}
        </div>
      </section>

      {/* SEKCJA G - 5 KOLUMN (SZEROKOŚĆ 50%) */}
      <section className="elevator-section">
        <h3><span className="section-badge">G</span> Komory G</h3>
        <div className="grid-5-cols">
          {sectionG.map(renderCell)}
        </div>
      </section>

      {/* SEKCJA W - 10 KOLUMN */}
      <section className="elevator-section">
        <h3><span className="section-badge">W</span> Komory Wydawcze</h3>
        <div className="grid-10-cols">
          {sectionW.map(renderCell)}
        </div>
      </section>

      {tooltipCell && (
        <div className="floating-tooltip" style={{ top: tooltipPos.y, left: tooltipPos.x }} onClick={e => e.stopPropagation()}>
          <TooltipCell cell={tooltipCell} role={role} onSave={handleSave} />
        </div>
      )}

      {selectedCell && (
        <SidePanel cell={selectedCell} onClose={() => setSelectedCell(null)} onSave={handleSave} qualityConfig={qualityConfig} grainDefinitions={grainDefinitions} updateCell={updateCell} />
      )}
    </div>
  );
}