import React, { useEffect, useState } from "react";
import { collection, onSnapshot, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import "./Operators.css";

export default function OperatorsPanel() {
  const [operators, setOperators] = useState([]);
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "operators"), (snap) => {
      setOperators(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  async function addOperator() {
    if (!name.trim() || !pin.trim()) {
      alert("Nazwa i PIN są wymagane");
      return;
    }
    await setDoc(doc(db, "operators", name), { name, pin });
    setName("");
    setPin("");
  }

  async function removeOperator(id) {
    await deleteDoc(doc(db, "operators", id));
  }

  return (
    <div className="operators-panel">
      <h3>Dodaj operatora</h3>
      <input
        placeholder="Nazwa"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
      />
      <button onClick={addOperator}>Dodaj</button>

      <h3>Lista operatorów</h3>
      <table className="operators-table">
        <thead>
          <tr>
            <th>Nazwa</th>
            <th>PIN</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {operators.map((op) => (
            <tr key={op.id}>
              <td>{op.name}</td>
              <td>{op.pin}</td>
              <td>
                <button onClick={() => removeOperator(op.id)}>Usuń</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
