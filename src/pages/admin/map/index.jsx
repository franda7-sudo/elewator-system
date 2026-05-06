import React, { useEffect, useState } from "react";
import { useElevator } from "../../../context/ElevatorContext";
import SidePanel from "../../../components/Admin/map/SidePanel";
import "./AdminMap.css";

function weightColor(weight, capacity) {
  if (!capacity) return "#555";
  const ratio = Math.min(weight / capacity, 1);
  const r = Math.floor(255 * ratio);
  const g = Math.floor(255 * (1 - ratio));
  return `rgb(${r},${g},0)`;
}

function tempColor(temp) {
  if (temp < 20) return "#00aaff";
  if (temp < 30) return "#55cc00";
  if (temp < 40) return "#ffaa00";
  return "#ff0000";
}

export default function AdminMap() {
  const {
    cells,
    dallas,
    getAllGrainGroups,
    activeCell,
    activeGroup,
  } = useElevator();

  const [grainGroups, setGrainGroups] = useState({});
  const [heatmapMode, setHeatmapMode] = useState(null);
  const [debug, setDebug] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [activeBatch, setActiveBatch] = useState(null);

  useEffect(() => {
    getAllGrainGroups().then(setGrainGroups);
  }, [getAllGrainGroups]);

  function getGroupForCell(cell) {
    if (!cell.grain) return null;
    const groups = grainGroups[cell.grain];
    if (!groups) return null;
    return groups.find((g) => g.cells?.includes(cell.id)) || null;
  }

  function getBorderColor(cell) {
    if (cell.blocked) return "#ffcc00";
    if (cell.full) return "#ff0000";
    if (cell.alarm) return "#ff4444";
    return "#00aa00";
  }

  function handleCellClick(cell) {
    setSelectedCell(cell.id);
    const groupInfo = getGroupForCell(cell);
    if (cell.grain && groupInfo?.label) {
      setActiveBatch({ grain: cell.grain, group: groupInfo.label });
    } else {
      setActiveBatch(null);
    }
  }

  return (
    <div className="admin-map-container">
      <h1>SCADA — mapa komór</h1>

      <div className="admin-map-toolbar">
        <button onClick={() => setHeatmapMode("waga")}>Heatmapa: waga</button>
        <button onClick={() => setHeatmapMode("temp")}>
          Heatmapa: temperatura
        </button>
        <button onClick={() => setHeatmapMode(null)}>Wyłącz heatmapę</button>
        <button onClick={() => setDebug((d) => !d)}>
          {debug ? "Tryb normalny" : "Tryb diagnostyczny"}
        </button>
      </div>

      <div className="admin-map-grid">
        {cells.map((cell) => {
          const groupInfo = getGroupForCell(cell);
          const baseColor = groupInfo?.color || "#777";

          const sensor = dallas.find((d) => d.id === cell.id);
          let heatColor = null;
          if (heatmapMode === "waga") {
            heatColor = weightColor(cell.waga || 0, cell.capacity || 0);
          } else if (heatmapMode === "temp" && sensor) {
            heatColor = tempColor(sensor.temp);
          }

          const isActiveCell = activeCell === cell.id;
          const isActiveGroup = groupInfo?.label === activeGroup;
          const isBatch =
            activeBatch &&
            cell.grain === activeBatch.grain &&
            groupInfo?.label === activeBatch.group;

          return (
            <div
              key={cell.id}
              className="map-cell"
              onClick={() => handleCellClick(cell)}
              title={
                isActiveCell
                  ? `Zasyp trwa → ${cell.id}`
                  : `${cell.id} — ${cell.waga ?? 0} t`
              }
              style={{
                backgroundColor: heatColor || baseColor,
                border: `3px solid ${getBorderColor(cell)}`,
                outline: isActiveCell
                  ? "3px solid yellow"
                  : isBatch
                  ? "3px solid cyan"
                  : isActiveGroup
                  ? "3px solid rgba(255,255,0,0.5)"
                  : "none",
                boxShadow: isActiveCell
                  ? "0 0 12px 4px rgba(255,255,0,0.9)"
                  : isBatch
                  ? "0 0 10px 3px rgba(0,255,255,0.6)"
                  : isActiveGroup
                  ? "0 0 6px 2px rgba(255,255,0,0.4)"
                  : "none",
              }}
            >
              <div>{cell.id}</div>
              <div>{cell.grain || "—"}</div>
              <div>{cell.waga ?? 0} t</div>
              <div>
                {sensor?.temp ? `${sensor.temp.toFixed(1)} °C` : "— °C"}
              </div>

              {debug && (
                <pre className="cell-debug">
                  {JSON.stringify(cell, null, 2)}
                </pre>
              )}
            </div>
          );
        })}
      </div>

      {selectedCell && (
        <SidePanel cellId={selectedCell} onClose={() => setSelectedCell(null)} />
      )}
    </div>
  );
}
