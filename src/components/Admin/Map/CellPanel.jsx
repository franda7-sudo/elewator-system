// src/components/Admin/CellPanel.jsx

import React, { useContext, useEffect, useState } from "react";
import { ElevatorContext } from "../../context/ElevatorContext";
import { db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import "./CellPanel.css";

export default function CellPanel() {
  const { selectedCell, cells } = useContext(ElevatorContext);
  const [cell, setCell] = useState(null);

  useEffect(() => {
    const found = cells.find((c) => c.id === selectedCell);
    setCell(found || null);
  }, [selectedCell, cells]);

  if (!cell) {
    return (
      <div className="cell-panel-empty">
        <p>Wybierz komorę z mapy.</p>
      </div>
    );
  }

  async function updateField(field, value) {
    await updateDoc(doc(db, "cells", cell.id), {
      [field]: value,
    });
  }

  return (
    <div className="cell-panel">
      <h3>Komora {cell.id}</h3>

      <div className="cell-panel-row">
        <label>Zboże:</label>
        <input
          type="text"
          value={cell.grain || ""}
          onChange={(e) => updateField("grain", e.target.value)}
        />
      </div>

      <div className="cell-panel-row">
        <label>Waga (t):</label>
        <input
          type="number"
          value={cell.weight || 0}
          onChange={(e) => updateField("weight", Number(e.target.value))}
        />
      </div>

      <div className="cell-panel-row">
        <label>Parametr kluczowy:</label>
        <input type="text" value={cell.keyParam || ""} disabled />
      </div>

      <div className="cell-panel-row">
        <label>Zakres:</label>
        <input
          type="text"
          value={
            cell.min != null && cell.max != null
              ? `${cell.min} – ${cell.max}`
              : "—"
          }
          disabled
        />
      </div>

      <div className="cell-panel-row">
        <label>Alarm:</label>
        <input
          type="checkbox"
          checked={cell.alarm || false}
          onChange={(e) => updateField("alarm", e.target.checked)}
        />
      </div>

      <div className="cell-panel-row">
        <label>Komora specjalna / usługowa:</label>
        <input
          type="checkbox"
          checked={cell.specialFlag || false}
          onChange={(e) => updateField("specialFlag", e.target.checked)}
        />
      </div>
    </div>
  );
}
