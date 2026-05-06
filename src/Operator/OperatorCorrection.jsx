import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, doc, updateDoc, addDoc } from "firebase/firestore";
import "./OperatorCorrection.css";

export default function OperatorCorrection() {
  const [cells, setCells] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [gap, setGap] = useState("");
  const [calculatedWeight, setCalculatedWeight] = useState(null);

  // 🔥 LIVE pobieranie komór – tak jak admin
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "cells"), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCells(list);
    });
    return () => unsub();
  }, []);

  const handleSelect = (id) => {
    const cell = cells.find((c) => c.id === id);
    setSelectedCell(cell);
    setCalculatedWeight(null);
  };

  const calculate = () => {
    if (!selectedCell || !gap) return;

    // 🔥 używamy TYLKO prawidłowego pola
    const currentWeight = selectedCell.waga || 0;

    // 🔥 stały współczynnik (tak jak w Twojej starej korekcie operatora)
    const factor = 50;

    const newWeight = currentWeight - Number(gap) * factor;
    setCalculatedWeight(newWeight > 0 ? Number(newWeight.toFixed(1)) : 0);
  };

  const saveCorrection = async () => {
    if (!selectedCell || calculatedWeight === null) return;

    // 🔥 zapis do PRAWDZIWEGO pola
    await updateDoc(doc(db, "cells", selectedCell.id), {
      waga: calculatedWeight,
      updatedAt: Date.now(),
    });

    // 🔥 zapis historii korekt – tak jak admin
    await addDoc(collection(db, "corrections"), {
      cellId: selectedCell.id,
      oldWeight: selectedCell.waga || 0,
      newWeight: calculatedWeight,
      gap: Number(gap),
      timestamp: Date.now(),
      operator: "OPERATOR",
      reason: "Korekta operatora",
    });

    alert("Korekta zapisana.");
    setGap("");
    setCalculatedWeight(null);
  };

  return (
    <div className="correction-container">
      <h2 className="correction-title">Korekta wagowa (pomiar luzu)</h2>

      <div className="correction-section">
        <label className="correction-label">Komora</label>
        <select
          className="correction-input"
          onChange={(e) => handleSelect(e.target.value)}
          value={selectedCell?.id || ""}
        >
          <option value="">-- wybierz komorę --</option>
          {cells.map((c) => (
            <option key={c.id} value={c.id}>
              {c.id} — {c.waga || 0} t
            </option>
          ))}
        </select>
      </div>

      {selectedCell && (
        <div className="correction-section">
          <label className="correction-label">Aktualna waga (t)</label>
          <div className="correction-result">{(selectedCell.waga || 0) + " t"}</div>
        </div>
      )}

      <div className="correction-section">
        <label className="correction-label">Luz (m)</label>
        <input
          type="number"
          className="correction-input"
          value={gap}
          onChange={(e) => setGap(e.target.value)}
        />
      </div>

      {calculatedWeight !== null && (
        <div className="correction-result">Nowa waga: {calculatedWeight} t</div>
      )}

      <button className="correction-btn" onClick={calculate}>
        Przelicz wagę
      </button>

      <button className="correction-btn correction-save" onClick={saveCorrection}>
        Zapisz korektę
      </button>
    </div>
  );
}
