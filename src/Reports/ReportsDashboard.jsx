import React from "react";
import { Link } from "react-router-dom";
import "./Reports.css";

export default function ReportsDashboard() {
  const tile = `
    p-8 rounded-xl border border-zinc-700 
    bg-[#0f0f17] 
    hover:bg-[#1a1a25] 
    transition-all 
    cursor-pointer 
    shadow-[0_0_15px_rgba(0,255,255,0.08)]
    hover:shadow-[0_0_25px_rgba(0,255,255,0.25)]
    hover:-translate-y-1
  `;

  const header = "text-3xl font-bold mb-2 tracking-wide";
  const desc = "text-zinc-400 text-lg";

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-10">
      <h1 className="text-5xl font-extrabold mb-12 tracking-wide text-cyan-300 drop-shadow-[0_0_10px_rgba(0,255,255,0.4)]">
        ⚙️ CENTRUM RAPORTOWE — SCADA PRO
      </h1>

      {/* ============================
          🔵 OPERACYJNE
      ============================ */}
      <h2 className="text-3xl font-bold text-blue-300 mb-6 tracking-wide">
        OPERACYJNE
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">

        <Link to="/admin/reports/intake" className={tile}>
          <h2 className={`${header} text-green-300`}>📥 PRZYJĘCIA</h2>
          <p className={desc}>Lista przyjęć + PDF</p>
        </Link>

        <Link to="/admin/reports/release" className={tile}>
          <h2 className={`${header} text-red-300`}>📤 WYDANIA</h2>
          <p className={desc}>Lista wydań + PDF</p>
        </Link>

        <Link to="/admin/reports/movements" className={tile}>
          <h2 className={`${header} text-blue-300`}>🚛 RUCHY MAGAZYNOWE</h2>
          <p className={desc}>Przyjęcia, wydania, przesypy</p>
        </Link>

        <Link to="/admin/reports/fill-history" className={tile}>
          <h2 className={`${header} text-yellow-300`}>📜 HISTORIA ZASYPÓW</h2>
          <p className={desc}>Zasypy i korekty</p>
        </Link>

      </div>

      {/* ============================
          🟢 STANY
      ============================ */}
      <h2 className="text-3xl font-bold text-green-300 mb-6 tracking-wide">
        STANY
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">

        <Link to="/admin/reports/cells" className={tile}>
          <h2 className={`${header} text-amber-300`}>🏗️ KOMORY</h2>
          <p className={desc}>Stan komór + PDF</p>
        </Link>

        <Link to="/admin/reports/grain" className={tile}>
          <h2 className={`${header} text-lime-300`}>🌾 ZBOŻA</h2>
          <p className={desc}>Zestawienie wg typu zboża</p>
        </Link>

        <Link to="/admin/reports/tonnage" className={tile}>
          <h2 className={`${header} text-cyan-300`}>⚖️ TONAŻ</h2>
          <p className={desc}>Bilans przyjęć, wydań i komór</p>
        </Link>

        <Link to="/admin/reports/snapshot" className={tile}>
          <h2 className={`${header} text-purple-300`}>🗂️ SNAPSHOT</h2>
          <p className={desc}>Stan wszystkich komór</p>
        </Link>

      </div>

      {/* ============================
          🟡 JAKOŚĆ
      ============================ */}
      <h2 className="text-3xl font-bold text-yellow-300 mb-6 tracking-wide">
        JAKOŚĆ
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">

        <Link to="/admin/reports/quality" className={tile}>
          <h2 className={`${header} text-yellow-300`}>🧪 JAKOŚĆ</h2>
          <p className={desc}>Parametry jakościowe zasypów</p>
        </Link>

        <Link to="/admin/reports/temperature" className={tile}>
          <h2 className={`${header} text-orange-300`}>🌡️ DALLAS</h2>
          <p className={desc}>Temperatury czujników</p>
        </Link>

      </div>

      {/* ============================
          🔴 SYSTEMOWE
      ============================ */}
      <h2 className="text-3xl font-bold text-red-300 mb-6 tracking-wide">
        SYSTEMOWE
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">

        <Link to="/admin/reports/alarms" className={tile}>
          <h2 className={`${header} text-red-300`}>⚠️ ALARMY</h2>
          <p className={desc}>Lista alarmów</p>
        </Link>

        <Link to="/admin/reports/fifo" className={tile}>
          <h2 className={`${header} text-green-300`}>🔄 FIFO</h2>
          <p className={desc}>Rotacja zasypów</p>
        </Link>

        <Link to="/admin/reports/elevator" className={tile}>
          <h2 className={`${header} text-lime-300`}>🏗️ ELEWATOR</h2>
          <p className={desc}>Stan urządzeń</p>
        </Link>

      </div>

      {/* ============================
          🔵 MAPY I WIZUALIZACJE
      ============================ */}
      <h2 className="text-3xl font-bold text-blue-300 mb-6 tracking-wide">
        MAPY I WIZUALIZACJE
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

        <Link to="/admin/reports/fill-map" className={tile}>
          <h2 className={`${header} text-cyan-300`}>🗺️ MAPA ZASYPU PDF</h2>
          <p className={desc}>Wizualizacja + eksport A4</p>
        </Link>

        <Link to="/admin/reports/map" className={tile}>
          <h2 className={`${header} text-blue-300`}>🗺️ RAPORT MAPY</h2>
          <p className={desc}>Mapa elewatora</p>
        </Link>

      </div>
    </div>
  );
}
