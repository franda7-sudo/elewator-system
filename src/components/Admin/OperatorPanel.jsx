import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc
} from "firebase/firestore";
import "./Operators.css";

export default function OperatorsPanel() {
  const [operators, setOperators] = useState([]);
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [role, setRole] = useState("operator");

  // Live update operatorów
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "operators"), (snap) => {
      setOperators(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  async function addOperator() {
    if (!name.trim() || !pin.trim()) {
      alert("Imię i PIN są wymagane");
      return;
    }

    const id = "op_" + name.toLowerCase().replace(/\s+/g, "_");

    await setDoc(doc(db, "operators", id), {
      name,
      pin,
      role,
      active: true
    });

    setName("");
    setPin("");
  }

  async function removeOperator(id) {
    await deleteDoc(doc(db, "operators", id));
  }

  async function toggleActive(op) {
    await setDoc(doc(db, "operators", op.id), {
      ...op,
      active: !op.active
    });
  }

  return (
    <div className="operators-panel">
      <h2>Operatorzy – zarządzanie</h2>

      <div className="operators-add">
        <input
          placeholder="Imię i nazwisko"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="operator">Operator</option>
          <option value="laborant">Laborant</option>
          <option value="admin">Administrator</option>
        </select>

        <button onClick={addOperator}>➕ Dodaj operatora</button>
      </div>

      <h3>Lista operatorów</h3>
      <table className="operators-table">
        <thead>
          <tr>
            <th>Imię</th>
            <th>PIN</th>
            <th>Rola</th>
            <th>Status</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {operators.map((op) => (
            <tr key={op.id}>
              <td>{op.name}</td>
              <td>{op.pin}</td>
              <td>{op.role}</td>
              <td>{op.active ? "Aktywny" : "Zablokowany"}</td>
              <td>
                <button onClick={() => toggleActive(op)}>
                  {op.active ? "🔒 Zablokuj" : "🔓 Aktywuj"}
                </button>
                <button onClick={() => removeOperator(op.id)}>🗑 Usuń</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
