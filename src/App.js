// src/App.js

// 1. Importy bibliotek
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// 2. Importy modułów bazy
import localDB from './db/pouchdb';
import { repairDatabase } from './db/repair';
import { runMigrations } from './db/migrations';

// 3. Importy komponentów widoków
import ElevatorOverview from "./ElevatorOverview/ElevatorOverview";import DiagnosticsPage from './pages/DiagnosticsPage';

// 4. Style globalne
import './index.css';

// 5. Inicjalizacja bazy (migracje + naprawa)
const initDatabase = async () => {
  try {
    console.log('🔧 Start inicjalizacji bazy...');

    await runMigrations();
    await repairDatabase();

    console.log('✅ Baza gotowa.');
    return true;
  } catch (err) {
    console.error('❌ Błąd podczas inicjalizacji bazy:', err);
    return false;
  }
};

function App() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      await initDatabase();
      setDbReady(true);
    };
    prepare();
  }, []);

  if (!dbReady) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Ładowanie bazy danych...</h2>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {/* Nagłówek */}
        <header
          style={{
            background: 'var(--color-ui-blue)',
            color: 'white',
            padding: '1rem 2rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>
            System Zarządzania Elewatorem v1.0
          </h1>

          <nav style={{ display: 'flex', gap: '20px' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
              Główna
            </Link>
            <Link
              to="/diagnostics"
              style={{ color: 'white', textDecoration: 'none' }}
            >
              Diagnostyka
            </Link>
          </nav>
        </header>

        {/* Główna zawartość z routingiem */}
        <main style={{ padding: '20px', paddingBottom: '60px' }}>
          <Routes>
            <Route path="/" element={<ElevatorOverview />} />
            <Route path="/diagnostics" element={<DiagnosticsPage />} />
          </Routes>
        </main>

        {/* Stopka */}
        <footer
          style={{
            position: 'fixed',
            bottom: 0,
            width: '100%',
            background: '#f8f9fa',
            padding: '5px 20px',
            fontSize: '0.8rem',
            borderTop: '1px solid #dee2e6',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <span>
            Status bazy: Połączono (PouchDB, auto-naprawa, migracje, backup)
          </span>
          <span>2026 Elewator Admin System</span>
        </footer>
      </div>
    </Router>
  );
}

export default App;
