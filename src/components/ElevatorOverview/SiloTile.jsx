import React from 'react';
import './SiloTile.css';

export default function SiloTile({ silo }) {
  // ZABEZPIECZENIE: Jeśli silo jest undefined, nie próbuj czytać jego właściwości
  if (!silo) {
    return <div className="silo-tile is-empty">?</div>;
  }

  // Bezpieczne przypisanie - jeśli layers nie istnieje, daj pustą tablicę
  const id = silo._id || "N/A";
  const capacity = silo.capacity || 100;
  const layers = silo.layers || []; 

  // Obliczanie tonażu z użyciem opcjonalnego łańcucha (?. )
  const currentTons = layers.reduce((sum, layer) => {
    return sum + (layer?.tons || 0);
  }, 0);

  const fillPercent = Math.min(100, (currentTons / capacity) * 100);
  const goodsType = layers.length > 0 ? layers[layers.length - 1]?.type : 'empty';

  const getGoodsClass = (type) => {
    const t = String(type || 'empty').toLowerCase();
    if (t.includes('pszenica')) return 'is-pszenica';
    if (t.includes('zyto') || t.includes('żyto')) return 'is-zyto';
    if (t.includes('owies')) return 'is-owies';
    return 'is-empty';
  };

  return (
    <div className={`silo-tile ${getGoodsClass(goodsType)}`}>
      <div className="silo-fill" style={{ height: `${fillPercent}%` }}></div>
      <div className="silo-details">
        <span className="silo-id">{id.replace('silo_', '')}</span>
        {currentTons > 0 && <span className="silo-tons">{currentTons.toFixed(1)}t</span>}
      </div>
    </div>
  );
}