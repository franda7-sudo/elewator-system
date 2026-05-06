// src/components/Admin/UsersAdmin.jsx
import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import UserEditorModal from "./UserEditorModal";

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const snap = await getDocs(collection(db, "users"));
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setUsers(list);
    } catch (err) {
      console.error("Błąd pobierania użytkowników:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return (
      <p style={{ textAlign: "center", color: "#fff", marginTop: 50 }}>
        Ładowanie użytkowników...
      </p>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Zarządzanie użytkownikami</h2>

      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={styles.th}>Imię</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Rola</th>
            <th style={styles.th}>PIN</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Akcja</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => {
            const isActive = u.active === true;

            return (
              <tr key={u.id} style={styles.row}>
                <td style={styles.td}>{u.name}</td>
                <td style={styles.td}>{u.email || "-"}</td>
                <td style={styles.td}>{u.role}</td>

                {/* PIN tylko dla operatorów */}
                <td style={styles.td}>
                  {u.role === "operator" ? u.pin : "-"}
                </td>

                {/* STATUS */}
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      background: isActive ? "#5cb85c" : "#d9534f",
                    }}
                  >
                    {isActive ? "Aktywne" : "Nieaktywne"}
                  </span>
                </td>

                {/* EDYCJA */}
                <td style={styles.td}>
                  <button
                    style={styles.editBtn}
                    onClick={() => setEditingUser(u)}
                  >
                    Edytuj
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* MODAL */}
      {editingUser && (
        <UserEditorModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSaved={loadUsers}
        />
      )}
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
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
    color: "#fff",
    fontFamily: "sans-serif",
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
  statusBadge: {
    padding: "4px 10px",
    borderRadius: 6,
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  editBtn: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "none",
    background: "#0275d8",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
