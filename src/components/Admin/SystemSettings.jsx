import React, { useState } from "react";
import "./AdminSettings.css";

export default function AdminSettings() {
  const [defaultWeight, setDefaultWeight] = useState(26);
  const [nightMode, setNightMode] = useState(false);
  const [soundAlerts, setSoundAlerts] = useState(true);

  return (
    <div className="admin-settings-wrapper">
      <h2>Ustawienia Systemu</h2>

      <section className="settings-section">
        <h3>Ogólne</h3>

        <label className="settings-row">
          <span>Domyślna waga dostawy:</span>
          <input
            type="number"
            value={defaultWeight}
            onChange={(e) => setDefaultWeight(Number(e.target.value))}
          />
        </label>

        <label className="settings-row">
          <span>Tryb nocny panelu:</span>
          <input
            type="checkbox"
            checked={nightMode}
            onChange={(e) => setNightMode(e.target.checked)}
          />
        </label>

        <label className="settings-row">
          <span>Alarmy dźwiękowe:</span>
          <input
            type="checkbox"
            checked={soundAlerts}
            onChange={(e) => setSoundAlerts(e.target.checked)}
          />
        </label>
      </section>

      <section className="settings-section">
        <h3>Jakość (w przygotowaniu)</h3>
        <p>Konfiguracja grup jakości pojawi się tutaj.</p>
      </section>

      <section className="settings-section">
        <h3>Komory (w przygotowaniu)</h3>
        <p>Parametry komór i profile zboża pojawią się tutaj.</p>
      </section>
    </div>
  );
}
