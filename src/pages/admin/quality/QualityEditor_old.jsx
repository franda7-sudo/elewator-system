import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import "./Quality.css";

export default function QualityEditor({ param, onClose }) {
  const [name, setName] = useState(param.name || "");
  const [min, setMin] = useState(param.min || 0);
  const [max, setMax] = useState(param.max || 0);

  async function save() {
    if (!name.trim()) {
      alert("Nazwa jest wymagana");
      return;
    }

    const id = param.id || name;
    await setDoc(doc(db, "quality", id), {
      name,
      min,
      max,
    });

    onClose();
  }

  return (
    <div className="quality-editor">
      <h3>Edytor parametru</h3>

      <label>Nazwa:</label>
      <input value={name} onChange={(e) => setName(e.target.value)} />

      <label>Min:</label>
      <input type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} />

      <label>Max:</label>
      <input type="number" value={max} onChange={(e) => setMax(Number(e.target.value))} />

      <button onClick={save}>💾 Zapisz</button>
      <button onClick={onClose}>Anuluj</button>
    </div>
  );
}
