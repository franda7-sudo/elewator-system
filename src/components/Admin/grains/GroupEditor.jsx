import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  setDoc
} from "firebase/firestore";
import { db } from "../../../firebase";
import "./Grains.css";

export default function GroupEditor({ grainId, group }) {
  const groupId = group.id;
  const [params, setParams] = useState([]);
  const [ranges, setRanges] = useState({}); // paramId -> {min, max}

  // 1. Pobierz listę parametrów zboża
  useEffect(() => {
    const ref = collection(db, "grains", grainId, "parameters");
    const unsub = onSnapshot(ref, (snap) => {
      setParams(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [grainId]);

  // 2. Pobierz zakresy min–max dla tej grupy
  useEffect(() => {
    const ref = collection(
      db,
      "grains",
      grainId,
      "groups",
      groupId,
      "parameters"
    );

    const unsub = onSnapshot(ref, (snap) => {
      const r = {};
      snap.docs.forEach((d) => {
        r[d.id] = d.data();
      });
      setRanges(r);
    });

    return () => unsub();
  }, [grainId, groupId]);

  // 3. Aktualizacja min–max
  const updateRange = async (paramId, patch) => {
    const ref = doc(
      db,
      "grains",
      grainId,
      "groups",
      groupId,
      "parameters",
      paramId
    );

    const current = ranges[paramId] || {};

    await setDoc(ref, { ...current, ...patch }, { merge: true });
  };

  return (
    <div className="group-editor">
      <h3>
        Zakresy parametrów — grupa <strong>{group.label}</strong>
      </h3>

      <table className="grain-params-table">
        <thead>
          <tr>
            <th>Parametr</th>
            <th>Min</th>
            <th>Max</th>
          </tr>
        </thead>

        <tbody>
          {params.map((p) => {
            const r = ranges[p.id] || {};

            return (
              <tr key={p.id}>
                <td>
                  {p.short || p.name}{" "}
                  <span style={{ opacity: 0.6 }}>({p.unit})</span>
                </td>

                <td>
                  <input
                    type="number"
                    step="0.01"
                    value={r.min ?? ""}
                    onChange={(e) =>
                      updateRange(p.id, {
                        min: e.target.value === "" ? null : parseFloat(e.target.value)
                      })
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    step="0.01"
                    value={r.max ?? ""}
                    onChange={(e) =>
                      updateRange(p.id, {
                        max: e.target.value === "" ? null : parseFloat(e.target.value)
                      })
                    }
                  />
                </td>
              </tr>
            );
          })}

          {params.length === 0 && (
            <tr>
              <td colSpan={3} style={{ textAlign: "center", opacity: 0.7 }}>
                Brak parametrów dla tego zboża.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
