import React from "react";
import { useNavigate } from "react-router-dom";
import "./OperatorsPanel.css";

export default function OperatorPanel() {
  const nav = useNavigate();

  return (
    <div className="operator-panel">
      <h2>Panel operatora</h2>

      <div className="panel-grid">

        <button className="panel-btn" onClick={() => nav("/operator/intake")}>
          Przyjęcia
        </button>

        <button className="panel-btn" onClick={() => nav("/operator/unload")}>
          Rozładunek
        </button>

        <button className="panel-btn" onClick={() => nav("/operator/issue")}>
          Wydania
        </button>

        <button className="panel-btn" onClick={() => nav("/operator/correction")}>
          Korekty
        </button>

        <button className="panel-btn" onClick={() => nav("/operator/transfer")}>
          Przerzuty
        </button>

      </div>
    </div>
  );
}
