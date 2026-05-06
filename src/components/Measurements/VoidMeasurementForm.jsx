import { useState } from "react";
import { useElevator } from "../../context/ElevatorContext";
import { tonsToMeters } from "../../utils/grainCalculations"; // Naprawiona ścieżka
import "./Measurements.css";

export default function VoidMeasurementForm({ komora, onClose }) {
  const { cells, updateCell, addHistory } = useElevator();
  const [pustka, setPustka] = useState("");
  const [uwagi, setUwagi] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const mPustki = Number(pustka);
    const cellData = cells[komora];

    if (!cellData) {
      alert("Błąd: Nie znaleziono danych komory!");
      return;
    }

    // 1. OBLICZENIA: Przeliczamy metry pustki na tony
    // Zakładamy, że funkcja tonsToMeters przyjmuje (metry, pojemność_całkowita, typ_ziarna)
    // Jeśli Twoja funkcja działa inaczej, dostosuj argumenty.
    const iloscTon = tonsToMeters(mPustki, cellData.capacity, cellData.grain);

    // 2. AKTUALIZACJA CONTEXTU (i automatycznie PouchDB)
    updateCell(komora, {
      amount: iloscTon,
      lastMeasurement: mPustki
    });

    // 3. ZAPIS DO HISTORII
    addHistory({
      type: "measurement",
      cellId: komora,
      value: mPustki,
      unit: "m",
      calculatedAmount: iloscTon,
      message: `Pomiar pustki w ${komora}: ${mPustki}m (wyliczono: ${iloscTon}t)`,
      uwagi
    });

    alert(`Zapisano. Nowy stan komory ${komora}: ${iloscTon}t`);
    onClose && onClose();
  };

  return (
    <div className="form-box">
      <h3>Pomiar pustki — {komora}</h3>

      <form onSubmit={handleSubmit}>
        <label>Pustka od góry [m]</label>
        <input
          type="number"
          step="0.01"
          value={pustka}
          onChange={(e) => setPustka(e.target.value)}
          placeholder="np. 4.50"
          required
        />

        <label>Uwagi (opcjonalnie)</label>
        <textarea
          value={uwagi}
          onChange={(e) => setUwagi(e.target.value)}
          placeholder="np. ziarno ułożone w stożek"
        />

        <div className="form-actions">
          <button type="submit" className="action-btn">
            Zapisz i przelicz na tony
          </button>
          <button type="button" className="btn-cancel" onClick={onClose}>
            Anuluj
          </button>
        </div>
      </form>
    </div>
  );
}