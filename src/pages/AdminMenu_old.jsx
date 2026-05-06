import React from "react";
import "./AdminPanel.css";

export default function AdminMenu({ view, setView }) {
  const Item = (id, label) => (
    <div
      className={`menu-item ${view === id ? "active" : ""}`}
      onClick={() => setView(id)}
    >
      {label}
    </div>
  );

  return (
    <div className="admin-menu">
      <div className="menu-title">Panel Admina</div>

      {Item("elewator", "Mapa Elewatora")}
      {Item("lab", "Laboratorium")}
      {Item("reports", "Raporty")} {/* Nowa pozycja w menu */}
      {Item("history", "Historia")}
      {Item("alarms", "Alarmy")}
      {Item("settings", "Ustawienia")}
    </div>
  );
}