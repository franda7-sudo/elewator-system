// src/Operator/OperatorHome.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useElevator } from "../context/ElevatorContext";
import "./OperatorsPanel.css";

export default function OperatorHome() {
  const nav = useNavigate();
  const { operator, cells } = useElevator();

  const totalCells = cells.length;
  const filledCells = cells.filter(c => (c.waga || 0) > 0).length;
  const emptyCells = totalCells - filledCells;

  return (
    <div className="op-mobile-main">
      <h2 style={{ marginBottom: 20 }}>Panel operatora</h2>

      {/* Operator info */}
      <div
        style={{
          background: "#222",
          padding: 16,
          borderRadius: 10,
          marginBottom: 20,
          color: "#fff",
        }}
      >
        <div style={{ fontSize: 18, marginBottom: 6 }}>
          👷 Zalogowany: <b>{operator?.name}</b>
        </div>
        <div style={{ fontSize: 14, opacity: 0.8 }}>
          PIN: {operator?.pin}
        </div>
      </div>

      {/* Szybkie statystyki */}
      <div
        style={{
          background: "#1a1a1d",
          padding: 16,
          borderRadius: 10,
          marginBottom: 20,
          color: "#fff",
        }}
      >
        <div style={{ marginBottom: 6 }}>📦 Komory: <b>{totalCells}</b></div>
        <div style={{ marginBottom: 6 }}>🟩 Pełne: <b>{filledCells}</b></div>
        <div>⬜ Puste: <b>{emptyCells}</b></div>
      </div>

      {/* Szybkie akcje */}
      <div className="op-mobile-nav">
        <button className="btn-intake" onClick={() => nav("/operator/intake")}>
          ➕ Przyjęcia
        </button>

        <button className="btn-unload" onClick={() => nav("/operator/unload")}>
          📥 Rozładunek
        </button>

        <button className="btn-transfer" onClick={() => nav("/operator/transfer")}>
          🔄 Przerzuty
        </button>

        <button className="btn-correction" onClick={() => nav("/operator/correction")}>
          📝 Korekty
        </button>

        <button
          style={{ background: "#444", color: "#fff" }}
          onClick={() => nav("/operator/issue")}
        >
          📤 Wydania
        </button>

        <button
          style={{ background: "#333", color: "#fff" }}
          onClick={() => nav("/operator/live")}
        >
          📊 Podgląd LIVE
        </button>
      </div>
    </div>
  );
}
