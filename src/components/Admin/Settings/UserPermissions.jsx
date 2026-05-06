import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase";
import UserEditorModal from "../UserEditorModal"; // <<< MODAL

export default function UserPermissions() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // MODAL STATE
  const [editingUser, setEditingUser] = useState(null);

  // Pobieranie użytkowników z Firestore
  useEffect(() => {
    async function loadUsers() {
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
    }
    loadUsers();
  }, []);

  // Zmiana aktywności konta
  const toggleActive = async (user) => {
    const newState = !user.active;
    try {
      await updateDoc(doc(db, "users", user.id), {
        active: newState,
      });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, active: newState } : u
        )
      );
    } catch (err) {
      console.error("Błąd podczas aktualizacji statusu:", err);
    }
  };

  if (loading) {
    return (
      <p style={{ textAlign: "center", color: "#fff", marginTop: "50px" }}>
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
            <th style={styles.th}>Rola</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Akcja</th>
            <th style={styles.th}>Edytuj</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => {
            const isActive = user.active === true;

            return (
              <tr key={user.id} style={styles.row}>
                <td style={styles.td}>{user.name}</td>
                <td style={styles.td}>{user.role}</td>

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

                {/* PRZYCISK AKTYWACJI */}
                <td style={styles.td}>
                  <button
                    onClick={() => toggleActive(user)}
                    style={{
                      ...styles.button,
                      background: isActive ? "#d9534f" : "#5cb85c",
                    }}
                  >
                    {isActive ? "Dezaktywuj" : "Aktywuj"}
                  </button>
                </td>

                {/* PRZYCISK EDYCJI */}
                <td style={styles.td}>
                  <button
                    onClick={() => setEditingUser(user)}
                    style={{
                      ...styles.button,
                      background: "#0275d8",
                    }}
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
          onSaved={() => {
            setEditingUser(null);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}

// STYLE - Dostosowane do ciemnego motywu admina
const styles = {
  container: {
    maxWidth: 900,
    margin: "40px auto",
    padding: 20,
    background: "#1e1e1e",
    borderRadius: 10,
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
    fontFamily: "sans-serif",
    color: "#fff",
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
    borderRadius: "8px",
    overflow: "hidden",
  },
  headerRow: {
    background: "#333",
  },
  th: {
    padding: "12px",
    textAlign: "left",
    borderBottom: "1px solid #444",
    color: "#fbbf24",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #333",
  },
  statusBadge: {
    padding: "4px 10px",
    borderRadius: 6,
    color: "white",
    fontWeight: "bold",
    fontSize: "12px",
    display: "inline-block",
  },
  button: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    color: "white",
    fontWeight: "bold",
    transition: "opacity 0.2s",
  },
};
