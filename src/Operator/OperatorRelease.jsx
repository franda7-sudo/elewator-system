import React, { useState } from "react";
import { useElevator } from "../context/ElevatorContext";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import "./OperatorView.css";

export default function OperatorRelease() {
  const {
    cells,
    operator,
    confirmRelease,
  } = useElevator();

  const [grain, setGrain] = useState("");
  const [amount, setAmount] = useState("");
  const [chosenCell, setChosenCell] = useState(null);

  const finalWeight = amount.trim() === "" ? 26 : Number(amount);

  const availableCells = cells.filter((c) => Number(c.waga || 0) > 0);

  const release = async () => {
    if (!chosenCell) return alert("Wybierz komorę.");
    if (!grain) return alert("Wybierz zboże.");
    if (!amount || isNaN(amount)) return alert("Podaj wagę.");

    const releaseData = {
      grain,
      weight: finalWeight,
      cell: chosenCell,
      operator: operator?.name || "operator",
      createdAt: Date.now(),
    };

    // 🔥 1) ZAPIS WYDANIA DO FIRESTORE (releases)
    await addDoc(collection(db, "releases"), {
      grain,
      weight: finalWeight,
      sourceCell: chosenCell,
      operator: operator?.name || "operator",
      timestamp: serverTimestamp(),
    });

    // 🔥 2) ZAPIS RUCHU DO FIRESTORE (movements)
    await addDoc(collection(db, "movements"), {
      type: "wydanie",
      grainType: grain,
      weight: finalWeight,
      cell: chosenCell,
      operator: operator?.name || "operator",
      timestamp: serverTimestamp(),
    });

    // 🔥 3) STARA LOGIKA — aktualizacja komór
    await confirmRelease(releaseData);

    // reset
    setGrain("");
    setAmount("");
    setChosenCell(null);

    alert("Wydanie zapisane.");
  };

  return (
    <div className="operator-view">
      <h2>Wydanie zboża</h2>

      <select
        value={grain}
        onChange={(e) => setGrain(e.target.value)}
      >
        <option value="">Wybierz zboże</option>
        <option value="pszenica">Pszenica</option>
        <option value="zyto">Żyto</option>
        <option value="jeczmien">Jęczmień</option>
        <option value="pszenzyto">Pszenżyto</option>
        <option value="kukurydza">Kukurydza</option>
      </select>

      <input
        placeholder="Waga (t)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <h3>Komory z dostępnym zbożem</h3>

      {availableCells.map((c) => (
        <div
          key={c.id}
          onClick={() => setChosenCell(c.id)}
          className={chosenCell === c.id ? "cell selected" : "cell"}
        >
          {c.id} — {Number(c.waga || 0).toFixed(1)} t
        </div>
      ))}

      <button onClick={release}>✔ Zatwierdź wydanie</button>
    </div>
  );
}
