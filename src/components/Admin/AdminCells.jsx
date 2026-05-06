import React, { useState } from "react";
import { useElevator } from "../../context/ElevatorContext";

export default function AdminCells() {
  const {
    cells,
    addCell,
    updateCell,
    deleteCell,
  } = useElevator();

  const [newName, setNewName] = useState("");
  const [newCapacity, setNewCapacity] = useState("");
  const [newColor, setNewColor] = useState("#cccccc");
  const [newStatus, setNewStatus] = useState("active");
  const [newGrain, setNewGrain] = useState(""); // Nowe pole dla zboża

  const handleAdd = async () => {
    if (!newName.trim()) return;

    await addCell({
      name: newName.trim(),
      capacity: Number(newCapacity) || 0,
      color: newColor,
      status: newStatus,
      grain: newGrain, // Zapisujemy zboże przy dodawaniu
    });

    setNewName("");
    setNewCapacity("");
    setNewColor("#cccccc");
    setNewStatus("active");
    setNewGrain("");
  };

  const updateField = (id, field, value) => {
    updateCell(id, { [field]: value });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Zarządzanie komorami</h2>

      {/* Dodawanie nowej komory */}
      <div style={styles.addBox}>
        <h3>Dodaj nową komorę</h3>

        <label>Nazwa:</label>
        <input
          style={styles.input}
          value={newName || ""} // Zabezpieczenie przed null
          onChange={(e) => setNewName(e.target.value)}
        />

        <label>Pojemność (t):</label>
        <input
          type="number"
          style={styles.input}
          value={newCapacity || ""} // Zabezpieczenie przed null
          onChange={(e) => setNewCapacity(e.target.value)}
        />

        <label>Zboże (dla mapy):</label>
        <select
          style={styles.select}
          value={newGrain || ""}
          onChange={(e) => setNewGrain(e.target.value)}
        >
          <option value="">-- brak --</option>
          <option value="pszenica">Pszenica</option>
          <option value="zyto">Żyto</option>
          <option value="jeczmien">Jęczmień</option>
          <option value="owies">Owies</option>
          <option value="pellet">Pellet</option>
        </select>

        <label>Kolor domyślny:</label>
        <input
          type="color"
          style={styles.color}
          value={newColor || "#cccccc"}
          onChange={(e) => setNewColor(e.target.value)}
        />

        <label>Status:</label>
        <select
          style={styles.select}
          value={newStatus || "active"}
          onChange={(e) => setNewStatus(e.target.value)}
        >
          <option value="active">aktywna</option>
          <option value="disabled">wyłączona</option>
        </select>

        <button style={styles.button} onClick={handleAdd}>
          Dodaj komorę
        </button>
      </div>

      <hr style={{ margin: "30px 0" }} />

      {/* Lista komór */}
      <h3>Lista komór</h3>

      {cells.map((cell) => (
        <div key={cell.id} style={styles.cellBox}>
          <div style={styles.cellHeader}>
            <strong>{cell.name || "Bez nazwy"}</strong>

            <button
              style={styles.delete}
              onClick={() => deleteCell(cell.id)}
            >
              Usuń
            </button>
          </div>

          <div style={styles.row}>
            <label>Nazwa:</label>
            <input
              style={styles.input}
              value={cell.name || ""} // FIX: Zabezpieczenie przed null
              onChange={(e) => updateField(cell.id, "name", e.target.value)}
            />
          </div>

          <div style={styles.row}>
            <label>Aktualne zboże (kluczowe dla mapy):</label>
            <select
              style={styles.select}
              value={cell.grain || ""} // FIX: Zabezpieczenie przed null
              onChange={(e) => updateField(cell.id, "grain", e.target.value)}
            >
              <option value="">-- pusta --</option>
              <option value="pszenica">Pszenica</option>
              <option value="zyto">Żyto</option>
              <option value="jeczmien">Jęczmień</option>
              <option value="owies">Owies</option>
              <option value="pellet">Pellet</option>
            </select>
          </div>

          <div style={styles.row}>
            <label>Pojemność (t):</label>
            <input
              type="number"
              style={styles.input}
              value={cell.capacity || 0} // FIX: Zabezpieczenie przed null
              onChange={(e) =>
                updateField(cell.id, "capacity", Number(e.target.value))
              }
            />
          </div>

          <div style={styles.row}>
            <label>Kolor:</label>
            <input
              type="color"
              style={styles.color}
              value={cell.color || "#cccccc"} // FIX: Zabezpieczenie przed null
              onChange={(e) => updateField(cell.id, "color", e.target.value)}
            />
          </div>

          <div style={styles.row}>
            <label>Status:</label>
            <select
              style={styles.select}
              value={cell.status || "active"} // FIX: Zabezpieczenie przed null
              onChange={(e) => updateField(cell.id, "status", e.target.value)}
            >
              <option value="active">aktywna</option>
              <option value="disabled">wyłączona</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

// Style pozostają bez zmian (jak w Twoim oryginale)
const styles = {
  container: { maxWidth: 900, margin: "0 auto", padding: 20, fontFamily: "sans-serif" },
  title: { textAlign: "center", marginBottom: 20 },
  addBox: { padding: 20, background: "#f0f0f0", borderRadius: 8, marginBottom: 20 },
  input: { width: "100%", padding: 8, marginBottom: 10, boxSizing: "border-box" },
  color: { width: 60, height: 40, marginBottom: 10, display: "block" },
  select: { width: "100%", padding: 8, marginBottom: 10 },
  button: { marginTop: 10, padding: 10, width: "100%", background: "#007bff", color: "white", border: "none", borderRadius: 6, cursor: "pointer" },
  cellBox: { padding: 15, background: "#fafafa", borderRadius: 8, marginBottom: 15, border: "1px solid #ddd" },
  cellHeader: { display: "flex", alignItems: "center", marginBottom: 10 },
  delete: { marginLeft: "auto", background: "#d9534f", color: "white", border: "none", padding: "6px 12px", borderRadius: 4, cursor: "pointer" },
  row: { marginBottom: 12 },
};