import React from "react";
import { useElevator } from "../../context/ElevatorContext";
import "./DiagnosticsPanel.css";

export default function DiagnosticsPanel() {
  const { cells, pendingDeliveries, grainDefinitions } = useElevator();

  const totalWeight = cells.reduce(
    (sum, c) => sum + Number(c.waga || 0),
    0
  );

  const totalPending = cells.reduce(
    (sum, c) => sum + Number(c.pending || 0),
    0
  );

  return (
    <div className="diagnostics-wrapper">
      <h2>🧰 Diagnostyka systemu</h2>

      <div className="diag-grid">

        <div className="diag-box">
          <h4>Komory</h4>
          <p>{cells.length}</p>
        </div>

        <div className="diag-box">
          <h4>Aktywne komory</h4>
          <p>{cells.filter((c) => c.grain).length}</p>
        </div>

        <div className="diag-box">
          <h4>Pending deliveries</h4>
          <p>{pendingDeliveries.length}</p>
        </div>

        <div className="diag-box">
          <h4>Sumaryczna waga</h4>
          <p>{totalWeight} t</p>
        </div>

        <div className="diag-box">
          <h4>Sumaryczny pending</h4>
          <p>{totalPending} t</p>
        </div>

        <div className="diag-box">
          <h4>Zboża skonfigurowane</h4>
          <p>{Object.keys(grainDefinitions).length}</p>
        </div>

        <div className="diag-box diag-ok">
          <h4>Status backendu</h4>
          <p>OK</p>
        </div>
      </div>

      <div className="diag-future">
        <h3>Moduły w przygotowaniu</h3>
        <ul>
          <li>Logi systemowe</li>
          <li>Status operatorów</li>
          <li>Ostatnie błędy</li>
          <li>Monitoring SCADA</li>
          <li>Historia zdarzeń</li>
        </ul>
      </div>
    </div>
  );
}
