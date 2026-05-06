import React, { useState, useEffect } from "react";
import { useElevator } from "../context/ElevatorContext";
import { db } from "../firebase";
import { collection, onSnapshot, doc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { LUZ_COEFFICIENTS, CELL_CAPACITY } from "./luzCoefficients";
import ReportLayout from "../Reports/ReportLayout";

export default function AdminMasterCorrection() {
  const { operator, cells } = useElevator(); // Używamy Twojego contextu

  // Stany formularza
  const [selectedCellId, setSelectedCellId] = useState("");
  const [luz, setLuz] = useState("");
  const [manualData, setManualData] = useState({ waga: "", commodity: "", capacity: "" });
  const [reason, setReason] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Funkcja pomocnicza do detekcji typu (Twoja logika)
  const detectCellType = (id) => {
    const lastChar = id.charAt(id.length - 1).toUpperCase();
    return ["S", "N", "G", "W"].includes(lastChar) ? lastChar : "S";
  };

  // 1. Reakcja na wybór komory - załadowanie danych
  const handleCellSelect = (id) => {
    setSelectedCellId(id);
    const cell = cells.find(c => c.id === id);
    if (cell) {
      setManualData({
        waga: cell.waga || 0,
        commodity: cell.commodity || cell.grain || "",
        capacity: cell.capacity || CELL_CAPACITY[id] || CELL_CAPACITY[detectCellType(id)] || 200
      });
      setLuz(""); // Resetujemy kalkulator metra
    }
  };

  // 2. Logika obliczeń "z metra" (Twoja logika)
  const handleCalculateFromLuz = () => {
    if (!luz || Number(luz) < 0) return alert("Podaj poprawny luz!");
    
    const type = detectCellType(selectedCellId);
    const grain = manualData.commodity;
    
    let coeff = type === "W" ? LUZ_COEFFICIENTS.W[selectedCellId] : LUZ_COEFFICIENTS[type]?.[grain];
    
    if (!coeff) return alert("Brak przelicznika dla tego towaru/typu komory!");

    const capacity = manualData.capacity;
    const newWeight = Math.max(0, capacity - Number(luz) * coeff);
    
    setManualData({ ...manualData, waga: newWeight.toFixed(1) });
  };

  // 3. Zapis końcowy (Audit Log + Update)
  const handleFinalSave = async (e) => {
    e.preventDefault();
    if (!selectedCellId || !reason) return alert("Podaj powód korekty!");

    setIsSaving(true);
    try {
      const cell = cells.find(c => c.id === selectedCellId);
      
      // Update w Firestore
      await updateDoc(doc(db, "cells", selectedCellId), {
        waga: Number(manualData.waga),
        commodity: manualData.commodity,
        grain: manualData.commodity, // Zapisujemy w obu dla spójności
        capacity: Number(manualData.capacity),
        lastUpdate: serverTimestamp()
      });

      // Audit Log
      await addDoc(collection(db, "corrections"), {
        cellId: selectedCellId,
        oldData: { waga: cell.waga, commodity: cell.commodity || cell.grain },
        newData: { ...manualData },
        luzUsed: luz || "Ręcznie",
        reason: reason,
        operator: operator?.name || "Admin",
        timestamp: serverTimestamp()
      });

      alert("Korekta zapisana!");
      setReason("");
    } catch (err) {
      alert("Błąd: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ReportLayout title="ADMIN MASTER: Korekta i Inwentaryzacja">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* LEWA: SELEKTOR KOMÓR */}
        <div className="xl:col-span-3 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
          <h3 className="text-zinc-500 text-[10px] font-bold uppercase mb-4 tracking-tighter">Status Komór (Live)</h3>
          <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
            {cells.map(c => (
              <button
                key={c.id}
                onClick={() => handleCellSelect(c.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedCellId === c.id 
                  ? "bg-amber-600 border-amber-400 shadow-lg" 
                  : "bg-zinc-800 border-zinc-700 hover:border-zinc-500"
                }`}
              >
                <div className={`text-xs font-black ${selectedCellId === c.id ? "text-white" : "text-zinc-300"}`}>{c.id}</div>
                <div className={`text-[10px] truncate ${selectedCellId === c.id ? "text-amber-100" : "text-zinc-500"}`}>
                  {c.commodity || c.grain || "Pusta"}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* PRAWA: FORMULARZ HYBRYDOWY */}
        <div className="xl:col-span-9">
          {selectedCellId ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Sekcja A: Obliczenia z metra */}
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
                <h4 className="text-amber-500 font-bold text-sm uppercase italic">1. Pomiar z natury (Luz)</h4>
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold mb-2 block">Luz (wolne metry)</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" step="0.01" value={luz}
                      onChange={(e) => setLuz(e.target.value)}
                      className="flex-1 bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-white font-mono text-xl"
                      placeholder="0.00"
                    />
                    <button 
                      onClick={handleCalculateFromLuz}
                      className="bg-amber-600 hover:bg-amber-500 text-white px-4 rounded-lg font-bold text-xs"
                    >
                      PRZELICZ
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-zinc-600 italic">
                  * System użyje przelicznika dla: {manualData.commodity || "Wybierz towar po prawej"}
                </p>
              </div>

              {/* Sekcja B: Edycja Ręczna */}
              <form onSubmit={handleFinalSave} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
                <h4 className="text-zinc-400 font-bold text-sm uppercase italic">2. Dane końcowe (Pełna edycja)</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">Towar</label>
                    <input 
                      value={manualData.commodity}
                      onChange={(e) => setManualData({...manualData, commodity: e.target.value})}
                      className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 font-bold uppercase block mb-1">Waga (t)</label>
                    <input 
                      type="number" step="0.1" value={manualData.waga}
                      onChange={(e) => setManualData({...manualData, waga: e.target.value})}
                      className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-amber-500 font-black text-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-red-500 font-bold uppercase block mb-1">Powód korekty (Audit Log)</label>
                  <textarea 
                    required value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-white text-sm min-h-[60px]"
                    placeholder="np. Błędny tonaż przy przyjęciu / Inwentaryzacja majowa"
                  />
                </div>

                <button 
                  disabled={isSaving}
                  className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-zinc-200 transition-all shadow-xl"
                >
                  {isSaving ? "ZAPISYWANIE..." : "ZATWIERDŹ ZMIANY W BAZIE"}
                </button>
              </form>

            </div>
          ) : (
            <div className="bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl h-64 flex items-center justify-center text-zinc-600 italic">
              Wybierz komorę z listy, aby edytować jej parametry
            </div>
          )}
        </div>
      </div>
    </ReportLayout>
  );
}