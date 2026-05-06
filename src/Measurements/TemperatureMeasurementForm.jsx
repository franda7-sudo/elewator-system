// /src/components/Measurements/TemperatureMeasurementForm.jsx
import { useState } from "react";
import { saveTemperatureMeasurement } from "../../firebase/db";
import "./Measurements.css";

export default function TemperatureMeasurementForm({ komora, onClose }) {
  const [minT, setMinT] = useState("");
  const [maxT, setMaxT] = useState("");
  const [avgT, setAvgT] = useState("");
  const [uwagi, setUwagi] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await saveTemperatureMeasurement(komora, {
      min: Number(minT),
      max: Number(maxT),
      avg: Number(avgT),
      deltaT: Number(maxT) - Number(minT),
      timestamp: Date.now(),
      uwagi
    });

    onClose && onClose();
  };

  return (
    <div className="form-box">
      <h3>Pomiar temperatury — {komora}</h3>

      <form onSubmit={handleSubmit}>
        <label>Temperatura minimalna [°C]</label>
        <input
          type="number"
          step="0.1"
          value={minT}
          onChange={(e) => setMinT(e.target.value)}
          required
        />

        <label>Temperatura maksymalna [°C]</label>
        <input
          type="number"
          step="0.1"
          value={maxT}
          onChange={(e) => setMaxT(e.target.value)}
          required
        />

        <label>Temperatura średnia [°C]</label>
        <input
          type="number"
          step="0.1"
          value={avgT}
          onChange={(e) => setAvgT(e.target.value)}
          required
        />

        <label>Uwagi (opcjonalnie)</label>
        <textarea
          value={uwagi}
          onChange={(e) => setUwagi(e.target.value)}
        />

        <button type="submit" className="action-btn">
          Zapisz pomiar
        </button>
      </form>
    </div>
  );
}
