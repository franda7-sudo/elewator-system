import React, { useState } from "react";
import { useElevator } from "../../../context/ElevatorContext";
import { db } from "../../../firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import "./QualityGroupsEditor.css";

export default function QualityGroupsEditor() {
  const { qualityGroups } = useElevator();

  const [name, setName] = useState("");
  const [short, setShort] = useState("");
  const [params, setParams] = useState([]);

  const addParam = () => {
    setParams((prev) => [
      ...prev,
      { key: "", min: "", max: "" }
    ]);
  };

  const updateParam = (index, field, value) => {
    setParams((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  const saveGroup = async () => {
    if (!name.trim()) return alert("Podaj nazwę nowej grupy");
    if (!short.trim()) return alert("Podaj skrót grupy");

    const formatted = {};
    params.forEach((p) => {
      if (p.key.trim()) {
        formatted[p.key] = { min: p.min, max: p.max };
      }
    });

    await addDoc(collection(db, "qualityGroups"), {
      name,
      short,
      params: formatted
    });

    setName("");
    setShort("");
    setParams([]);
    alert("Dodano grupę jakościową");
  };

  const deleteGroup = async (id) => {
    if (!window.confirm("Usunąć grupę?")) return;
    await deleteDoc(doc(db, "qualityGroups", id));
  };

  return (
    <div className="qg-editor">
      <h2>Grupy jakościowe</h2>

      <div className="qg-add">
        <input
          placeholder="Nazwa grupy"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Skrót"
          value={short}
          onChange={(e) => setShort(e.target.value)}
        />

        <button onClick={addParam}>+ parametr</button>

        <div className="qg-param-list">
          {params.map((p, i) => (
            <div key={i} className="qg-param-row">
              <input
                placeholder="klucz (np. opadanie)"
                value={p.key}
                onChange={(e) => updateParam(i, "key", e.target.value)}
              />
              <input
                placeholder="min"
                value={p.min}
                onChange={(e) => updateParam(i, "min", e.target.value)}
              />
              <input
                placeholder="max"
                value={p.max}
                onChange={(e) => updateParam(i, "max", e.target.value)}
              />
            </div>
          ))}
        </div>

        <button className="qg-save" onClick={saveGroup}>
          Zapisz grupę
        </button>
      </div>

      <h3>Istniejące grupy</h3>

      <div className="qg-list">
        {Object.values(qualityGroups).map((g) => (
          <div key={g.id} className="qg-item">
            <div className="qg-title">
              <strong>{g.name}</strong> ({g.short})
            </div>

            <div className="qg-params">
              {g.params &&
                Object.entries(g.params).map(([key, range]) => (
                  <div key={key}>
                    {key}: {range.min}–{range.max}
                  </div>
                ))}
            </div>

            <button className="qg-delete" onClick={() => deleteGroup(g.id)}>
              Usuń
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
