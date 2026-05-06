import React, { useState } from "react";
import { auth, db } from "../../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

export default function AddOperator() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const handleAdd = async () => {
    setError("");
    setOk("");

    if (!name) {
      setError("Podaj imię operatora");
      return;
    }

    try {
      // 4-cyfrowy PIN
      const pin = Math.floor(1000 + Math.random() * 9000).toString();

      // email techniczny
      const email = `${name.toLowerCase()}@elewator.local`;

      // hasło do Auth – 6 znaków
      const password = "11" + pin;

      const cred = await createUserWithEmailAndPassword(auth, email, password);

      // zapis do kolekcji users
      await addDoc(collection(db, "users"), {
        uid: cred.user.uid,
        email,
        name,
        role: "operator",
        pin,
        active: true,
        createdAt: Date.now(),
      });

      setOk(`Operator ${name} utworzony. PIN: ${pin}`);
      setName("");
    } catch (e) {
      console.error(e);
      setError("Błąd tworzenia operatora");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "20px auto" }}>
      <h3>Dodaj operatora</h3>
      <label>Imię operatora:</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />
      {error && <div style={{ color: "red" }}>{error}</div>}
      {ok && <div style={{ color: "green" }}>{ok}</div>}
      <button
        onClick={handleAdd}
        style={{
          marginTop: 10,
          padding: 10,
          width: "100%",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Utwórz operatora
      </button>
    </div>
  );
}
