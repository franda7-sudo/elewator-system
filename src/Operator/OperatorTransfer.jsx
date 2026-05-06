// src/Operator/OperatorTransfer.jsx
import React, { useState } from "react";
import { useElevator } from "../context/ElevatorContext";
import { db } from "../firebase";
import { doc, updateDoc, collection, addDoc } from "firebase/firestore";
import "./OperatorsPanel.css";

export default function OperatorTransfer() {
  const { cells, operator } = useElevator();

  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const handleTransfer = async () => {
    if (!fromId || !toId) {
      alert("Wybierz komorę źródłową i docelową");
      return;
    }
    if (fromId === toId) {
      alert("Komora źródłowa i docelowa nie mogą być takie same");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      alert("Podaj poprawną ilość do przerzutu");
      return;
    }

    const fromCell = cells.find((c) => c.id === fromId);
    const toCell = cells.find((c) => c.id === toId);

    if (!fromCell || !toCell) {
      alert("Nie znaleziono komór");
      return;
    }

    const currentFromWeight = fromCell.waga || 0;
    const currentToWeight = toCell.waga || 0;
    const transferAmount = Number(amount);

    if (transferAmount > currentFromWeight) {
      alert("Ilość do przerzutu przekracza stan komory źródłowej");
      return;
    }

    // 🔥 1. Aktualizacja komory źródłowej
    await updateDoc(doc(db, "cells", fromId), {
      waga: currentFromWeight - transferAmount,
      updatedAt: Date.now(),
    });

    // 🔥 2. Aktualizacja komory docelowej
    await updateDoc(doc(db, "cells", toId), {
      waga: currentToWeight + transferAmount,
      updatedAt: Date.now(),
    });

    // 🔥 3. Zapis historii przerzutu
    await addDoc(collection(db, "transfers"), {
      fromId,
      toId,
      amount: transferAmount,
      grainFrom: fromCell.grain || null,
      grainTo: toCell.grain || null,
      note: note || "",
      operator: operator?.name || "unknown",
      timestamp: Date.now(),
    });

    alert("Przerzut zapisany");

    setFromId("");
    setToId("");
    setAmount("");
    setNote("");
  };

  const cellsWithWeight = cells.filter((c) => (c.waga || 0) > 0);

  return (
    <div style={{ padding: 16 }}>
      <h2>Przerzut zboża</h2>

      <div style={{ marginBottom: 12 }}>
        <label>Komora źródłowa:</label>
        <select
          style={styles.input}
          value={fromId}
          onChange={(e) => setFromId(e.target.value)}
        >
          <option value="">-- wybierz komorę --</option>
          {cellsWithWeight.map((c) => (
            <option key={c.id} value={c.id}>
              {c.id} — {c.grain || "brak"} — {c.waga || 0} t
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Komora docelowa:</label>
        <select
          style={styles.input}
          value={toId}
          onChange={(e) => setToId(e.target.value)}
        >
          <option value="">-- wybierz komorę --</option>
          {cells.map((c) => (
            <option key={c.id} value={c.id}>
              {c.id} — {c.grain || "brak"} — {c.waga || 0} t
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Ilość do przerzutu (t):</label>
        <input
          type="number"
          style={styles.input}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Opis / dokument (opcjonalnie):</label>
        <input
          type="text"
          style={styles.input}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <button style={styles.buttonPrimary} onClick={handleTransfer}>
        ✔ Przerzuć
      </button>
    </div>
  );
}

const styles = {
  input: {
    width: "100%",
    padding: 10,
    marginTop: 4,
    marginBottom: 8,
    fontSize: 18,
    borderRadius: 6,
    border: "1px solid #444",
  },
  buttonPrimary: {
    width: "100%",
    padding: 14,
    background: "#eab308",
    color: "#000",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    marginTop: 12,
    fontSize: 20,
    fontWeight: "bold",
  },
};
