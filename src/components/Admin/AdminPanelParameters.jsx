import React, { useState } from "react";

export default function AdminPanelParameters() {
  const [selected, setSelected] = useState(null);

  const parameters = [
    { id: "wilgotnosc", name: "Wilgotność", unit: "%" },
    { id: "białko", name: "Białko", unit: "%" },
    { id: "gluten", name: "Gluten", unit: "%" },
    { id: "gęstość", name: "Gęstość", unit: "kg/hl" },
  ];

  return (
    <div className="text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Parametry ziarna</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {parameters.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelected(p)}
            className="p-4 bg-zinc-800 rounded-xl border border-zinc-700 hover:border-amber-400 cursor-pointer"
          >
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <p className="text-zinc-400">Jednostka: {p.unit}</p>
          </div>
        ))}
      </div>

      {selected && (
        <div className="mt-10 p-6 bg-zinc-900 rounded-xl border border-zinc-700">
          <h2 className="text-2xl font-bold mb-4">
            Edycja parametru: {selected.name}
          </h2>

          <p className="text-zinc-400 mb-4">
            Tu możesz dodać pola min/max, kolory, progi alarmowe itd.
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
