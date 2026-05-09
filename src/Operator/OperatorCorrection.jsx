import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, doc, updateDoc, addDoc } from "firebase/firestore";
import "./OperatorCorrection.css";

export default function OperatorCorrection() {
  const [cells, setCells] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [gap, setGap] = useState("");
  const [calculatedWeight, setCalculatedWeight] = useState(null);

  // 🔥 LIVE pobieranie komór
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

  // 🔥 ALGORYTM 1:1 ELEWATOR — ile JEST w komorze
  const calculate = () => {
    if (!selectedCell || !gap) return;

    const luz = Number(gap);
    const id = selectedCell.id;
    const grain = selectedCell.grainType;

    let wysokosc = 0;
    let przelicznik = 0;

    // ============================
    // 🔥 KOMORY S i G
    // ============================
    if (id.startsWith("S") || id.startsWith("G")) {
      wysokosc = 24;

      if (grain === "pszenica") przelicznik = 11.5;
      if (grain === "żyto")     przelicznik = 11;
      if (grain === "owies")    przelicznik = 8;
      if (grain === "jęczmień") przelicznik = 10;
      if (grain === "pellet")   przelicznik = 10;
    }

    // ============================
    // 🔥 KOMORY N
    // ============================
    if (id.startsWith("N")) {
      wysokosc = 28;

      if (grain === "pszenica") przelicznik = 39.5;
      if (grain === "żyto")     przelicznik = 39;
    }

    // ============================
    // 🔥 KOMORY W
    // ============================
    if (id.endsWith("W")) {
      wysokosc = 24;

      if (id === "43W") przelicznik = 4;
      if (["44W","45W","48W","49W","51W","52W"].includes(id)) przelicznik = 2.5;
      if (["46W","47W","50W"].includes(id)) przelicznik = 5;
    }

    // ============================
    // 🔥 OBLICZENIA
    // ============================
    const zasypanie = wysokosc - luz;
    const newWeight = zasypanie * przelicznik;

    setCalculatedWeight(newWeight > 0 ? Number(newWeight.toFixed(1)) : 0);
  };

  const saveCorrection = async () => {
    if (!selectedCell || calculatedWeight === null) return;

    await updateDoc(doc(db, "cells", selectedCell.id), {
      waga: calculatedWeight,
      updatedAt: Date.now(),
    });

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
