import "./MassSection.css";
// Zakładamy, że masz plik z Twoimi współczynnikami (stworzymy go w Kroku 2)
import { getFactor } from "../../utils/grainCalculations"; 

export default function MassSection({ data, komora }) {
  // data to teraz obiekt z PouchDB, który ma tablicę 'layers'
  const layers = data.layers || [];
  const masaRzeczywista = layers.reduce((sum, l) => sum + (l.amount || 0), 0);
  
  // Pobieramy współczynnik (np. 39.5 dla N) na podstawie towaru i typu komory
  const factor = getFactor(data.grainType, data.type); 
  
  // Wyliczamy zajęte metry na podstawie Twoich założeń
  const zajeteMetry = factor > 0 ? (masaRzeczywista / factor).toFixed(2) : 0;
  const maxWysokosc = data.type === 'S' ? 24 : 28;
  const wolneMetry = (maxWysokosc - zajeteMetry).toFixed(2);

  // Sprawdzamy wiek najstarszej warstwy (na dnie)
  const oldestLayerDate = layers.length > 0 ? new Date(layers[0].date) : null;
  const dniZalegania = oldestLayerDate 
    ? Math.floor((new Date() - oldestLayerDate) / (1000 * 60 * 60 * 24)) 
    : 0;

  return (
    <div className="section-box">
      <div className="section-header">
        <h3>Masa i Poziom</h3>
        {dniZalegania > 30 && (
          <span className="warning-badge">ZALEGANIE: {dniZalegania} dni</span>
        )}
      </div>

      <div className="section-row">
        <div>Masa całkowita:</div>
        <div className="bold">{masaRzeczywista.toFixed(1)} t</div>
      </div>

      <div className="section-row">
        <div>Wysokość zasypu:</div>
        <div>{zajeteMetry} m / {maxWysokosc} m</div>
      </div>

      <div className="section-row highlight">
        <div>Wolne miejsce:</div>
        <div>{wolneMetry} m (ok. {(wolneMetry * factor).toFixed(1)} t)</div>
      </div>

      <div className="progress-container">
        <div 
          className={`progress-bar ${dniZalegania > 30 ? 'old-grain' : ''}`} 
          style={{ width: `${(zajeteMetry / maxWysokosc * 100)}%` }}
        ></div>
      </div>

      <div className="button-group">
        <button className="action-btn">Korekta masy</button>
        <button className="action-btn secondary">Historia dostaw</button>
      </div>
    </div>
  );
}