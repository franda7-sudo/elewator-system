// src/admin/AdminPriorities.jsx
import React, { useState } from "react";
import { useElevator } from "../../context/ElevatorContext";


export default function AdminPriorities() {
  const {
    grains,
    cells,
    priorities,
    addPriority,
    updatePriority,
    deletePriority,
  } = useElevator();

  const [selectedGrain, setSelectedGrain] = useState("");
  const [primaryCells, setPrimaryCells] = useState([]);
  const [fallbackCells, setFallbackCells] = useState([]);

  const loadExisting = (grainName) => {
    const existing = priorities.find((p) => p.grain === grainName);
    if (existing) {
      setPrimaryCells(existing.primaryCells || []);
      setFallbackCells(existing.fallbackCells || []);
    } else {
      setPrimaryCells([]);
      setFallbackCells([]);
    }
  };

  const toggleCell = (list, setList, cellId) => {
    if (list.includes(cellId)) {
      setList(list.filter((id) => id !== cellId));
    } else {
      setList([...list, cellId]);
    }
  };

  const handleSave = async () => {
    if (!selectedGrain) return;

    const existing = priorities.find((p) => p.grain === selectedGrain);

    const payload = {
      grain: selectedGrain,
      primaryCells,
      fallbackCells,
    };

    if (existing) {
      await updatePriority(existing.id, payload);
    } else {
      await addPriority(payload);
    }
  };

  const handleDelete = async () => {
    const existing = priorities.find((p) => p.grain === selectedGrain);
    if (existing) {
      await deletePriority(existing.id);
      setPrimaryCells([]);
      setFallbackCells([]);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Priorytety komór</h2>

      <label>Zboże:</label>
      <select
        style={styles.select}
        value={selectedGrain}
        onChange={(e) => {
          setSelectedGrain(e.target.value);
          loadExisting(e.target.value);
        }}
      >
        <option value="">-- wybierz zboże --</option>
        {grains.map((g) => (
          <option key={g.id} value={g.name}>
            {g.name}
          </option>
        ))}
      </select>

      {selectedGrain && (
        <>
          <h3>Komory PRIMARY (główne)</h3>
          <div style={styles.cellsBox}>
            {cells.map((c) => (
              <label key={c.id} style={styles.cellItem}>
                <input
                  type="checkbox"
                  checked={primaryCells.includes(c.id)}
                  onChange={() =>
                    toggleCell(primaryCells, setPrimaryCells, c.id)
                  }
                />
                {c.name}
              </label>
            ))}
          </div>

          <h3>Komory FALLBACK (awaryjne)</h3>
          <div style={styles.cellsBox}>
            {cells.map((c) => (
              <label key={c.id} style={styles.cellItem}>
                <input
                  type="checkbox"
                  checked={fallbackCells.includes(c.id)}
                  onChange={() =>
                    toggleCell(fallbackCells, setFallbackCells, c.id)
                  }
                />
                {c.name}
              </label>
            ))}
          </div>

          <button style={styles.save} onClick={handleSave}>
            Zapisz priorytety
          </button>

          <button style={styles.delete} onClick={handleDelete}>
            Usuń priorytety
          </button>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 900,
    margin: "0 auto",
    padding: 20,
    fontFamily: "sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  select: {
    width: "100%",
    padding: 8,
    marginBottom: 20,
  },
  cellsBox: {
    display: "flex",
    flexWrap: "wrap",
    gap: 15,
    marginBottom: 20,
  },
  cellItem: {
    padding: 8,
    background: "#f0f0f0",
    borderRadius: 6,
  },
  save: {
    marginTop: 20,
    padding: 10,
    width: "100%",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  delete: {
    marginTop: 10,
    padding: 10,
    width: "100%",
    background: "#d9534f",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};
