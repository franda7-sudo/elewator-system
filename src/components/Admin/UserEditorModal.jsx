// src/components/Admin/UserEditorModal.jsx
import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { setUserRole } from "../../services/roles";

export default function UserEditorModal({ user, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    pin: "",
    active: true,
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "operator",
        pin: user.pin || "",
        active: user.active ?? true,
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      // 1. Aktualizacja głównego dokumentu w Firestore
      await updateDoc(doc(db, "users", user.id), {
        name: form.name,
        email: form.email,
        role: form.role,
        pin: form.pin,
        active: form.active,
      });

      // 2. Jeśli rola uległa zmianie, zaktualizuj Custom Claims (jeśli używasz tej usługi)
      if (form.role !== user.role) {
        await setUserRole(user.id, form.role);
      }

      onSaved();
      onClose();
    } catch (err) {
      console.error("Błąd zapisu:", err);
      alert("Nie udało się zapisać zmian");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Czy na pewno chcesz usunąć użytkownika?")) return;

    try {
      await deleteDoc(doc(db, "users", user.id));
      onSaved();
      onClose();
    } catch (err) {
      console.error("Błąd usuwania:", err);
      alert("Nie udało się usunąć użytkownika");
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      {/* stopPropagation zapobiega zamknięciu modala przy kliknięciu wewnątrz niego */}
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>Edycja użytkownika</h2>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Imię</label>
          <input
            style={styles.input}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Rola</label>
          <select
            style={styles.input}
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="operator">Operator</option>
            <option value="admin">Admin</option>
            <option value="owner">Owner</option>
            <option value="superuser">Superuser</option>
          </select>
        </div>

        {form.role === "operator" && (
          <div style={styles.fieldGroup}>
            <label style={styles.label}>PIN</label>
            <input
              style={styles.input}
              type="text"
              maxLength={6}
              value={form.pin}
              onChange={(e) => setForm({ ...form, pin: e.target.value })}
            />
          </div>
        )}

        <label style={styles.checkbox}>
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          Konto aktywne
        </label>

        <div style={styles.buttons}>
          <button style={styles.saveBtn} onClick={handleSave}>
            Zapisz
          </button>
          <button style={styles.deleteBtn} onClick={handleDelete}>
            Usuń
          </button>
          <button style={styles.cancelBtn} onClick={onClose}>
            Anuluj
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    width: "90%",
    maxWidth: 450,
    background: "#1e1e1e",
    padding: 30,
    borderRadius: 12,
    color: "#fff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
  },
  title: {
    marginTop: 0,
    marginBottom: 20,
    color: "#fbbf24",
    fontSize: "1.5rem",
  },
  fieldGroup: {
    marginBottom: 15,
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: 6,
    fontSize: 13,
    color: "#aaa",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 6,
    border: "1px solid #333",
    background: "#111",
    color: "#fff",
    fontSize: 15,
    boxSizing: "border-box", // Ważne dla paddingu
  },
  checkbox: {
    marginTop: 15,
    display: "flex",
    alignItems: "center",
    gap: 10,
    cursor: "pointer",
    fontSize: 14,
  },
  buttons: {
    marginTop: 30,
    display: "flex",
    gap: 10,
  },
  saveBtn: {
    flex: 2,
    padding: "12px",
    background: "#22c55e",
    border: "none",
    borderRadius: 6,
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  deleteBtn: {
    flex: 1,
    padding: "12px",
    background: "#ef4444",
    border: "none",
    borderRadius: 6,
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  cancelBtn: {
    flex: 1,
    padding: "12px",
    background: "#3f3f46",
    border: "none",
    borderRadius: 6,
    color: "#fff",
    cursor: "pointer",
  },
};