// src/admin/cells/CellEditor.jsx
import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { normalizeCellData } from "./normalizeCellData";

export default function CellEditor({ cell, onClose }) {
  const [form, setForm] = useState(cell || {});

  function setField(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function save() {
    await updateDoc(doc(db, "cells", cell.id), normalizeCellData(form));
    alert(`Zapisano komórkę ${cell.id}`);
    onClose && onClose();
  }

  return (
    <div style={{ padding: 20, background: "#222", color: "#fff" }}>
      <h3>Edytuj komórkę {cell.id}</h3>

      <div style={{ display: "grid", gap: 8, maxWidth: 320 }}>
        <label>
          Zboże:
          <input
            value={form.grain || form.ziarno || ""}
            onChange={e => setField("grain", e.target.value)}
          />
        </label>

        <label>
          Białko (%):
          <input
            type="number"
            step="0.1"
            value={form.białko ?? ""}
            onChange={e => setField("białko", e.target.value === "" ? null : parseFloat(e.target.value))}
          />
        </label>

        <label>
          Wilgotność (%):
          <input
            type="number"
            step="0.1"
            value={form.wilgotność ?? ""}
            onChange={e => setField("wilgotność", e.target.value === "" ? null : parseFloat(e.target.value))}
          />
        </label>

        <label>
          Gęstość (kg/hl):
          <input
            type="number"
            step="0.1"
            value={form.gęstość ?? ""}
            onChange={e => setField("gęstość", e.target.value === "" ? null : parseFloat(e.target.value))}
          />
        </label>

        <label>
          Grupa jakości:
          <input
            value={form.groupId || form["grupa jakości"] || ""}
            onChange={e => setField("groupId", e.target.value)}
          />
        </label>

        <label>
          Kolor:
          <input
            type="color"
            value={form.color || "#cccccc"}
            onChange={e => setField("color", e.target.value)}
          />
        </label>
      </div>

      <div style={{ marginTop: 16 }}>
        <button onClick={save}>Zapisz</button>
        <button onClick={onClose} style={{ marginLeft: 8 }}>
          Zamknij
        </button>
      </div>
    </div>
  );
}
