// /src/components/Corrections/CorrectionForm.jsx
import { useState } from "react";
import { saveCorrection } from "../../firebase/db";
import "./Corrections.css";

export default function CorrectionForm({ komora, onClose }) {
  const [nowaMasa, setNowaMasa] = useState("");
  const [powod, setPowod] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await saveCorrection(komora, {
      timestamp: Date.now(),
      nowa_masa: Number(nowaMasa),
      powod
    });

    onClose && onClose();
  };

  return (
    <div className="form-box">
      <h3>Korekta masy — {komora}</h3>

      <form onSubmit={handleSubmit}>
        <label>Nowa masa rzeczywista [t]</label>
        <input
          type="number"
          step="0.01"
          value={nowaMasa}
          onChange={(e) => setNowaMasa(e.target.value)}
          required
        />

        <label>Powód korekty</label>
        <textarea
          value={powod}
          onChange={(e) => setPowod(e.target.value)}
          required
        />

        <button type="submit" className="action-btn">
          Zapisz korektę
        </button>
      </form>
    </div>
  );
}
