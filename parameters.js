// src/admin/pages/GrainParameters.jsx
import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { useParams } from "react-router-dom";
import "./GrainParameters.css";

const ALL_CELLS = [
  "1S","2S","3S","4S","5S","6S","7S","8S","9S","10S","11S","12S","13S","14S","15S","16S","17S","18S","19S","20S",
  "21S","22S","23S","24S","25S","26S","27S","28S","29S","30S","31S","32S","33S","34S","35S","36S","37S","38S","39S","40S",
  "1N","2N","3N","4N","5N","6N","7N","8N","9N","10N","11N","12N","13N","14N","15N","16N","17N","18N","19N","20N",
  "21G","22G","23G","24G","25G",
  "43","44","45","46","47","48","49","50","51","52",
];

const UNITS = ["%", "kg/hl", "g/kg", "mg/kg", "szt./kg", "brak"];

export default function GrainParameters() {
  const { grainId } = useParams(); // /admin/grains/:grainId/parameters
  const [params, setParams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newParam, setNewParam] = useState({
    name: "",
    short: "",
    unit: "%",
    min: "",
    max: "",
    assignedCells: [],
    inLab: true,
    isKey: false,
    isExtra: false,
  });

  useEffect(() => {
    if (!grainId) return;

    const ref = collection(db, "grains", grainId, "parameters");
    const unsub = onSnapshot(ref, (snap) => {
      setParams(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => unsub();
  }, [grainId]);

  const handleAdd = async () => {
    if (!grainId) return;
    if (!newParam.name.trim()) return;

    await addDoc(collection(db, "grains", grainId, "parameters"), {
      ...newParam,
      min: newParam.min === "" ? null : Number(newParam.min),
      max: newParam.max === "" ? null : Number(newParam.max),
      createdAt: Date.now(),
    });

    setNewParam({
      name: "",
      short: "",
      unit: "%",
      min: "",
      max: "",
      assignedCells: [],
      inLab: true,
      isKey: false,
      isExtra: false,
    });
    setAdding(false);
  };

  const handleUpdate = async (id, patch) => {
    if (!grainId) return;
    const ref = doc(db, "grains", grainId, "parameters", id);
    await updateDoc(ref, patch);
  };

  const handleDelete = async (id) => {
    if (!grainId) return;
    const ref = doc(db, "grains", grainId, "parameters", id);
    await deleteDoc(ref);
  };

  const toggleCell = (param, cell) => {
    const current = param.assignedCells || [];
    const exists = current.includes(cell);
    const next = exists
      ? current.filter((c) => c !== cell)
      : [...current, cell];
    handleUpdate(param.id, { assignedCells: next });
  };

  const toggleNewCell = (cell) => {
    const current = newParam.assignedCells || [];
    const exists = current.includes(cell);
    const next = exists
      ? current.filter((c) => c !== cell)
      : [...current, cell];
    setNewParam((p) => ({ ...p, assignedCells: next }));
  };

  if (!grainId) {
    return <div className="gp-container">Brak wybranego zboża.</div>;
  }

  if (loading) {
    return <div className="gp-container">Ładowanie parametrów...</div>;
  }

  return (
    <div className="gp-container">
      <h2>Parametry jakości — {grainId}</h2>

      <div className="gp-header-row">
        <button className="gp-add-btn" onClick={() => setAdding((v) => !v)}>
          {adding ? "✖ Anuluj" : "➕ Dodaj parametr"}
        </button>
      </div>

      {adding && (
        <div className="gp-add-panel">
          <div className="gp-add-row">
            <label>Nazwa</label>
            <input
              value={newParam.name}
              onChange={(e) =>
                setNewParam((p) => ({ ...p, name: e.target.value }))
              }
            />
          </div>
          <div className="gp-add-row">
            <label>Skrót</label>
            <input
              value={newParam.short}
              onChange={(e) =>
                setNewParam((p) => ({ ...p, short: e.target.value }))
              }
            />
          </div>
          <div className="gp-add-row">
            <label>Jednostka</label>
            <select
              value={newParam.unit}
              onChange={(e) =>
                setNewParam((p) => ({ ...p, unit: e.target.value }))
              }
            >
              {UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
          <div className="gp-add-row gp-minmax-row">
            <label>Zakres</label>
            <input
              type="number"
              placeholder="min"
              value={newParam.min}
              onChange={(e) =>
                setNewParam((p) => ({ ...p, min: e.target.value }))
              }
            />
            <span>–</span>
            <input
              type="number"
              placeholder="max"
              value={newParam.max}
              onChange={(e) =>
                setNewParam((p) => ({ ...p, max: e.target.value }))
              }
            />
          </div>
          <div className="gp-add-row">
            <label>Komory</label>
            <div className="gp-cells-grid">
              {ALL_CELLS.map((cell) => (
                <button
                  key={cell}
                  type="button"
                  className={
                    newParam.assignedCells?.includes(cell)
                      ? "gp-cell-btn gp-cell-btn-active"
                      : "gp-cell-btn"
                  }
                  onClick={() => toggleNewCell(cell)}
                >
                  {cell}
                </button>
              ))}
            </div>
          </div>
          <div className="gp-add-row gp-flags-row">
            <label>Flagi</label>
            <div className="gp-flags">
              <label>
                <input
                  type="checkbox"
                  checked={newParam.inLab}
                  onChange={(e) =>
                    setNewParam((p) => ({ ...p, inLab: e.target.checked }))
                  }
                />
                Badany w lab.
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={newParam.isKey}
                  onChange={(e) =>
                    setNewParam((p) => ({ ...p, isKey: e.target.checked }))
                  }
                />
                Kluczowy
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={newParam.isExtra}
                  onChange={(e) =>
                    setNewParam((p) => ({ ...p, isExtra: e.target.checked }))
                  }
                />
                Uzupełniający
              </label>
            </div>
          </div>
          <div className="gp-add-actions">
            <button className="gp-save-btn" onClick={handleAdd}>
              Zapisz parametr
            </button>
          </div>
        </div>
      )}

      <table className="gp-table">
        <thead>
          <tr>
            <th>Nazwa</th>
            <th>Skrót</th>
            <th>Jednostka</th>
            <th>Min</th>
            <th>Max</th>
            <th>Komory</th>
            <th>Lab</th>
            <th>Kluczowy</th>
            <th>Uzupełniający</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {params.map((p) => (
            <tr key={p.id}>
              <td>
                <input
                  value={p.name || ""}
                  onChange={(e) =>
                    handleUpdate(p.id, { name: e.target.value })
                  }
                />
              </td>
              <td>
                <input
                  value={p.short || ""}
                  onChange={(e) =>
                    handleUpdate(p.id, { short: e.target.value })
                  }
                />
              </td>
              <td>
                <select
                  value={p.unit || ""}
                  onChange={(e) =>
                    handleUpdate(p.id, { unit: e.target.value })
                  }
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  value={p.min ?? ""}
                  onChange={(e) =>
                    handleUpdate(p.id, {
                      min: e.target.value === "" ? null : Number(e.target.value),
                    })
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={p.max ?? ""}
                  onChange={(e) =>
                    handleUpdate(p.id, {
                      max: e.target.value === "" ? null : Number(e.target.value),
                    })
                  }
                />
              </td>
              <td>
                <div className="gp-cells-grid gp-cells-grid-row">
                  {ALL_CELLS.map((cell) => (
                    <button
                      key={cell}
                      type="button"
                      className={
                        p.assignedCells?.includes(cell)
                          ? "gp-cell-btn gp-cell-btn-active"
                          : "gp-cell-btn"
                      }
                      onClick={() => toggleCell(p, cell)}
                    >
                      {cell}
                    </button>
                  ))}
                </div>
              </td>
              <td style={{ textAlign: "center" }}>
                <input
                  type="checkbox"
                  checked={!!p.inLab}
                  onChange={(e) =>
                    handleUpdate(p.id, { inLab: e.target.checked })
                  }
                />
              </td>
              <td style={{ textAlign: "center" }}>
                <input
                  type="checkbox"
                  checked={!!p.isKey}
                  onChange={(e) =>
                    handleUpdate(p.id, { isKey: e.target.checked })
                  }
                />
              </td>
              <td style={{ textAlign: "center" }}>
                <input
                  type="checkbox"
                  checked={!!p.isExtra}
                  onChange={(e) =>
                    handleUpdate(p.id, { isExtra: e.target.checked })
                  }
                />
              </td>
              <td>
                <button
                  className="gp-delete-btn"
                  onClick={() => handleDelete(p.id)}
                >
                  🗑
                </button>
              </td>
            </tr>
          ))}
          {params.length === 0 && (
            <tr>
              <td colSpan={10} style={{ textAlign: "center", opacity: 0.7 }}>
                Brak zdefiniowanych parametrów dla tego zboża.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
