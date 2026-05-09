import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import "./OperatorCorrection.css";

export default function OperatorCorrection() {
  const [cells, setCells] = useState([]);
  const [cellId, setCellId] = useState("");
  const [luz, setLuz] = useState("");
  const [calculatedWeight, setCalculatedWeight] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "cells"), (snap) => {
      setCells(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // 🔥 Rozpoznanie typu komory
  const detectCellType = (id) => {
    if (id.endsWith("S")) return "S";
    if (id.endsWith("G")) return "G";
    if (id.endsWith("N")) return "N";
    if (id.endsWith("W")) return "W";
    return "S";
  };

  // 🔥 GŁÓWNY ALGORYTM — ILE JEST W KOMORZE
  const handleCalculate = () => {
    if (!cellId || !luz) return;

    const cell = cells.find((c) => c.id === cellId);
    if (!cell || !cell.grain) {
      alert("Komora pusta lub brak przypisanego towaru!");
      return;
    }

    const type = detectCellType(cellId);
    const grain = cell.grain;

    let wysokosc = 0;
    let przelicznik = 0;

    // ============================
    // 🔥 KOMORY S i G
    // ============================
    if (type === "S" || type === "G") {
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
    if (type === "N") {
      wysokosc = 28;

      if (grain === "pszenica") przelicznik = 39.5;
      if (grain === "żyto")     przelicznik = 39;
    }

    // ============================
    // 🔥 KOMORY W
    // ============================
    if (type === "W") {
      wysokosc = 24;

      if (cellId === "43W") przelicznik = 4;
      if (["44W","45W","48W","49W","51W","52W"].includes(cellId)) przelicznik = 2.5;
      if (["46W","47W","50W"].includes(cellId)) przelicznik = 5;
    }

    // ============================
    // 🔥 OBLICZENIA
    // ============================
    const zasypanie = wysokosc - Number(luz);
    const newWeight = zasypanie * przelicznik;

    setCalculatedWeight(newWeight > 0 ? Number(newWeight.toFixed(1)) : 0);
  };

  const handleSave = async () => {
    if (!cellId || calculatedWeight === null) return;

    const cell = cells.find((c) => c.id === cellId);

    await updateDoc(doc(db, "cells", cellId), {
      waga: calculatedWeight,
      updatedAt: Date.now(),
    });

    await addDoc(collection(db, "corrections"), {
      cellId,
      luz: Number(luz),
      oldWeight: cell?.waga || 0,
      newWeight: calculatedWeight,
      reason: "Korekta operatora",
      operator: "ADMIN",
      timestamp: Date.now(),
    });

    alert("Zapisano korektę.");
    setCalculatedWeight(null);
    setLuz("");
  };

  return (
    <div className="correction-container">
      <h2 className="correction-title">Korekta wagowa (ADMIN)</h2>

      {/* KOMORA */}
      <div className="correction-section">
        <label className="correction-label">Komora</label>

        <select
          className="correction-input"
          value={cellId}
          onChange={(e) => {
            setCellId(e.target.value);
            setCalculatedWeight(null);
          }}
        >
          <option value="">Wybierz...</option>
          {cells.map((c) => (
            <option key={c.id} value={c.id}>
              {c.id} — {c.waga || 0} t ({c.grain || "---"})
            </option>
          ))}
        </select>
      </div>

      {/* AKTUALNA WAGA */}
      {cellId && (
        <div className="correction-section">
          <label className="correction-label">Aktualna waga (t)</label>
          <div className="correction-result">
            {(cells.find((c) => c.id === cellId)?.waga || 0) + " t"}
          </div>
        </div>
      )}

      {/* LUZ */}
      <div className="correction-section">
        <label className="correction-label">Luz (m)</label>

        <input
          type="number"
          step="0.01"
          className="correction-input"
          value={luz}
          onChange={(e) => setLuz(e.target.value)}
          placeholder="0.00"
        />
      </div>

      {/* WYNIK */}
      {calculatedWeight !== null && (
        <div className="correction-result">
          Nowa waga: {calculatedWeight} t
        </div>
      )}

      <button className="correction-btn" onClick={handleCalculate}>
        Przelicz wagę
      </button>

      {calculatedWeight !== null && (
        <button className="correction-btn correction-save" onClick={handleSave}>
          Zapisz korektę
        </button>
      )}
    </div>
  );
}
