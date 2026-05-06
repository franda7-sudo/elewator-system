import React from "react";
import { Link } from "react-router-dom";

export default function AdminSettings() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white p-10">
      <h1 className="text-4xl font-bold mb-10">Ustawienia systemu</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 🔧 Uprawnienia użytkowników */}
        <Link
          to="/admin/settings/permissions"
          className="p-6 bg-zinc-800 rounded-lg border border-zinc-700 hover:bg-zinc-700 transition cursor-pointer"
        >
          <h2 className="text-2xl font-bold text-amber-400 mb-2">
            Uprawnienia użytkowników
          </h2>
          <p className="text-zinc-400">
            Zarządzanie rolami: operator, superuser, admin, owner.
          </p>
        </Link>

        {/* 📊 Raporty */}
        <Link
          to="/admin/reports"
          className="p-6 bg-zinc-800 rounded-lg border border-zinc-700 hover:bg-zinc-700 transition cursor-pointer"
        >
          <h2 className="text-2xl font-bold text-blue-400 mb-2">
            Raporty
          </h2>
          <p className="text-zinc-400">
            Dostęp do raportów FIFO, temperatur, alarmów, historii napełnień i innych.
          </p>
        </Link>

        {/* ⚙️ Ustawienia techniczne (opcjonalne) */}
        <div className="p-6 bg-zinc-800 rounded-lg border border-zinc-700 opacity-40 cursor-not-allowed">
          <h2 className="text-2xl font-bold text-green-400 mb-2">
            Ustawienia techniczne
          </h2>
          <p className="text-zinc-500">
            (Moduł w przygotowaniu)
          </p>
        </div>

      </div>
    </div>
  );
}
