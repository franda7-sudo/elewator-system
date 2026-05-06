import React from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminHome() {
  return (
    <div className="admin-dashboard">
      <h1>Panel Administracyjny</h1>

      <div className="modules-grid">

        <Link to="/admin/map" className="module-tile">
          <h2>Mapa Elewatora</h2>
          <p>Podgląd komór, zasypów, wydań i parametrów.</p>
        </Link>

        <Link to="/admin/parametry" className="module-tile">
          <h2>Parametry jakości</h2>
          <p>Edycja parametrów zbóż i jednostek.</p>
        </Link>

        <Link to="/admin/reports" className="module-tile">
          <h2>Raporty</h2>
          <p>Analizy, zestawienia, statystyki.</p>
        </Link>

        <Link to="/admin/history" className="module-tile">
          <h2>Historia</h2>
          <p>Rejestr operacji, zasypów i wydań.</p>
        </Link>

        <Link to="/admin/alarms" className="module-tile">
          <h2>Alarmy</h2>
          <p>Temperatura, wilgotność, Dallas, awarie.</p>
        </Link>

        <Link to="/admin/lab" className="module-tile">
          <h2>Laboratorium</h2>
          <p>Wyniki badań i pomiary jakości.</p>
        </Link>

        <Link to="/admin/settings" className="module-tile">
          <h2>Ustawienia</h2>
          <p>Konfiguracja systemu i użytkowników.</p>
        </Link>

      </div>
    </div>
  );
}
