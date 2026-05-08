import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import { db } from "../../firebase";
import { useElevator } from "../../context/ElevatorContext";
import "./AdminReleasePrograms.css";

export default function AdminReleasePrograms() {
  const { cells, grainDefinitions } = useElevator();

  const [selectedObject, setSelectedObject] = useState(null);
  const [grain, setGrain] = useState("");
  const [grainList, setGrainList] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [percentages, setPercentages] = useState({});
  const [programs, setPrograms] = useState([]);

  const [editId, setEditId] = useState(null);
  const [editOriginal, setEditOriginal] = useState(null);

  // Pobieramy listę zbóż
  useEffect(() => {
    setGrainList(Object.keys(grainDefinitions || {}));
  }, [grainDefinitions]);

  // Pobieramy istniejące programy
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "releasePrograms"), (snap) => {
      setPrograms(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // 🔵 Wczytanie programu do edycji
  const startEdit = (program) => {
    setEditId(program.id);
    setEditOriginal(program);

    setSelectedObject(program.object);
    setGrain(program.grain);

    setSelectedCells(program.cells.map((c) => ({ id: c.id })));

    setPercentages(
      Object.fromEntries(program.cells.map((c) => [c.id, c.percent]))
    );
  };

  // 🔵 Reset formularza
  const resetForm = () => {
    setEditId(null);
    setEditOriginal(null);
    setSelectedObject(null);
    setGrain("");
    setSelectedCells([]);
    setPercentages({});
  };

  // 🔵 Walidacja procentów
  const validatePercentages = () => {
    const total = Object.values(percentages).reduce(
      (a, b) => a + Number(b || 0),
      0
    );
    if (total !== 100) {
      alert("Suma udziałów musi wynosić 100%");
      return false;
    }
    return true;
  };

  // 🔵 Zapis nowego programu
  const saveNewProgram = async () => {
    if (!selectedObject) return alert("Wybierz obiekt.");
    if (!grain) return alert("Wybierz zboże.");
    if (!validatePercentages()) return;

    await addDoc(collection(db, "releasePrograms"), {
      object: selectedObject,
      grain,
      cells: selectedCells.map((c) => ({
        id: c.id,
        percent: Number(percentages[c.id] || 0)
      })),
      createdAt: Date.now(),
      active: true
    });

    alert("Program dodany!");
    resetForm();
  };

  // 🔵 Zapis edytowanego programu
  const saveEditedProgram = async () => {
    if (!validatePercentages()) return;

    const finalObject = selectedObject || editOriginal.object;
    const finalGrain = grain || editOriginal.grain;

    await updateDoc(doc(db, "releasePrograms", editId), {
      object: finalObject,
      grain: finalGrain,
      cells: selectedCells.map((c) => ({
        id: c.id,
        percent: Number(percentages[c.id] || 0)
      })),
      updatedAt: Date.now()
    });

    alert("Program zaktualizowany!");
    resetForm();
  };

  // 🔵 Usuwanie programu
  const deleteProgram = async (id) => {
    if (!window.confirm("Usunąć program?")) return;
    await deleteDoc(doc(db, "releasePrograms", id));
  };

  // 🔵 Komory dla wybranego zboża
  const filteredCells = cells.filter((c) => {
    if (!grain) return false;
    return String(c.grain || "").toLowerCase() === grain.toLowerCase();
  });

  return (
    <div className="release-wrapper">
      <h2>Programy wydań</h2>

      {/* WYBÓR OBIEKTU */}
      <div className="object-buttons">
        {["Młyn", "Płatkarnia", "Kaszarnia", "Zewnętrzne"].map((obj) => (
          <button
            key={obj}
            className={`obj-btn ${selectedObject === obj ? "active" : ""}`}
            onClick={() => setSelectedObject(obj)}
          >
            {obj}
          </button>
        ))}
      </div>

      {/* WYBÓR ZBOŻA */}
      {selectedObject && (
        <div className="grain-select">
          <label>Zboże:</label>
          <select value={grain} onChange={(e) => setGrain(e.target.value)}>
            <option value="">-- wybierz --</option>
            {grainList.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* LISTA KOMÓR */}
      {grain && (
        <div className="cells-list">
          <h3>Komory zboża: {grain}</h3>

          {filteredCells.map((cell) => (
            <div
              key={cell.id}
              className={`cell-row ${
                selectedCells.find((c) => c.id === cell.id) ? "selected" : ""
              }`}
              onClick={() =>
                setSelectedCells((prev) =>
                  prev.find((c) => c.id === cell.id)
                    ? prev.filter((c) => c.id !== cell.id)
                    : [...prev, cell]
                )
              }
            >
              <strong>{cell.id}</strong>
              <span>{cell.waga} t</span>
            </div>
          ))}
        </div>
      )}

      {/* PROCENTY */}
      {selectedCells.length > 0 && (
        <div className="percent-table">
          <h3>Udziały procentowe</h3>

          {selectedCells.map((cell) => (
            <div key={cell.id} className="percent-row">
              <span>{cell.id}</span>
              <input
                type="number"
                min="0"
                max="100"
                value={percentages[cell.id] || ""}
                onChange={(e) =>
                  setPercentages({
                    ...percentages,
                    [cell.id]: e.target.value
                  })
                }
              />
              <span>%</span>
            </div>
          ))}

          {editId ? (
            <button className="save-btn" onClick={saveEditedProgram}>
              Zapisz zmiany
            </button>
          ) : (
            <button className="save-btn" onClick={saveNewProgram}>
              Dodaj program
            </button>
          )}

          {editId && (
            <button className="cancel-btn" onClick={resetForm}>
              Anuluj edycję
            </button>
          )}
        </div>
      )}

      {/* LISTA PROGRAMÓW */}
      <h3>Lista programów wydań</h3>

      {programs.map((p) => (
        <div key={p.id} className="program-item">
          <div>
            <b>{p.object}</b> — {p.grain}
          </div>

          <div style={{ fontSize: 13, opacity: 0.9 }}>
            {p.cells.map((c) => (
              <span key={c.id} style={{ marginRight: 8 }}>
                {c.id}: {c.percent}%
              </span>
            ))}
          </div>

          <div className="program-actions">
            <button onClick={() => startEdit(p)} className="edit-btn">
              Edytuj
            </button>
            <button onClick={() => deleteProgram(p.id)} className="delete-btn">
              Usuń
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
