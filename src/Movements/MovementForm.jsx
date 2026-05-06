import { useState, useEffect } from "react";
import { getFactor, tonsToMeters } from "../../utils/grainCalculations";
import "./Movements.css";

export default function MovementForm({ type, komoraOut, komoraIn, onClose, db }) {
  const [ilosc, setIlosc] = useState("");
  const [gatunek, setGatunek] = useState("PSZENICA");
  const [parametr, setParametr] = useState(""); // Białko lub Liczba Opadania
  const [uwagi, setUwagi] = useState("");
  
  // Dynamiczne przeliczenie metrów przed zapisem
  const activeKomora = type === "przyjecie" ? komoraIn : komoraOut;
  // Zakładamy, że ID komory zawiera informację o typie, np. "05N" -> wyciągamy "N"
  const siloType = activeKomora?.slice(-1) || "S"; 
  const spodziewaneMetry = tonsToMeters(Number(ilosc), gatunek, siloType);

  // Funkcja ustawiająca standardowy tonaż
  const setStandardWeight = () => {
    if (gatunek === "OWIES") setIlosc(19);
    else setIlosc(25);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const movement = {
      _id: `move_${Date.now()}`,
      type: type,
      timestamp: Date.now(),
      date: new Date().toISOString(),
      amount: Number(ilosc),
      grainType: gatunek,
      qualityParam: Number(parametr),
      siloId: activeKomora,
      notes: uwagi
    };

    // LOGIKA POUCHDB: Tutaj musisz wywołać funkcję, która aktualizuje 
    // tablicę 'layers' w dokumencie silosa w PouchDB
    console.log("Zapisywanie ruchu do PouchDB:", movement);
    
    // Tu powinna być funkcja np. updateSiloLayers(activeKomora, movement);
    
    onClose && onClose();
  };

  return (
    <div className="form-box">
      <h3>
        {type === "przyjecie" && `Przyjęcie do ${komoraIn}`}
        {type === "wydanie" && `Wydanie z ${komoraOut}`}
        {type === "przerzut" && `Przerzut ${komoraOut} -> ${komoraIn}`}
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="grain-selector">
          <label>Gatunek</label>
          <select value={gatunek} onChange={(e) => setGatunek(e.target.value)}>
            <option value="PSZENICA">Pszenica</option>
            <option value="ZYTO">Żyto</option>
            <option value="OWIES">Owies</option>
            <option value="JECZMIEN">Jęczmień</option>
            <option value="PELLET">Pellet (Otręby)</option>
          </select>
        </div>

        <div className="weight-input-group">
          <label>Ilość [t]</label>
          <div className="quick-actions">
            <input
              type="number"
              step="0.1"
              value={ilosc}
              onChange={(e) => setIlosc(e.target.value)}
              required
            />
            <button type="button" onClick={setStandardWeight} className="btn-auto">
              AUTO (+{gatunek === "OWIES" ? "19t" : "25t"})
            </button>
          </div>
          {ilosc > 0 && (
            <small className="hint">To zajmie ok. <b>{spodziewaneMetry}m</b> wysokości.</small>
          )}
        </div>

        {/* Dynamiczne pole parametru zależne od zboża */}
        <div className="quality-input">
          {gatunek === "PSZENICA" && (
            <>
              <label>Białko [%]</label>
              <input type="number" step="0.1" value={parametr} onChange={(e)=>setParametr(e.target.value)} placeholder="np. 12.5" />
            </>
          )}
          {gatunek === "ZYTO" && (
            <>
              <label>Liczba opadania [s]</label>
              <input type="number" value={parametr} onChange={(e)=>setParametr(e.target.value)} placeholder="np. 220" />
            </>
          )}
          {(gatunek === "OWIES" || gatunek === "JECZMIEN") && (
            <>
              <label>Gęstość [kg/hl]</label>
              <input type="number" value={parametr} onChange={(e)=>setParametr(e.target.value)} />
            </>
          )}
        </div>

        <label>Uwagi</label>
        <textarea value={uwagi} onChange={(e) => setUwagi(e.target.value)} />

        <div className="form-footer">
          <button type="button" onClick={onClose} className="btn-cancel">Anuluj</button>
          <button type="submit" className="action-btn">Zatwierdź i dodaj warstwę</button>
        </div>
      </form>
    </div>
  );
}