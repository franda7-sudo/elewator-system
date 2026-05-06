import { useState } from "react";
import ElevatorOverview from "./ElevatorOverview/ElevatorOverview";
import MovementsHistory from "./Movements/MovementsHistory";
import MovementForm from "./Movements/MovementForm";
import ReportsDashboard from "./Reports/ReportsDashboard";
import AlarmsReport from "./Reports/AlarmsReport";
import "./AppLayout.css";

export default function AppLayout() {
  const [activeTab, setActiveTab] = useState("mapa"); // mapa | ruchy | raporty | alarmy
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`app-layout ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      {/* SIDEBAR - Nawigacja */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">🌾 ELEWATOR v2</div>
          <button className="toggle-btn" onClick={() => setSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? "«" : "»"}
          </button>
        </div>

        <nav className="menu">
          <button 
            className={`menu-item ${activeTab === "mapa" ? "active" : ""}`}
            onClick={() => setActiveTab("mapa")}
          >
            <span className="icon">🏗️</span> {isSidebarOpen && "Mapa Silosów"}
          </button>
          
          <button 
            className={`menu-item ${activeTab === "ruchy" ? "active" : ""}`}
            onClick={() => setActiveTab("ruchy")}
          >
            <span className="icon">🚛</span> {isSidebarOpen && "Nowy Ruch"}
          </button>

          <button 
            className={`menu-item ${activeTab === "historia" ? "active" : ""}`}
            onClick={() => setActiveTab("historia")}
          >
            <span className="icon">📖</span> {isSidebarOpen && "Dziennik Wagowy"}
          </button>

          <button 
            className={`menu-item ${activeTab === "raporty" ? "active" : ""}`}
            onClick={() => setActiveTab("raporty")}
          >
            <span className="icon">📊</span> {isSidebarOpen && "Raporty / LIFO"}
          </button>
        </nav>

        <div className="sidebar-footer">
          {isSidebarOpen && <span className="status-online">● System Online (PouchDB)</span>}
        </div>
      </aside>

      {/* GŁÓWNA TREŚĆ */}
      <main className="content">
        <header className="top-bar">
          <h2>{activeTab.toUpperCase()}</h2>
          <div className="user-info">Operator: Zmiana A</div>
        </header>

        <section className="view-container">
          {activeTab === "mapa" && <ElevatorOverview />}
          
          {activeTab === "ruchy" && (
            <div className="flex-center">
              <MovementForm type="przyjecie" komoraIn="Wybierz..." onClose={() => setActiveTab("mapa")} />
            </div>
          )}

          {activeTab === "historia" && <MovementsHistory />}
          
          {activeTab === "raporty" && <ReportsDashboard onSelect={(type) => console.log("Wybrano raport:", type)} />}
        </section>
      </main>
    </div>
  );
}