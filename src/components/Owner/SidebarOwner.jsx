import React from "react";

export default function SidebarOwner({ setView, view }) {
  const btn = (id, label) => (
    <button
      onClick={() => setView(id)}
      className={`w-full text-left px-6 py-4 text-lg font-semibold 
        ${view === id ? "bg-amber-500 text-black" : "hover:bg-zinc-700"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-64 bg-zinc-800 border-r border-zinc-700 flex flex-col">
      <h2 className="text-2xl font-bold p-6 border-b border-zinc-700">
        Owner Panel
      </h2>

      {btn("dashboard", "Dashboard")}
      {btn("map", "Mapa Elewatora")}
      {btn("users", "Użytkownicy")}
      {btn("stats", "Statystyki")}
    </div>
  );
}
