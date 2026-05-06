import React, { useState, useEffect } from "react";
import { useElevator } from "../../context/ElevatorContext";
import Map from "./Map/Map";
import "./SuperUserPanel.css";

export default function SuperUserPanel() {
  const { pendingDeliveries, confirmUnload } = useElevator();

  const [activeTab, setActiveTab] = useState("approvals");

  const requiresAdmin = pendingDeliveries.filter(
    (d) => d.status === "requires_admin"
  );

  useEffect(() => {
    if (requiresAdmin.length > 0) {
      new Audio("/alert.mp3").play();
    }
  }, [requiresAdmin]);

  return (
    <div className="superuser-container">
      <header className="superuser-header">
        <h1>Panel Kierownika</h1>

        <nav>
          <button 
            onClick={() => setActiveTab("approvals")}
            className={activeTab === "approvals" ? "active" : ""}
          >
            Dostawy ({requiresAdmin.length})
          </button>

          <button 
            onClick={() => setActiveTab("map")}
            className={activeTab === "map" ? "active" : ""}
          >
            Mapa
          </button>

          {/* 🔥 POPRAWIONE — otwiera panel raportów */}
          <button 
            onClick={() => window.location.href = "/admin/reports"}
            className={activeTab === "reports" ? "active" : ""}
          >
            Raporty
          </button>
        </nav>
      </header>

      {activeTab === "approvals" && (
        <div className="approvals-tab">
          <h2>Dostawy wymagające zatwierdzenia</h2>

          {requiresAdmin.length === 0 && (
            <div className="empty">Brak dostaw do zatwierdzenia.</div>
          )}

          {requiresAdmin.map((d) => (
            <div 
              key={d.firestoreId}
              className={`delivery-card ${d.qualityStatus === "nienormatywna" ? "danger" : ""}`}
            >
              <h3>Dostawa {d.id}</h3>
              <p><b>Zboże:</b> {d.grain}</p>
              <p><b>Waga:</b> {d.amount} t</p>
              <p><b>Komora:</b> {d.cell}</p>
              <p><b>Powód:</b> {d.reason}</p>
              <p><b>Operator:</b> {d.operator}</p>

              <button 
                className="approve"
                onClick={() => confirmUnload(d)}
              >
                ✔ Zatwierdź i rozładuj
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === "map" && (
        <div className="map-tab">
          <h2>Mapa Elewatora (podgląd)</h2>
          <Map />
        </div>
      )}

      {activeTab === "reports" && (
        <div className="reports-tab">
          <h2>Raporty</h2>

          {/* 🔥 Otwiera PDF mapy */}
          <button
            className="go-to-reports"
            onClick={() => window.open("/admin/reports/map", "_blank")}
          >
            🗺️ Raport mapy (PDF A4)
          </button>
        </div>
      )}
    </div>
  );
}
