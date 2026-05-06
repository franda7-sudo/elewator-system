import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
import CellsEditor from "./CellsEditor";
import "./Cells.css";

export default function CellsTable() {
  const [cells, setCells] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "cells"), (snap) => {
      setCells(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <div>
      <table className="cells-table">
        <thead>
          <tr>
            <th>Komora</th>
            <th>Pojemność</th>
            <th>Waga</th>
            <th>Pełna</th>
            <th>Zablokowana</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cells.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.capacity}</td>
              <td>{c.waga}</td>
              <td>{c.full ? "TAK" : "NIE"}</td>
              <td>{c.blocked ? "TAK" : "NIE"}</td>
              <td>
                <button onClick={() => setSelected(c)}>Edytuj</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <CellsEditor cell={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
