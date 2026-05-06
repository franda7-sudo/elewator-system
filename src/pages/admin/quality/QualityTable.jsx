import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
import QualityEditor from "./QualityEditor";
import "./Quality.css";

export default function QualityTable() {
  const [params, setParams] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "quality"), (snap) => {
      setParams(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <div>
      <button onClick={() => setSelected({ id: null })}>
        ➕ Dodaj parametr
      </button>

      <table className="quality-table">
        <thead>
          <tr>
            <th>Nazwa</th>
            <th>Min</th>
            <th>Max</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {params.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.min}</td>
              <td>{p.max}</td>
              <td>
                <button onClick={() => setSelected(p)}>Edytuj</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && <QualityEditor param={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
