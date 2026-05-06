import React, { useEffect, useState } from 'react';
import { diagnoseDatabase, repairDatabase } from '../db/repair';
import { exportDatabase, importDatabase } from '../db/backup';

function DiagnosticsPanel() {
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  const loadStatus = async () => {
    try {
      const diag = await diagnoseDatabase();
      setStatus(diag);
    } catch (err) {
      console.error('Błąd diagnostyki:', err);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleRepair = async () => {
    setBusy(true);
    try {
      await repairDatabase();
      await loadStatus();
    } finally {
      setBusy(false);
    }
  };

  const handleExport = async () => {
    try {
      const data = await exportDatabase();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `elewator_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Błąd eksportu:', err);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setBusy(true);
    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      await importDatabase(payload);
      await loadStatus();
    } catch (err) {
      console.error('Błąd importu:', err);
    } finally {
      setBusy(false);
      event.target.value = '';
    }
  };

  return (
    <section style={{
      marginTop: '20px',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid #dee2e6',
      background: '#f8f9fa'
    }}>
      <h2 style={{ marginTop: 0, fontSize: '1.1rem' }}>Diagnostyka bazy (PouchDB)</h2>

      {status && (
        <div style={{ marginBottom: '12px', fontSize: '0.9rem' }}>
          <div>📦 Dokumenty: <strong>{status.totalDocs}</strong></div>
          <div>❗ Brakujące silosy: <strong>{status.missing.length}</strong></div>
          <div>⚠ Uszkodzone silosy: <strong>{status.corrupted.length}</strong></div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={handleRepair}
          disabled={busy}
          style={{ padding: '6px 12px', cursor: busy ? 'wait' : 'pointer' }}
        >
          🛠 Napraw bazę
        </button>

        <button
          onClick={handleExport}
          disabled={busy}
          style={{ padding: '6px 12px', cursor: busy ? 'wait' : 'pointer' }}
        >
          💾 Eksportuj bazę
        </button>

        <label style={{ padding: '6px 12px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>
          📂 Importuj bazę
          <input
            type="file"
            accept="application/json"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
        </label>
      </div>
    </section>
  );
}

export default DiagnosticsPanel;
