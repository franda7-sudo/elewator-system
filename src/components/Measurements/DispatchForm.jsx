import { useState } from "react";
import localDB from "../../db/pouchdb";
import "./Movements.css";

export default function DispatchForm({ onClose }) {
  const [siloId, setSiloId] = useState("");
  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState("MŁYN"); // MŁYN | AUTO | PŁATKARNIA
  const [loading, setLoading] = useState(false);

  const handleDispatch = async (e) => {
    e.preventDefault();
    if (!siloId || !amount || amount <= 0) return;

    setLoading(true);
    try {
      const doc = await localDB.get(`silo_${siloId}`);
      let remainingToDispatch = parseFloat(amount);
      const totalInSilo = doc.layers.reduce((sum, l) => sum + l.amount, 0);

      if (remainingToDispatch > totalInSilo) {
        alert(`Brak wystarczającej ilości! W komorze jest tylko ${totalInSilo}t.`);
        setLoading(false);
        return;
      }

      // LOGIKA LIFO: Usuwamy warstwy od początku tablicy (indeks 0 = dno)
      while (remainingToDispatch > 0 && doc.layers.length > 0) {
        const bottomLayer = doc.layers[0];

        if (bottomLayer.amount <= remainingToDispatch) {
          remainingToDispatch -= bottomLayer.amount;
          doc.layers.shift(); // Usuwamy całą warstwę z dna
        } else {
          bottomLayer.amount -= remainingToDispatch;
          remainingToDispatch = 0; // Warstwa częściowo zużyta
        }
      }

      // Zapis ruchu w historii
      const dispatchDoc = {
        _id: `move_${Date.now()}`,
        timestamp: Date.now(),
        type: "wydanie",
        siloId: siloId,
        amount: parseFloat(amount),
        destination: destination,
        grainType: doc.grainType
      };

      await localDB.bulkDocs([doc, dispatchDoc]);
      alert(`Wydano ${amount}t z komory ${siloId} na ${destination}`);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Błąd podczas wydania.");
    }
    setLoading(false);
  };

  return (
    <div className="form-box dispatch-form">
      <h3>Wydanie Towaru / Produkcja</h3>
      <form onSubmit={handleDispatch}>
        <label>Z komory:</label>
        <input type="text" placeholder="np. 10S" value={siloId} onChange={e => setSiloId(e.target.value.toUpperCase())} />

        <label>Cel wydania:</label>
        <select value={destination} onChange={e => setDestination(e.target.value)}>
          <option value="MŁYN PSZENNY">Młyn Pszenny</option>
          <option value="MŁYN ŻYTNI">Młyn Żytni</option>
          <option value="PŁATKARNIA">Płatkarnia</option>
          <option value="AUTO / EKSPEDYCJA">Auto / Ekspedycja</option>
        </select>

        <label>Ilość [t]:</label>
        <div className="quick-actions">
           <input type="number" step="0.1" value={amount} onChange={e => setAmount(e.target.value)} />
           <button type="button" className="btn-auto" onClick={() => setAmount("25")}>25t</button>
        </div>

        <div className="form-actions">
          <button type="submit" className="action-btn dispatch" disabled={loading}>
            {loading ? "Przetwarzanie..." : "Zatwierdź Wydanie"}
          </button>
          <button type="button" className="btn-cancel" onClick={onClose}>Anuluj</button>
        </div>
      </form>
    </div>
  );
}