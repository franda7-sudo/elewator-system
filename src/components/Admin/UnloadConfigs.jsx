import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { useElevator } from "../../context/ElevatorContext";

export default function UnloadConfigs() {
  const { grains, cells } = useElevator();

  const [configs, setConfigs] = useState([]);
  const [grain, setGrain] = useState("");
  const [name, setName] = useState("");
  const [cellId, setCellId] = useState("");
  const [percent, setPercent] = useState("");
  const [cellList, setCellList] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "unloadConfigs"), (snap) => {
      setConfigs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const addCell = () => {
    if (!cellId || !percent) return;
    setCellList((prev) => [...prev, { cellId, percent: Number(percent) }]);
    setCellId("");
    setPercent("");
  };

  const saveConfig = async () => {
    if (!grain || !name || cellList.length === 0) {
      alert("Uzupełnij wszystkie pola");
      return;
    }

    await addDoc(collection(db, "unloadConfigs"), {
      grain,
      name,
      cells: cellList,
      createdAt: Date.now(),
    });

    setGrain("");
    setName("");
    setCellList([]);
  };

  const removeConfig = async (id) => {
    if (!window.confirm("Usunąć konfigurację?")) return;
    await deleteDoc(doc(db, "unloadConfigs", id));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Konfiguracje wydań</h2>

      <div style={{ marginBottom: 20 }}>
        <label>Zboże:</label>
        <select
          value={grain}
          onChange={(e) => setGrain(e.target.value)}
          style={styles.input}
        >
          <option value="">-- wybierz --</option>
          {grains.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        <label>Nazwa konfiguracji:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />

        <label>Komora:</label>
        <select
          value={cellId}
          onChange={(e) => setCellId(e.target.value)}
          style={styles.input}
        >
          <option value="">-- wybierz komorę --</option>
          {cells.map((c) => (
            <option key={c.id} value={c.id}>
              {c.id}
            </option>
          ))}
        </select>

        <label>Procent (%):</label>
        <input
          type="number"
          value={percent}
          onChange={(e) => setPercent(e.target.value)}
          style={styles.input}
        />

        <button style={styles.btn} onClick={addCell}>
          Dodaj komorę
        </button>

        <div style={{ marginTop: 10 }}>
          <strong>Komory w konfiguracji:</strong>
          {cellList.map((c, i) => (
            <div key={i}>
              {c.cellId} — {c.percent}%
            </div>
          ))}
        </div>

        <button style={styles.btnPrimary} onClick={saveConfig}>
          Zapisz konfigurację
        </button>
      </div>

      <h3>Istniejące konfiguracje</h3>
      {configs.map((cfg) => (
        <div key={cfg.id} style={styles.configItem}>
          <strong>{cfg.name}</strong> — {cfg.grain}
          <div>
            {cfg.cells
              .map((c) => `${c.cellId} (${c.percent}%)`)
              .join(", ")}
          </div>
          <button
            style={styles.btnDanger}
            onClick={() => removeConfig(cfg.id)}
          >
            Usuń
          </button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  input: {
    width: "100%",
    padding: 8,
    marginBottom: 10,
  },
  btn: {
    padding: "8px 12px",
    background: "#555",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    marginBottom: 10,
  },
  btnPrimary: {
    padding: "10px 14px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    marginTop: 10,
  },
  btnDanger: {
    padding: "6px 10px",
    background: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    marginTop: 6,
  },
  configItem: {
    padding: 10,
    border: "1px solid #ddd",
    borderRadius: 6,
    marginTop: 10,
  },
};
