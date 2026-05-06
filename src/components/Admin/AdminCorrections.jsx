import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { LUZ_COEFFICIENTS } from "./luzCoefficients";
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

  const detectCellType = (id) => {
    if (id.endsWith("S")) return "S";
    if (id.endsWith("N")) return "N";
    if (id.endsWith("G")) return "G";
    if (id.endsWith("W")) return "W";
    return "S";
  };

  const handleCalculate = () => {
    if (!cellId || !luz) return;

    const cell = cells.find((c) => c.id === cellId);
    if (!cell || !cell.grain) {
      alert("Komora pusta lub brak przypisanego towaru!");
      return;
    }

    const type = detectCellType(cellId);
    const grain = cell.grain;

    const coeff =
      type === "W"
        ? LUZ_COEFFICIENTS.W[cellId]
        : LUZ_COEFFICIENTS[type]?.[grain];

    if (!coeff) {
      alert(`Brak współczynnika dla ${type}/${grain}`);
      return;
    }

    // 🔥 KLUCZOWA POPRAWKA — operator liczy od aktualnej wagi, NIE od capacity
    const currentWeight = cell.waga || 0;

    const newWeight = currentWeight - Number(luz) * coeff;
    setCalculatedWeight(Number(newWeight.toFixed(1)));
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
      operator: "OPERATOR",
      timestamp: Date.now(),
    });

    alert("Zapisano korektę.");
    setCalculatedWeight(null);
    setLuz("");
  };

  return (
    <div className="correction-container">
      <h2 className="correction-title">Korekta wagowa (pomiar lustra)</h2>

      {/* KOMORA */}
      <div className="correction-section">
        <label htmlFor="cellSelect" className="correction-label">
          Komora
        </label>

        <select
          id="cellSelect"
          name="cellSelect"
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
        <label htmlFor="luzInput" className="correction-label">
          Luz (m)
        </label>

        <input
          id="luzInput"
          name="luzInput"
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
        <button
          className="correction-btn correction-save"
          onClick={handleSave}
        >
          Zapisz korektę
        </button>
      )}
    </div>
  );
}
