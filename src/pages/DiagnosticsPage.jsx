import React from 'react';
import DiagnosticsPanel from '../components/DiagnosticsPanel';

function DiagnosticsPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Diagnostyka bazy danych</h1>
      <DiagnosticsPanel />
    </div>
  );
}

export default DiagnosticsPage;
