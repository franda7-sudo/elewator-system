import React from "react";
import { useElevator } from "../../context/ElevatorContext";

export default function LabSampleList() {
  const { history } = useElevator();

  const labEntries = history.filter(h => h.protein || h.density || h.fallingNumber);

  return (
    <div className="lab-list">
      <h2>Historia badań</h2>

      {labEntries.map(e => (
        <div key={e.id} className="lab-row">
          {e.timestamp} — komora {e.cellId}  
          {e.protein && <> | Białko: {e.protein}%</>}
          {e.density && <> | Gęstość: {e.density} kg/hl</>}
          {e.fallingNumber && <> | Opadanie: {e.fallingNumber} s</>}
        </div>
      ))}
    </div>
  );
}
