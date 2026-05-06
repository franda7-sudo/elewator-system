import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

const ALL_PARAMS = [
  { id: "bialko", name: "Białko", unit: "%" },
  { id: "gluten", name: "Gluten", unit: "%" },
  { id: "wilgotnosc", name: "Wilgotność", unit: "%" },
  { id: "gestosc", name: "Gęstość", unit: "kg/hl" },
  { id: "opadanie", name: "Liczba opadania", unit: "s" },
  { id: "zanieczyszczenia", name: "Zanieczyszczenia", unit: "%" },
  { id: "uszkodzenia", name: "Uszkodzenia", unit: "%" },
  { id: "szklistosc", name: "Szklistość", unit: "%" },
  { id: "temperatura", name: "Temperatura", unit: "°C" }
];

export default function QualityEditor() {
  const [grains, setGrains] = useState([]);
  const [grainId, setGrainId] = useState("");
  const [params, setParams] = useState({});

  // --- 1. Pobieranie listy zbóż ---
  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "grains"));
      const list = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      setGrains(list);
    };
    load();
  }, []);

  // --- 2. Pobieranie parametrów dla wybranego zboża ---
  useEffect(() => {
    if (!grainId) return;

    const loadParams = async () => {
      const snap = await getDocs(collection(db, "grains", grainId, "parameters"));
      const data = {};
      snap.forEach(d => data[d.id] = d.data());
      setParams(data);
    };

    loadParams();
  }, [grainId]);

  // --- 3. Aktualizacja parametru ---
  const update = (id, field, value) => {
    setParams(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  // --- 4. Zapis parametrów ---
  const save = async () => {
    if (!grainId) {
      alert("Wybierz zboże.");
      return;
    }

    for (const p of ALL_PARAMS) {
      await setDoc(
        doc(db, "grains", grainId, "parameters", p.id),
        params[p.id] || { active: false },
        { merge: true }
      );
    }

    alert("Zapisano parametry.");
  };

  return (
    <div className="text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Parametry jakości</h1>

      {/* --- WYBÓR ZBOŻA --- */}
      <select
        value={grainId}
        onChange={e => setGrainId(e.target.value)}
        className="bg-zinc-800 text-white p-3 rounded-lg mb-6"
      >
        <option value="">Wybierz nowe zboże</option>
        {grains.map(g => (
          <option key={g.id} value={g.id}>
            {g.name || g.id}
          </option>
        ))}
      </select>

      {/* --- LISTA PARAMETRÓW --- */}
      {grainId && (
        <div className="space-y-4">
          {ALL_PARAMS.map(p => {
            const row = params[p.id] || {};

            return (
              <div
                key={p.id}
                className="flex items-center gap-4 bg-zinc-900 p-4 rounded-lg border border-zinc-700"
              >
                <input
                  type="checkbox"
                  checked={row.active || false}
                  onChange={e => update(p.id, "active", e.target.checked)}
                  className="scale-150"
                />

                <div className="w-48">{p.name}</div>

                {row.active && (
                  <>
                    <input
                      type="number"
                      placeholder="min"
                      value={row.min || ""}
                      onChange={e => update(p.id, "min", parseFloat(e.target.value))}
                      className="bg-zinc-800 text-white p-2 rounded w-24"
                    />

                    <input
                      type="number"
                      placeholder="max"
                      value={row.max || ""}
                      onChange={e => update(p.id, "max", parseFloat(e.target.value))}
                      className="bg-zinc-800 text-white p-2 rounded w-24"
                    />

                    <span className="text-zinc-400">{p.unit}</span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* --- ZAPIS --- */}
      {grainId && (
        <button
          onClick={save}
          className="mt-6 px-6 py-3 bg-amber-500 text-black rounded-lg font-bold hover:scale-105 transition"
        >
          Zapisz parametry
        </button>
      )}
    </div>
  );
}
