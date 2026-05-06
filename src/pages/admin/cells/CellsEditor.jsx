import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import "./Cells.css";

export default function CellsEditor({ cell, onClose }) {
  const [capacity, setCapacity] = useState(cell.capacity || 0);
  const [blocked, setBlocked] = useState(!!cell.blocked);

  async function save() {
    await setDoc(
      doc(db, "cells", cell.id),
      {
        ...cell,
        capacity,
        blocked,
      },
      { merge: true }
    );
    onClose();
  }

  return (
    <div className="cells-editor">
      <h3>Komora {cell.id}</h3>

      <label>Pojemność:</label>
      <input
        type="number"
        value={capacity}
        onChange={(e) => setCapacity(Number(e.target.value))}
      />

      <label>
        <input
          type="checkbox"
          checked={blocked}
          onChange={(e) => setBlocked(e.target.checked)}
        />
        Zablokowana
      </label>

      <button onClick={save}>💾 Zapisz</button>
      <button onClick={onClose}>Anuluj</button>
    </div>
  );
}
