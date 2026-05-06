import { useEffect, useState } from "react";
import localDB from "../db/pouchdb";
import { getFactor, tonsToMeters, getBottomAge } from "../utils/grainCalculations";
import "./Reports.css";

export default function SiloReport({ komora }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const siloId = `silo_${komora}`;
    
    const fetchSiloData = async () => {
      try {
        const doc = await localDB.get(siloId);
        setData(doc);
      } catch (err) {
        console.error("Błąd pobierania danych komory:", err);
      }
    };

    fetchSiloData();
    
    const changes = localDB
      .changes({
        since: "now",
        live: true,
        doc_ids: [siloId],
        include_docs: true,
      })
      .on("change", (change) => setData(change.doc));

    return () => changes.cancel();
  }, [komora]);

  if (!data) {
    return <div className="loader">Wybierz komorę lub czekaj na dane...</div>;
  }

  const layers = data.layers || [];
  const totalWeight = layers.reduce((sum, l) => sum + (l.amount || 0), 0);
  const siloType = komora.slice(-1);
  const currentHeight = tonsToMeters(totalWeight, data.grainType, siloType);
  const age = getBottomAge(layers);

  return (
    <div className="report-box silo-detail-report">
      <div className="report-header">
        <h3>Szczegóły Komory {komora}</h3>
        <span className={`status-badge ${age > 30 ? "alert" : "ok"}`}>
          {age > 30 ? `ALARM: ${age} dni` : `Spód: ${age} dni`}
        </span>
      </div>

      <div className="report-grid">
        <div className="report-section">
          <h4>Parametry Ogólne</h4>
          <p>
            <strong>Towar:</strong> {data.grainType || "Brak"}
          </p>
          <p>
            <strong>Masa łączna:</strong> {totalWeight.toFixed(1)} t
          </p>
          <p>
            <strong>Wysokość zasypu:</strong> {currentHeight} m
          </p>
        </div>

        <div className="report-section">
          <h4>Struktura Zasypu (LIFO)</h4>
          <div className="layers-stack">
            {layers.length === 0 ? (
              <p>Komora pusta</p>
            ) : (
              [...layers].reverse().map((layer, index) => (
                <div
                  key={index}
                  className={`layer-item ${
                    index === layers.length - 1 ? "bottom-layer" : ""
                  }`}
                >
                  <div className="layer-info">
                    <span className="layer-date">
                      {new Date(layer.date).toLocaleDateString()}
                    </span>
                    <span className="layer-weight">{layer.amount} t</span>
                  </div>
                  <div className="layer-param">
                    {layer.qualityParam
                      ? `Parametr: ${layer.qualityParam}`
                      : "Brak danych jakościowych"}
                  </div>
                  {index === layers.length - 1 && (
                    <div className="bottom-marker">DNO (LIFO)</div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="report-footer-actions">
        <button className="action-btn" onClick={() => window.print()}>
          Drukuj Kartę Komory
        </button>
        <button className="action-btn secondary">Historia Przerzutów</button>
      </div>
    </div>
  );
}
