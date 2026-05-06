import React, { useState, useEffect } from "react";
import {
  setDoc,
  doc,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { db } from "../../../firebase";
import "./QualityEditor.css";

const PARAMS_BY_GRAIN = {
  pszenica: ["bialko", "gluten", "wilgotnosc", "gestosc", "opadanie"],
  zyto: ["opadanie", "wilgotnosc"],
  jeczmien: ["gestosc", "wilgotnosc"],
  owies: ["gestosc", "wilgotnosc"],
  pellet: ["wilgotnosc"],
};

const PARAM_LABELS = {
  bialko: "Białko",
  gluten: "Gluten",
  wilgotnosc: "Wilgotność",
  gestosc: "Gęstość",
  opadanie: "Liczba opadania",
};

const CELLS = [
  ...Array.from({ length: 40 }, (_, i) => `${i + 1}S`),
  ...Array.from({ length: 20 }, (_, i) => `${i + 1}N`),
  ...Array.from({ length: 5 }, (_, i) => `${21 + i}G`),
  ...Array.from({ length: 10 }, (_, i) => `${43 + i}W`),
];

export default function QualityEditor() {
  const [grain, setGrain] = useState("");
  const [groups, setGroups] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetMode, setResetMode] = useState("all");
  const [resetSegment, setResetSegment] = useState("S");

  const [form, setForm] = useState({
    keyParam: "",
    params: {},
    assignedCells: [],
  });

  // Ładowanie grup z Firestore
  useEffect(() => {
    if (!grain) {
      setGroups([]);
      return;
    }

    const loadGroups = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "quality", grain, "groups"));
        const loadedGroups = [];
        querySnapshot.forEach((d) => {
          loadedGroups.push({ ...d.data(), firebaseId: d.id });
        });
        setGroups(loadedGroups);
      } catch (error) {
        console.error("Błąd pobierania grup:", error);
      }
      setLoading(false);
    };

    loadGroups();
  }, [grain]);

  const handleParamChange = (param, field, value) => {
    setForm((prev) => ({
      ...prev,
      params: {
        ...prev.params,
        [param]: {
          ...prev.params[param],
          [field]: field === "extra" ? value : parseFloat(value) || 0,
        },
      },
    }));
  };

  const handleKeyParam = (param) => {
    setForm((prev) => ({ ...prev, keyParam: param }));
  };

  const toggleCell = (cell) => {
    setForm((prev) => ({
      ...prev,
      assignedCells: prev.assignedCells.includes(cell)
        ? prev.assignedCells.filter((c) => c !== cell)
        : [...prev.assignedCells, cell],
    }));
  };

  const performReset = async () => {
    try {
      const snap = await getDocs(collection(db, "cells"));
      for (const d of snap.docs) {
        const cellId = d.id;
        const data = d.data();
        let shouldReset = false;

        if (resetMode === "all") shouldReset = true;
        else if (resetMode === "grain" && data.grain === grain) shouldReset = true;
        else if (resetMode === "used" && data.groupId) shouldReset = true;
        else if (resetMode === "segment" && cellId.endsWith(resetSegment)) shouldReset = true;
        else if (resetMode === "group" && editingIndex !== null) {
          if (groups[editingIndex].assignedCells.includes(cellId)) shouldReset = true;
        }

        if (shouldReset) {
          await updateDoc(doc(db, "cells", cellId), {
            grain: deleteField(),
            params: deleteField(),
            groupId: deleteField(),
          });
        }
      }
      alert("Reset zakończony pomyślnie!");
      setShowResetModal(false);
    } catch (err) {
      console.error("Błąd resetu:", err);
      alert("Wystąpił błąd podczas resetowania komór.");
    }
  };

  const saveGroup = async () => {
    if (!grain) return alert("Wybierz zboże.");
    if (!form.keyParam) return alert("Wybierz parametr kluczowy.");

    const keyP = form.params[form.keyParam];
    if (!keyP || keyP.min === undefined || keyP.max === undefined) {
      return alert("Uzupełnij min/max dla parametru kluczowego.");
    }
    if (form.assignedCells.length === 0) return alert("Wybierz co najmniej jedną komorę.");

    try {
      const customId = (editingIndex !== null && groups[editingIndex]?.firebaseId) ||
        `${form.keyParam}_${keyP.min}_${keyP.max}`.replace(/\./g, "_");

      const docData = { ...form, grain, updatedAt: new Date().toISOString() };

      // 1. Zapisz grupę w quality
      await setDoc(doc(db, "quality", grain, "groups", customId), docData, { merge: true });

      // 2. Jeśli edytujemy, wyczyść stare komory, które zostały usunięte z tej grupy
      if (editingIndex !== null) {
        const previousCells = groups[editingIndex].assignedCells || [];
        for (const cellId of previousCells) {
          if (!form.assignedCells.includes(cellId)) {
            await updateDoc(doc(db, "cells", cellId), {
              grain: deleteField(),
              params: deleteField(),
              groupId: deleteField(),
            }).catch(() => {});
          }
        }
      }

      // 3. Zaktualizuj wszystkie aktualnie przypisane komory
      for (const cellId of form.assignedCells) {
        await setDoc(doc(db, "cells", cellId), {
          grain,
          params: form.params,
          groupId: customId,
        }, { merge: true });
      }

      // 4. Aktualizacja UI
      if (editingIndex !== null) {
        const updated = [...groups];
        updated[editingIndex] = { ...docData, firebaseId: customId };
        setGroups(updated);
        setEditingIndex(null);
      } else {
        setGroups((prev) => [...prev, { ...docData, firebaseId: customId }]);
      }

      setForm({ keyParam: "", params: {}, assignedCells: [] });
      alert("Zmiany zostały zapisane w bazie i komorach!");
    } catch (error) {
      console.error("Błąd zapisu:", error);
      alert(`Błąd zapisu: ${error.message}`);
    }
  };

  const deleteGroup = async (index) => {
    if (!window.confirm("Czy na pewno usunąć tę grupę i wyczyścić przypisane komory?")) return;
    const groupToDelete = groups[index];
    try {
      const cellsToClear = groupToDelete.assignedCells || [];
      for (const cellId of cellsToClear) {
        await updateDoc(doc(db, "cells", cellId), {
          grain: deleteField(),
          params: deleteField(),
          groupId: deleteField(),
        }).catch(() => {});
      }
      await deleteDoc(doc(db, "quality", grain, "groups", groupToDelete.firebaseId));
      setGroups((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Błąd usuwania:", error);
    }
  };

  const editGroup = (index) => {
    const g = groups[index];
    setEditingIndex(index);
    setForm({ keyParam: g.keyParam, params: g.params, assignedCells: g.assignedCells });
  };

  const sortedGroups = [...groups].sort((a, b) => {
    const labelA = PARAM_LABELS[a.keyParam] || "";
    const labelB = PARAM_LABELS[b.keyParam] || "";
    return labelA.localeCompare(labelB);
  });

  return (
    <div className="quality-editor">
      <div className="editor-header">
        <h2>Panel jakości</h2>
        <button className="reset-btn" onClick={() => setShowResetModal(true)}>Reset komór</button>
      </div>

      <div className="section">
        <label>Zboże:</label>
        <select value={grain} onChange={(e) => {
          setGrain(e.target.value);
          setForm({ keyParam: "", params: {}, assignedCells: [] });
          setEditingIndex(null);
        }}>
          <option value="">-- wybierz zboże --</option>
          <option value="pszenica">Pszenica</option>
          <option value="zyto">Żyto</option>
          <option value="jeczmien">Jęczmień</option>
          <option value="owies">Owies</option>
          <option value="pellet">Pellet</option>
        </select>
      </div>

      {grain && (
        <>
          <div className="section">
            <h3>Parametry jakości: {grain.toUpperCase()}</h3>
            {PARAMS_BY_GRAIN[grain].map((param) => (
              <div key={param} className="param-row">
                <div className="param-name">{PARAM_LABELS[param]}</div>
                <input type="number" step="0.1" placeholder="min" value={form.params[param]?.min || ""} onChange={(e) => handleParamChange(param, "min", e.target.value)} />
                <input type="number" step="0.1" placeholder="max" value={form.params[param]?.max || ""} onChange={(e) => handleParamChange(param, "max", e.target.value)} />
                <label><input type="radio" name="keyParam" checked={form.keyParam === param} onChange={() => handleKeyParam(param)} /> kluczowy</label>
                <label><input type="checkbox" checked={form.params[param]?.extra || false} onChange={(e) => handleParamChange(param, "extra", e.target.checked)} /> uzupeł.</label>
              </div>
            ))}
          </div>

          <div className="section">
            <h3>Wybierz komory dla tej grupy</h3>
            <div className="quality-cells-list">
              {CELLS.map((cell) => {
                const isUsed = groups.some((g, idx) => idx !== editingIndex && g.assignedCells.includes(cell));
                return (
                  <div 
                    key={cell} 
                    className={`quality-cell-row ${isUsed ? "quality-disabled" : ""} ${form.assignedCells.includes(cell) ? "quality-selected" : ""}`} 
                    onClick={() => !isUsed && toggleCell(cell)}
                  >
                    {cell}
                  </div>
                );
              })}
            </div>
          </div>

          <button className="save-btn" onClick={saveGroup}>
            {editingIndex !== null ? "Zapisz zmiany w grupie" : "Dodaj nową grupę"}
          </button>

          <div className="section">
            <h3>Zapisane grupy ({grain})</h3>
            {loading ? <p>Pobieranie...</p> : (
              sortedGroups.map((g, i) => (
                <div key={i} className="group-row">
                  <div>
                    <strong>{PARAM_LABELS[g.keyParam]}</strong>: {g.params[g.keyParam]?.min} - {g.params[g.keyParam]?.max}
                    <br />
                    <small>Komory: {g.assignedCells.join(", ")}</small>
                  </div>
                  <div className="group-actions">
                    <button onClick={() => editGroup(i)}>Edytuj</button>
                    <button onClick={() => deleteGroup(i)} className="delete-btn">Usuń</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {showResetModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Resetowanie komór</h3>
            <p>Wybierz zakres czyszczenia danych w komorach:</p>
            <div className="modal-options">
              <label><input type="radio" name="resetMode" value="all" checked={resetMode === "all"} onChange={() => setResetMode("all")} /> Wszystkie komory w systemie</label>
              <label><input type="radio" name="resetMode" value="grain" checked={resetMode === "grain"} onChange={() => setResetMode("grain")} /> Tylko zboże: {grain || "wybierz najpierw zboże"}</label>
              <label><input type="radio" name="resetMode" value="used" checked={resetMode === "used"} onChange={() => setResetMode("used")} /> Wszystkie przypisane do grup</label>
              <label>
                <input type="radio" name="resetMode" value="segment" checked={resetMode === "segment"} onChange={() => setResetMode("segment")} /> 
                Segment: 
                <select value={resetSegment} onChange={(e) => setResetSegment(e.target.value)}>
                  <option value="S">S</option><option value="N">N</option><option value="G">G</option><option value="W">W</option>
                </select>
              </label>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowResetModal(false)}>Anuluj</button>
              <button className="delete-btn" onClick={performReset}>Potwierdź Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}