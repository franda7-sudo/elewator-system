import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";

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

export default function GrainParameters({ grainId }) {
  const [params, setParams] = useState({});

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "grains", grainId, "parameters"));
      const data = {};
      snap.forEach(d => data[d.id] = d.data());
      setParams(data);
    };
    load();
  }, [grainId]);

  const update = (id, field, value) => {
    setParams(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const save = async () => {
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
    <div>
      <h2>Parametry zboża</h2>

      {ALL_PARAMS.map(p => {
        const row = params[p.id] || {};
        return (
          <div key={p.id} className="param-row">
            <label>
              <input
                type="checkbox"
                checked={row.active || false}
                onChange={e => update(p.id, "active", e.target.checked)}
              />
              {p.name}
            </label>

            {row.active && (
              <>
                <input
                  type="number"
                  placeholder="min"
                  value={row.min || ""}
                  onChange={e => update(p.id, "min", parseFloat(e.target.value))}
                />
                <input
                  type="number"
                  placeholder="max"
                  value={row.max || ""}
                  onChange={e => update(p.id, "max", parseFloat(e.target.value))}
                />
                <input
                  type="number"
                  placeholder="priorytet"
                  value={row.priority || ""}
                  onChange={e => update(p.id, "priority", parseInt(e.target.value))}
                />
              </>
            )}
          </div>
        );
      })}

      <button onClick={save}>Zapisz parametry</button>
    </div>
  );
}
