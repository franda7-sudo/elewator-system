// src/components/Admin/OperatorPinManager.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export default function OperatorPinManager() {
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPins, setNewPins] = useState({}); // lokalne PIN-y

  const loadOperators = async () => {
    try {
      const snap = await getDocs(collection(db, "users"));
      const list = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((u) => u.role === "operator");

      setOperators(list);
    } catch (err) {
      console.error("Błąd pobierania operatorów:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOperators();
  }, []);

  const savePin = async (op) => {
    const pin = newPins[op.id];

    if (!pin || pin.length < 2) {
      alert("PIN musi mieć co najmniej 2 cyfry");
      return;
    }

    try {
      await updateDoc(doc(db, "users", op.id), { pin });
      await loadOperators();
      alert("PIN zapisany");
    } catch (err) {
      console.error("Błąd zapisu PIN:", err);
      alert("Nie udało się zapisać PIN");
    }
  };

  const toggleActive = async (op) => {
    try {
      await updateDoc(doc(db, "users", op.id), { active: !op.active });
      await loadOperators();
    } catch (err) {
      console.error("Błąd zmiany statusu:", err);
      alert("Nie udało się zmienić statusu");
    }
  };

  if (loading) {
    return (
      <p style={{ textAlign: "center", color: "#fff", marginTop: 50 }}>
        Ładowanie operatorów...
      </p>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Zarządzanie PIN operatorów</h2>

      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={styles.th}>Imię</th>
            <th style={styles.th}>PIN</th>
            <th style={styles.th}>Nowy PIN</th>
            <th style={styles.th}>Zapisz</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Aktywacja</th>
          </tr>
        </thead>

        <tbody>
          {operators.map((op) => (
            <tr key={op.id} style={styles.row}>
              <td style={styles.td}>{op.name}</td>

              <td style={styles.td}>{op.pin}</td>

              <td style={styles.td}>
                <input
                  style={styles.input}
                  placeholder="Nowy PIN"
                  value={newPins[op.id] || ""}
                  onChange={(e) =>
                    setNewPins({ ...newPins, [op.id]: e.target.value })
                  }
                />
              </td>

              <td style={styles.td}>
                <button style={styles.saveBtn} onClick={() => savePin(op)}>
                  Zapisz
                </button>
              </td>

              <td style={styles.td}>
                <span
                  style={{
                    ...styles.statusBadge,
                    background: op.active ? "#5cb85c" : "#d9534f",
                  }}
                >
                  {op.active ? "Aktywny" : "Nieaktywny"}
                </span>
              </td>

              <td style={styles.td}>
                <button
                  style={{
                    ...styles.toggleBtn,
                    background: op.active ? "#d9534f" : "#5cb85c",
                  }}
                  onClick={() => toggleActive(op)}
                >
                  {op.active ? "Dezaktywuj" : "Aktywuj"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// STYLE
const styles = {
  container: {
    maxWidth: 1000,
    margin: "40px auto",
    padding: 20,
    background: "#1e1e1e",
    borderRadius: 10,
    color: "#fff",
    fontFamily: "sans-serif",
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    color: "#fbbf24",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#2a2a2a",
    borderRadius: 8,
    overflow: "hidden",
  },
  headerRow: {
    background: "#333",
  },
  th: {
    padding: 12,
    textAlign: "left",
    borderBottom: "1px solid #444",
    color: "#fbbf24",
  },
  td: {
    padding: 12,
    borderBottom: "1px solid #333",
  },
  row: {
    transition: "0.2s",
  },
  input: {
    padding: 8,
    borderRadius: 6,
    border: "1px solid #444",
    background: "#111",
    color: "#fff",
    width: "100%",
  },
  saveBtn: {
    padding: "6px 12px",
    background: "#0275d8",
    border: "none",
    borderRadius: 6,
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
  toggleBtn: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "none",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
  statusBadge: {
    padding: "4px 10px",
    borderRadius: 6,
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
};
