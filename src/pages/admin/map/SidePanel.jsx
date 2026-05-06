// np. pages/admin/map/SidePanel.jsx
import React, { useState } from "react";
import "./SidePanel.css";
import { useElevator } from "../../../context/ElevatorContext"; // dopasuj
import { grainList } from "../../admin/grains/GrainList";       // dopasuj
import { grainGroups } from "../../admin/grains/GrainGroups";   // dopasuj

export default function SidePanel({ cell, onClose }) {
  const { updateCell } = useElevator();
  const [grain, setGrain] = useState(cell.grain || "");
  const [qualityGroup, setQualityGroup] = useState(cell.qualityGroup || "");

  const handleSave = async () => {
    await updateCell(cell.id, {
      grain: grain || null,
      qualityGroup: qualityGroup || null,
    });
    onClose();
  };

  return (
    <div className="sidepanel">
      <h3>Komora {cell.label}</h3>

      <label>Zboże</label>
      <select value={grain} onChange={(e) => setGrain(e.target.value)}>
        <option value="">—</option>
        {grainList.map((g) => (
          <option key={g.id || g} value={g.id || g}>
            {g.name || g}
          </option>
        ))}
      </select>

      <label>Grupa jakości</label>
      <select
        value={qualityGroup}
        onChange={(e) => setQualityGroup(e.target.value)}
      >
        <option value="">—</option>
        {grainGroups.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>

      <div className="sidepanel-actions">
        <button onClick={handleSave}>Zapisz</button>
        <button onClick={onClose}>Anuluj</button>
      </div>
    </div>
  );
}
