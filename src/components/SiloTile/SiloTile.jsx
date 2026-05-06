// src/components/SiloTile/SiloTile.jsx

import React from 'react';

function SiloTile({ silo }) {
  // 🔥 Twarde zabezpieczenie przed błędami
  if (!silo || typeof silo !== 'object') {
    return (
      <div style={{
        padding: '12px',
        background: '#ffdddd',
        border: '1px solid red',
        borderRadius: '6px',
        width: '140px',
        textAlign: 'center'
      }}>
        <strong>Błąd silosu</strong>
        <div>Brak danych</div>
      </div>
    );
  }

  const { _id, type, capacity, layers } = silo;

  // 🔥 Kolejne zabezpieczenie
  if (!Array.isArray(layers)) {
    return (
      <div style={{
        padding: '12px',
        background: '#ffe5cc',
        border: '1px solid #ff8800',
        borderRadius: '6px',
        width: '140px',
        textAlign: 'center'
      }}>
        <strong>Uszkodzony silos</strong>
        <div>{_id}</div>
      </div>
    );
  }

  // Obliczamy poziom napełnienia
  const total = layers.reduce((sum, l) => sum + (l.amount || 0), 0);
  const percent = Math.min(100, Math.round((total / capacity) * 100));

  // Kolorowanie
  const color =
    percent >= 90 ? '#ff4d4d' :
    percent >= 60 ? '#ffcc00' :
    '#4caf50';

  return (
    <div style={{
      width: '140px',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      background: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      textAlign: 'center'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>{_id}</div>
      <div style={{ fontSize: '0.85rem', marginBottom: '6px' }}>
        Typ: <strong>{type}</strong>
      </div>

      <div style={{
        height: '16px',
        width: '100%',
        background: '#eee',
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: '6px'
      }}>
        <div style={{
          height: '100%',
          width: `${percent}%`,
          background: color,
          transition: 'width 0.3s'
        }} />
      </div>

      <div style={{ fontSize: '0.85rem' }}>
        {total} / {capacity} t
      </div>
    </div>
  );
}

export default SiloTile;
