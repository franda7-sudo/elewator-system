// src/operator/panels/WeightPanel.jsx

import React, { useState } from "react";
import { useElevator } from "../../context/ElevatorContext";
import { calculateWeight } from "../../utils/calcWeight";

export default function WeightPanel({ onSubmit }) {
  const { cells } = useElevator();

  const [cellId, setCellId] = useState("");
  const [luz, setLuz] = useState("");
  const [waga, setWaga] = useState(null);

  const handleAutoRecalc = (value) => {
    setLuz(value);

    const cell = cells.find((c) => c.id === cellId);
    if (!cell) {
      setWaga(null);
      return;
    }

    const w = calculateWeight(cell.grain, cell.id, parseFloat(value));
    setWaga(w);
  };

  const handleConfirm = () => {
    if (!cellId || luz === "" || waga === null) return;

    onSubmit({
      cell: cellId,
      luz: parseFloat(luz),
      waga,
    });
  };

  return (
    <div className="panel panel-weight">
      <h2>⚖️ Korekta stanów</h2>

      <div className="panel-row">
        <label>Komora</label>
        <select value={cellId} onChange={(e) => setCellId(e.target.value)}>
          <option value="">-- wybierz --</option>
          {cells.map((c) => (
            <option key={c.id} value={c.id}>
              {c.id}
            </option>
          ))}
        </select>
      </div>

      <div className="panel-row">
        <label>Pomiar luzu [m]</label>
        <input
          type="number"
          step="0.1"
          value={luz}
          onChange={(e) => handleAutoRecalc(e.target.value)}
        />
      </div>

      {waga !== null && (
        <div className="panel-result">
          Wyliczona waga: <strong>{waga.toFixed(1)} t</strong>
        </div>
      )}

      <div className="panel-actions">
        <button className="btn-primary" onClick={handleConfirm}>
          Zapisz korektę
        </button>
      </div>
    </div>
  );
}
