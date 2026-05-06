import React from "react";

export default function TooltipCell({ cell, role }) {
  if (!cell) return null;
  return (
    <div className="bg-zinc-800 text-white p-4 rounded-xl border border-zinc-700 shadow-lg">
      <h3 className="text-lg font-bold mb-2">Komórka {cell.id}</h3>
      <p>Ziarno: {cell.grain || "—"}</p>
      <p>Waga: {cell.waga ? `${cell.waga} t` : "—"}</p>
      <p>Wilgotność: {cell.wilgotnosc || "—"}%</p>
      <p>Temperatura: {cell.temp || "—"}°C</p>
      <p>Rola: {role}</p>
    </div>
  );
}
