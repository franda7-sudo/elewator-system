import { useState } from "react";
import { useElevator } from "../../context/ElevatorContext"; // Używamy Twojego hooka
import "./Movements.css";

export default function TransferForm({ onClose }) {
  const { cells, updateCell, addHistory } = useElevator(); // Pobieramy funkcje z Contextu
  const [fromSilo, setFromSilo] = useState("");
  const [toSilo, setToSilo] = useState("");
  const [amount, setAmount] = useState("");

  const handleTransfer = (e) => {
    e.preventDefault();
    
    // Walidacja
    if (!cells[fromSilo] || !cells[toSilo]) {
      alert("Jedna z komór nie istnieje!");
      return;
    }
    if (fromSilo === toSilo) {
      alert("Komora źródłowa i docelowa są takie same!");
      return;
    }

    const transferAmount = parseFloat(amount);
    if (transferAmount > cells[fromSilo].amount) {
      alert("Brak wystarczającej ilości towaru w komorze źródłowej!");
      return;
    }

    // 1. Odejmij z komory źródłowej
    updateCell(fromSilo, {
      amount: cells[fromSilo].amount - transferAmount
    });

    // 2. Dodaj do komory docelowej (przejmując parametry ziarna jeśli docelowa jest pusta)
    const newGrainData = cells[toSilo].amount === 0 ? {
      grain: cells[fromSilo].grain,
      humidity: cells[fromSilo].humidity,
      protein: cells[fromSilo].protein,
      density: cells[fromSilo].density,
      fallingNumber: cells[fromSilo].fallingNumber
    } : {};

    updateCell(toSilo, {
      ...newGrainData,
      amount: cells[toSilo].amount + transferAmount
    });

    // 3. Zapisz w historii
    addHistory({
      type: "transfer",
      from: fromSilo,
      to: toSilo,
      amount: transferAmount,
      message: `Przerzut ${transferAmount}t z ${fromSilo} do ${toSilo}`
    });

    alert("Przerzut wykonany pomyślnie!");
    onClose();
  };

  return (
    <div className="form-box transfer-form">
      <h3>Nowy Przerzut / Wietrzenie</h3>
      <form onSubmit={handleTransfer}>
        <label>Z komory (np. 1S, 20N):</label>
        <input type="text" value={fromSilo} onChange={e => setFromSilo(e.target.value.toUpperCase())} />

        <label>Do komory:</label>
        <input type="text" value={toSilo} onChange={e => setToSilo(e.target.value.toUpperCase())} />

        <label>Ilość [t]:</label>
        <input type="number" step="0.1" value={amount} onChange={e => setAmount(e.target.value)} />

        <div className="form-actions">
          <button type="submit" className="action-btn">Wykonaj Przerzut</button>
          <button type="button" className="btn-cancel" onClick={onClose}>Anuluj</button>
        </div>
      </form>
    </div>
  );
}