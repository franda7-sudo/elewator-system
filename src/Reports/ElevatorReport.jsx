import { useEffect, useState } from "react";
import localDB from "../db/pouchdb";
import { getFactor } from "../utils/grainCalculations";
import "./Reports.css";

export default function ElevatorReport() {
  const [totals, setTotals] = useState({
    grains: {}, // Sumy na gatunek
    totalTons: 0,
    totalMeters: 0,
    alertsCount: 0,
    freeCapacity: 0
  });

  useEffect(() => {
    const calculateTotals = async () => {
      try {
        const result = await localDB.allDocs({ include_docs: true, startkey: 'silo_', endkey: 'silo_\uffff' });
        
        let totalT = 0;
        let grainMap = {};
        let alarms = 0;

        result.rows.forEach(row => {
          const silo = row.doc;
          const layers = silo.layers || [];
          const siloWeight = layers.reduce((sum, l) => sum + (l.amount || 0), 0);
          const grain = silo.grainType || "PUSTE";

          // Sumowanie per gatunek
          if (siloWeight > 0) {
            if (!grainMap[grain]) grainMap[grain] = 0;
            grainMap[grain] += siloWeight;
          }

          totalT += siloWeight;

          // Liczenie alarmów spodu (LIFO > 30 dni)
          if (layers.length > 0) {
            const age = Math.floor((new Date() - new Date(layers[0].date)) / (1000*60*60*24));
            if (age > 30) alarms++;
          }
        });

        setTotals({
          grains: grainMap,
          totalTons: totalT,
          alertsCount: alarms,
          // Założenie: całkowita pojemność elewatora to ok. 10 000t (do doprecyzowania)
          freeCapacity: 10000 - totalT 
        });
      } catch (err) {
        console.error("Błąd raportu zbiorczego:", err);
      }
    };

    calculateTotals();
    const changes = localDB.changes({ since: 'now', live: true }).on('change', calculateTotals);
    return () => changes.cancel();
  }, []);

  return (
    <div className="report-box main-summary">
      <div className="report-header">
        <h3>Stan Magazynowy Elewatora</h3>
        <div className="total-badge">{totals.totalTons.toFixed(1)} t</div>
      </div>

      <div className="report-grid">
        {/* Sekcja 1: Podział na gatunki */}
        <div className="report-card">
          <h4>Podział na towary</h4>
          {Object.entries(totals.grains).map(([grain, weight]) => (
            <div key={grain} className="grain-row">
              <span>{grain}</span>
              <strong>{weight.toFixed(1)} t</strong>
            </div>
          ))}
        </div>

        {/* Sekcja 2: Wykorzystanie powierzchni */}
        <div className="report-card highlight">
          <h4>Pojemność</h4>
          <div className="stat-row">
            <span>Wolne miejsce:</span>
            <span className="green">ok. {totals.freeCapacity.toFixed(0)} t</span>
          </div>
          <div className="progress-mini">
            <div className="bar" style={{ width: `${(totals.totalTons / 10000) * 100}%` }}></div>
          </div>
        </div>

        {/* Sekcja 3: Krytyczne info */}
        <div className="report-card alert">
          <h4>Status operacyjny</h4>
          <div className="stat-row">
            <span>Komory wymagające ruchu:</span>
            <span className={totals.alertsCount > 0 ? "red-text" : ""}>{totals.alertsCount}</span>
          </div>
          <p className="hint">Dotyczy komór z zaleganiem spodu > 30 dni.</p>
        </div>
      </div>

      <button className="action-btn secondary" onClick={() => window.print()}>
        Generuj arkusz wysyłkowy
      </button>
    </div>
  );
}