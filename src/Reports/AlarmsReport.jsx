import { useEffect, useState } from "react";
import localDB from "../db/pouchdb";
import { getBottomAge } from "../utils/grainCalculations";
import "./Reports.css";

export default function AlarmsReport() {
  const [alarms, setAlarms] = useState([]);

  useEffect(() => {
    const fetchAlarms = async () => {
      try {
        const result = await localDB.allDocs({ include_docs: true, startkey: 'silo_', endkey: 'silo_\uffff' });
        const detectedAlarms = [];

        result.rows.forEach(row => {
          const silo = row.doc;
          const layers = silo.layers || [];
          
          // 1. Sprawdzanie zalegania spodu (Twoje LIFO)
          const age = getBottomAge(layers);
          if (age > 30) {
            detectedAlarms.push({
              komora: silo._id.replace('silo_', ''),
              typ: "ZALEGANIE",
              wiadomosc: `Towar na dnie zalega od ${age} dni!`,
              poziom: "ALARM"
            });
          }

          // 2. Sprawdzanie przepełnienia (na podstawie Twoich metrów)
          // Tutaj można dodać logikę: if (currentHeight > maxHeight) ...

        });

        setAlarms(detectedAlarms);
      } catch (err) {
        console.error("Błąd generowania raportu:", err);
      }
    };

    fetchAlarms();
    // Nasłuch na żywo, żeby raport sam się aktualizował
    const changes = localDB.changes({ since: 'now', live: true }).on('change', fetchAlarms);
    return () => changes.cancel();
  }, []);

  return (
    <div className="report-box">
      <div className="report-header">
        <h3>Raport Krytyczny - Alarmy Spodu</h3>
        <span className="badge-count">{alarms.length}</span>
      </div>

      {alarms.length === 0 ? (
        <div className="no-alarms">✅ Wszystkie komory są w ruchu. Brak zalegań.</div>
      ) : (
        <div className="alarms-list">
          {alarms.map((a, i) => (
            <div key={i} className={`alarm-card ${a.poziom.toLowerCase()}`}>
              <div className="alarm-icon">⚠️</div>
              <div className="alarm-content">
                <strong>Komora {a.komora}</strong>
                <p>{a.wiadomosc}</p>
              </div>
              <button className="btn-action-small">Planuj przerzut</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}