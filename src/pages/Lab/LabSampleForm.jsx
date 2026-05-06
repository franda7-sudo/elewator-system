import React, { useState } from "react";
import { useElevator } from "../../context/ElevatorContext";

export default function LabSampleForm() {
  const { updateCell, addHistory } = useElevator();
  const [cellId, setCellId] = useState("");
  const [protein, setProtein] = useState("");
  const [density, setDensity] = useState("");
  const [fallingNumber, setFallingNumber] = useState("");

  const submit = () => {
    updateCell(cellId, {
      protein,
      density,
      fallingNumber
    });

    addHistory({
      cellId,
      weight: 0,
      grain: null,
      protein,
      density,
      fallingNumber
    });
  };

  return (
    <div className="lab-form">
      <h2>Wprowadź wyniki badań</h2>

      <input placeholder="Komora" value={cellId} onChange={e => setCellId(e.target.value)} />
      <input placeholder="Białko (%)" value={protein} onChange={e => setProtein(e.target.value)} />
      <input placeholder="Gęstość (kg/hl)" value={density} onChange={e => setDensity(e.target.value)} />
      <input placeholder="Liczba opadania (s)" value={fallingNumber} onChange={e => setFallingNumber(e.target.value)} />

      <button onClick={submit}>Zapisz</button>
    </div>
  );
}
