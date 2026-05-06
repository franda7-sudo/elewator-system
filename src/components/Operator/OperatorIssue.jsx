import React, { useState, useMemo } from "react";
import { useElevator } from "../context/ElevatorContext";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export default function OperatorIssue() {
  const { cells, operator, confirmUnload, grainDefinitions } = useElevator();
  const [grain, setGrain] = useState("");
  const [selectedCells, setSelectedCells] = useState([]);
  const [weights, setWeights] = useState({});
  const [docNumber, setDocNumber] = useState("");

  const grainList = Object.keys(grainDefinitions || {});

  const grainCells = useMemo(() => {
    if (!grain) return [];
    return cells.filter((c) => 
      String(c.grain || "").toLowerCase() === String(grain).toLowerCase() && 
      Number(c.waga || 0) > 0
    );
  }, [cells, grain]);

  const totalIssued = Object.values(weights).reduce((sum, v) => sum + (Number(v) || 0), 0);

  const canConfirm = grain && selectedCells.length > 0 && totalIssued > 0;

  const confirm = async () => {
    if (!canConfirm) return alert("Uzupełnij dane wydania.");

    if (!window.confirm(`Potwierdzasz wydanie ${totalIssued}t zboża ${grain}?`)) return;

    try {
      // PRACUJEMY NA KOPII SELECTED CELLS
      for (const rawId of selectedCells) {
        // Czyścimy ID na wypadek spacji lub różnicy wielkości liter
        const cellId = String(rawId).trim();
        const cellData = cells.find(c => String(c.id).trim() === cellId);

        if (!cellData) {
          console.error(`Nie znaleziono danych dla komory: ${cellId}`);
          continue; 
        }

        const issueVal = Number(weights[cellId] || 0);
        const currentVal = Number(cellData.waga || 0);
        const finalVal = Math.max(0, currentVal - issueVal);

        console.log(`PROCES: Komora ${cellId} | ${currentVal}t -> ${finalVal}t`);

        // REFERENCJA DO FIRESTORE
        const cellRef = doc(db, "cells", cellId);

        const updatePayload = {
          waga: Number(finalVal.toFixed(2)),
          updatedAt: Date.now()
        };

        // Reset komory jeśli pusta
        if (finalVal <= 0) {
          updatePayload.grain = null;
          updatePayload.groupId = null;
          updatePayload.firstFill = null;
          updatePayload.firstFillDate = null;
          console.log(`KOMORA ${cellId} ZOSTANIE WYCZYSZCZONA`);
        }

        // --- KLUCZOWY MOMENT: ZAPIS ---
        await updateDoc(cellRef, updatePayload);
        
        // REJESTRACJA W LOGACH
        await confirmUnload({
          id: `WZ-${Date.now()}-${cellId}`,
          grain,
          amount: issueVal,
          cell: cellId,
          operator: operator?.name || "operator",
        });
      }

      alert("✔ Baza danych została zaktualizowana pomyślnie.");
      
      // RESET FORMULARZA
      setGrain("");
      setSelectedCells([]);
      setWeights({});
      setDocNumber("");

    } catch (err) {
      console.error("BŁĄD PODCZAS AKTUALIZACJI:", err);
      alert("Wystąpił błąd zapisu do bazy. Sprawdź konsolę.");
    }
  };

  return (
    <div style={{ padding: 20, color: "white", maxWidth: 800, margin: "auto" }}>
      <h2 style={{ color: "#3b82f6", marginBottom: 20 }}>Panel Wydania Towaru</h2>
      
      <div style={{ marginBottom: 20 }}>
        <label>Wybierz rodzaj zboża:</label>
        <select 
          value={grain} 
          onChange={(e) => { setGrain(e.target.value); setSelectedCells([]); setWeights({}); }}
          style={{ width: "100%", padding: 12, marginTop: 10, background: "#1e293b", color: "white", borderRadius: 8, border: "1px solid #475569" }}
        >
          <option value="">-- wybierz --</option>
          {grainList.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {grain && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10 }}>
          {grainCells.map(c => (
            <div 
              key={c.id} 
              onClick={() => setSelectedCells(prev => prev.includes(c.id) ? prev.filter(x => x !== c.id) : [...prev, c.id])}
              style={{
                padding: "15px 10px", borderRadius: 10, cursor: "pointer", textAlign: "center",
                background: selectedCells.includes(c.id) ? "#2563eb" : "#334155",
                border: selectedCells.includes(c.id) ? "2px solid #fff" : "1px solid #475569",
                transition: "0.2s"
              }}
            >
              <div style={{ fontSize: 18, fontWeight: "bold" }}>{c.id}</div>
              <div style={{ fontSize: 12, opacity: 0.9 }}>{c.waga} t</div>
            </div>
          ))}
          {grainCells.length === 0 && <p style={{ gridColumn: "1/-1", textAlign: "center", opacity: 0.7 }}>Brak komór z tym ziarnem.</p>}
        </div>
      )}

      {selectedCells.length > 0 && (
        <div style={{ marginTop: 30, background: "#1e293b", padding: 20, borderRadius: 15, boxShadow: "0 4px 6px rgba(0,0,0,0.3)" }}>
          <h3 style={{ marginTop: 0 }}>Wprowadź wagi wydań:</h3>
          {selectedCells.map(id => (
            <div key={id} style={{ marginBottom: 15 }}>
              <label style={{ fontSize: 14 }}>Komora <b>{id}</b> (tony):</label>
              <input 
                type="number" 
                value={weights[id] || ""} 
                onChange={e => setWeights(prev => ({...prev, [id]: e.target.value}))}
                style={{ width: "100%", padding: 12, marginTop: 5, background: "#0f172a", color: "white", border: "1px solid #334155", borderRadius: 8 }}
                placeholder={`Dostępne: ${cells.find(c => c.id === id)?.waga}t`}
              />
            </div>
          ))}
          
          <input 
            placeholder="Numer dokumentu WZ (opcjonalnie)" 
            value={docNumber} 
            onChange={e => setDocNumber(e.target.value)}
            style={{ width: "100%", padding: 12, marginBottom: 20, background: "#0f172a", color: "white", border: "1px solid #334155", borderRadius: 8 }}
          />

          <button 
            onClick={confirm} 
            disabled={!canConfirm}
            style={{ 
              width: "100%", padding: 18, borderRadius: 10, fontSize: 18, fontWeight: "bold",
              background: canConfirm ? "#10b981" : "#475569", color: "white", border: "none", cursor: canConfirm ? "pointer" : "not-allowed"
            }}
          >
            WYDAJ ŁĄCZNIE {totalIssued.toFixed(2)} t
          </button>
        </div>
      )}
    </div>
  );
}