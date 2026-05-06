import React, { useState } from "react";

export default function GroupEditor() {
  const [groups, setGroups] = useState([
    { id: "G1", name: "Grupa 1", cells: ["S1", "S2", "S3"] },
    { id: "G2", name: "Grupa 2", cells: ["N1", "N2"] },
  ]);

  const [selected, setSelected] = useState(null);

  return (
    <div className="text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Edytor grup komórek</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map((g) => (
          <div
            key={g.id}
            onClick={() => setSelected(g)}
            className="p-4 bg-zinc-800 rounded-xl border border-zinc-700 hover:border-amber-400 cursor-pointer"
          >
            <h2 className="text-xl font-semibold">{g.name}</h2>
            <p className="text-zinc-400">Komórki: {g.cells.join(", ")}</p>
          </div>
        ))}
      </div>

      {selected && (
        <div className="mt-10 p-6 bg-zinc-900 rounded-xl border border-zinc-700">
          <h2 className="text-2xl font-bold mb-4">
            Edycja grupy: {selected.name}
          </h2>

          <p className="text-zinc-400 mb-4">
            Tu możesz dodać edycję komórek, nazwy, kolorów itd.
          </p>

          <button
            onClick={() => setSelected(null)}
            className="px-6 py-3 bg-amber-500 text-black rounded-lg font-bold hover:scale-105 transition"
          >
            Zamknij
          </button>
        </div>
      )}
    </div>
  );
}
