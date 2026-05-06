import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import "./OperatorsPanel.css";

export default function OperatorsPanel() {
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", pin: "", active: true });

  const loadOperators = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(
        query(collection(db, "users"), where("role", "==", "operator"))
      );
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setOperators(list);
    } catch (err) {
      console.error("Błąd ładowania:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOperators();
  }, []);

  const openAdd = () => {
    setEditMode(false);
    setForm({ name: "", pin: "", active: true });
    setModalOpen(true);
  };

  const openEdit = (op) => {
    setEditMode(true);
    setForm({ ...op, pin: String(op.pin) });
    setModalOpen(true);
  };

  const validate = () => {
    const trimmedName = form.name.trim();
    const trimmedPin = String(form.pin).trim();

    if (!trimmedName || trimmedPin.length < 4) {
      alert("Imię i PIN (min. 4 znaki) są wymagane.");
      return false;
    }

    const duplicatePin = operators.some(
      (op) => String(op.pin) === trimmedPin && op.id !== form.id
    );

    if (duplicatePin) {
      alert("Ten PIN jest już zajęty.");
      return false;
    }

    return true;
  };

  const saveOperator = async () => {
    if (!validate()) return;
    setSubmitting(true);

    try {
      const data = {
        name: form.name.trim(),
        pin: String(form.pin).trim(),
        active: form.active,
      };

      if (editMode) {
        await updateDoc(doc(db, "users", form.id), data);
      } else {
        await addDoc(collection(db, "users"), {
          ...data,
          role: "operator",
          createdAt: Date.now(),
        });
      }

      setModalOpen(false);
      await loadOperators();
    } catch (err) {
      alert("Błąd: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (op) => {
    try {
      await updateDoc(doc(db, "users", op.id), { active: !op.active });
      setOperators((prev) =>
        prev.map((o) =>
          o.id === op.id ? { ...o, active: !o.active } : o
        )
      );
    } catch (err) {
      alert("Błąd aktualizacji");
    }
  };

  const removeOperator = async (op) => {
    if (!window.confirm(`Usunąć operatora ${op.name}?`)) return;

    try {
      await deleteDoc(doc(db, "users", op.id));
      setOperators((prev) => prev.filter((o) => o.id !== op.id));
    } catch (err) {
      alert("Błąd usuwania");
    }
  };

  if (loading)
    return <div className="op-loading">Ładowanie operatorów...</div>;

  return (
    <div className="operators-container">
      <div className="operators-header">
        <h2>Operatorzy</h2>
        <button className="btn-add-main" onClick={openAdd}>
          + Dodaj operatora
        </button>
      </div>

      <div className="operators-list">
        {operators.map((op) => (
          <div
            key={op.id}
            className={`operator-card ${!op.active ? "is-blocked" : ""}`}
          >
            <div className="card-info">
              <span className="op-name">{op.name}</span>
              <span className="op-pin">
                PIN: <code>{op.pin}</code>
              </span>
              <span
                className={`status-badge ${
                  op.active ? "active" : "blocked"
                }`}
              >
                {op.active ? "Aktywny" : "Zablokowany"}
              </span>
            </div>

            <div className="card-actions">
              <button
                className={`btn-status ${op.active ? "off" : "on"}`}
                onClick={() => toggleActive(op)}
              >
                {op.active ? "Zablokuj" : "Odblokuj"}
              </button>

              <button
                className="btn-edit-small"
                onClick={() => openEdit(op)}
              >
                Edytuj
              </button>

              <button
                className="btn-del-small"
                onClick={() => removeOperator(op)}
              >
                Usuń
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div
          className="modal-overlay"
          onClick={() => !submitting && setModalOpen(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{editMode ? "Edycja operatora" : "Nowy operator"}</h3>

            <div className="input-group">
              <label>Imię i nazwisko</label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            <div className="input-group">
              <label>PIN</label>
              <input
                inputMode="numeric"
                value={form.pin}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pin: e.target.value.replace(/\D/g, ""),
                  })
                }
              />
            </div>

            <div className="modal-btns">
              <button
                className="save-btn"
                onClick={saveOperator}
                disabled={submitting}
              >
                {submitting ? "Zapisywanie..." : "Zapisz"}
              </button>

              <button
                className="cancel-btn"
                onClick={() => setModalOpen(false)}
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
