import React from "react";
import { useNavigate } from "react-router-dom";
import "./OperatorPanel.css";

export default function OperatorPanel() {
  const navigate = useNavigate();

  return (
    <div className="operator-panel-wrapper">
      <h2 className="operator-title">Panel Operatora</h2>

      <div className="operator-buttons">
        <button
          className="op-btn op-intake"
          onClick={() => navigate("/operator/intake")}
        >
          ➕ Przyjęcia
        </button>

        <button
          className="op-btn op-unload"
          onClick={() => navigate("/operator/unload")}
        >
          📥 Rozładunek
        </button>

        <button
          className="op-btn op-issue"
          onClick={() => navigate("/operator/issue")}
        >
          📤 Wydania
        </button>

        <button
          className="op-btn op-correction"
          onClick={() => navigate("/operator/corrections")}
        >
          ⚖ Korekty
        </button>

        <button
          className="op-btn op-transfer"
          onClick={() => navigate("/operator/transfers")}
        >
          🔄 Przerzuty
        </button>
      </div>
    </div>
  );
}
