import { useEffect, useState } from "react";
// Importujemy bazę lokalną PouchDB (zakładając, że masz ją zainicjowaną w db.js)
import localDB from "../../db/pouchdb"; 
import "./Movements.css";

export default function MovementsHistory() {
  const [ruchy, setRuchy] = useState([]);

  useEffect(() => {
    // Pobieramy historię z PouchDB (wszystkie dokumenty zaczynające się od 'move_')
    const fetchHistory = async () => {
      try {
        const result = await localDB.allDocs({
          include_docs: true,
          startkey: 'move_',
          endkey: 'move_\uffff'
        });
        
        const arr = result.rows
          .map(row => row.doc)
          .sort((a, b) => b.timestamp - a.timestamp);
        
        setRuchy(arr);
      } catch (err) {
        console.error("Błąd pobierania historii:", err);
      }
    };

    fetchHistory();

    // Opcjonalnie: Nasłuchiwanie zmian na żywo
    const changes = localDB.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', fetchHistory);

    return () => changes.cancel();
  }, []);

  return (
    <div className="history-box">
      <div className="history-header">
        <h3>Dziennik Elewatora</h3>
        <button className="btn-small" onClick={() => window.print()}>Drukuj raport</button>
      </div>

      <table className="history-table">
        <thead>
          <tr>
            <th>Data i Godz.</th>
            <th>Typ</th>
            <th>Komora</th>
            <th>Towar</th>
            <th>Parametry</th> {/* Nowa kluczowa kolumna */}
            <th>Ilość [t]</th>
            <th>Uwagi</th>
          </tr>
        </thead>

        <tbody>
          {ruchy.map((r) => (
            <tr key={r._id} className={`row-${r.type}`}>
              <td>{new Date(r.timestamp).toLocaleString('pl-PL', { 
                day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
              })}</td>
              <td className="type-cell">
                <span className={`badge ${r.type}`}>{r.type.toUpperCase()}</span>
              </td>
              <td>
                {r.type === "przerzut"
                  ? `${r.out} → ${r.in}`
                  : r.siloId || r.komora}
              </td>
              <td className="grain-cell">{r.grainType}</td>
              <td className="quality-cell">
                {/* Logika wyświetlania właściwego parametru */}
                {r.grainType === "PSZENICA" && r.qualityParam && `B: ${r.qualityParam}%`}
                {r.grainType === "ZYTO" && r.qualityParam && `L.O: ${r.qualityParam}s`}
                {(r.grainType === "OWIES" || r.grainType === "JECZMIEN") && r.qualityParam && `G: ${r.qualityParam}`}
                {!r.qualityParam && "-"}
              </td>
              <td className="amount-cell"><b>{r.amount || r.ilosc} t</b></td>
              <td className="notes-cell">{r.notes || r.uwagi || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}