import React, { useEffect, useState } from "react";
import { collection, onSnapshot, doc, runTransaction, serverTimestamp, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../firebase";
import ReportLayout from "../../Reports/ReportLayout";
import "./OperatorsPanel.css";

export default function TransfersPanel() {
  const [transfers, setTransfers] = useState([]);
  const [cells, setCells] = useState([]);
  
  // Stan formularza
  const [formData, setFormData] = useState({ from: "", to: "", amount: "" });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // 1. Pobieranie ostatnich przerzutów (Live)
    const qTransfers = query(collection(db, "transfers"), orderBy("timestamp", "desc"), limit(8));
    const unsub1 = onSnapshot(qTransfers, (snap) => {
      setTransfers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    // 2. Pobieranie stanu komór (Live)
    const unsub2 = onSnapshot(collection(db, "cells"), (snap) => {
      setCells(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => { unsub1(); unsub2(); };
  }, []);

  // --- LOGIKA POMOCNICZA ---
  const getCellData = (cellId) => cells.find((x) => x.id === cellId);

  const getFillPercent = (cellId) => {
    const c = getCellData(cellId);
    if (!c || !c.capacity || !c.waga) return 0;
    return Math.round((Number(c.waga) / Number(c.capacity)) * 100);
  };

  const fillColor = (p) => {
    if (p >= 95) return "#dc2626"; // Krytycznie - Czerwony
    if (p >= 85) return "#f59e0b"; // Ostrzeżenie - Pomarańczowy
    return "#16a34a"; // OK - Zielony
  };

  // --- OBSŁUGA TRANSAKCJI (LOGISTYKA) ---
  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    const { from, to, amount } = formData;
    const numAmount = parseFloat(amount);

    if (!from || !to || isNaN(numAmount) || numAmount <= 0) {
      alert("⚠️ Proszę wypełnić poprawnie wszystkie pola.");
      return;
    }

    if (from === to) {
      alert("❌ Komora źródłowa i docelowa muszą być różne!");
      return;
    }

    setIsProcessing(true);

    try {
      await runTransaction(db, async (transaction) => {
        const fromRef = doc(db, "cells", from);
        const toRef = doc(db, "cells", to);

        const fromSnap = await transaction.get(fromRef);
        const toSnap = await transaction.get(toRef);

        if (!fromSnap.exists() || !toSnap.exists()) throw "Błąd: Jedna z komór nie istnieje w bazie.";

        const fromData = fromSnap.data();
        const toData = toSnap.data();

        // --- WALIDACJA MIESZANIA ZBÓŻ ---
        const sourceCommodity = fromData.commodity || "";
        const destCommodity = toData.commodity || "";
        const destWeight = Number(toData.waga || 0);

        // Jeśli cel nie jest pusty, sprawdź czy towar jest ten sam
        if (destWeight > 0 && destCommodity !== "" && sourceCommodity !== destCommodity) {
          throw `🛑 ZABRONIONE: Nie można mieszać ${sourceCommodity} z ${destCommodity}!`;
        }

        const currentSourceWaga = Number(fromData.waga || 0);
        if (currentSourceWaga < numAmount) throw "❌ Niewystarczająca ilość towaru w komorze źródłowej!";

        // --- WYKONANIE ZMIAN ---
        // 1. Odejmij od źródła
        transaction.update(fromRef, {
          waga: currentSourceWaga - numAmount,
          // Jeśli komora zostaje całkiem opróżniona, czyścimy przypisany towar
          commodity: (currentSourceWaga - numAmount) <= 0 ? "" : sourceCommodity,
          lastUpdate: serverTimestamp()
        });

        // 2. Dodaj do celu
        transaction.update(toRef, {
          waga: (Number(toData.waga) || 0) + numAmount,
          commodity: sourceCommodity, // Przypisz/potwierdź rodzaj zboża
          lastUpdate: serverTimestamp()
        });

        // 3. Zapisz w logach
        const logRef = doc(collection(db, "transfers"));
        transaction.set(logRef, {
          fromCell: from,
          toCell: to,
          amount: numAmount,
          commodity: sourceCommodity,
          timestamp: Date.now(),
          operator: "Administrator_Systemu" // Docelowo pobierane z Auth
        });
      });

      setFormData({ from: "", to: "", amount: "" });
      alert("✅ Przerzut zakończony sukcesem.");
    } catch (err) {
      alert(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ReportLayout title="Panel Logistyki: Zarządzanie Przerzutami">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 p-4">
        
        {/* SEKCOWANE MENU OPERACYJNE (LEWO) */}
        <div className="xl:col-span-4 space-y-6">
          <section className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-xl">
            <h2 className="text-xl font-bold mb-6 text-amber-500 flex items-center gap-2">
              <span className="p-2 bg-amber-500/10 rounded-lg">🔄</span> Nowy Przerzut
            </h2>
            
            <form onSubmit={handleTransferSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Źródło (Skąd)</label>
                <select 
                  className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-xl focus:ring-2 focus:ring-amber-500 transition-all outline-none"
                  value={formData.from}
                  onChange={(e) => setFormData({...formData, from: e.target.value})}
                >
                  <option value="">Wybierz komorę...</option>
                  {cells.filter(c => Number(c.waga) > 0).map(c => (
                    <option key={c.id} value={c.id}>{c.id} — {c.commodity} ({c.waga}t)</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-center -my-2">
                <div className="bg-zinc-800 p-2 rounded-full border border-zinc-700 text-zinc-500 text-sm">↓</div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Cel (Dokąd)</label>
                <select 
                  className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-xl focus:ring-2 focus:ring-green-500 transition-all outline-none"
                  value={formData.to}
                  onChange={(e) => setFormData({...formData, to: e.target.value})}
                >
                  <option value="">Wybierz komorę docelową...</option>
                  {cells.map(c => {
                    // Walidacja wizualna: zablokuj jeśli inne zboże i komora nie jest pusta
                    const sourceCell = getCellData(formData.from);
                    const isDifferentGrain = sourceCell && c.commodity && c.commodity !== sourceCell.commodity && Number(c.waga) > 0;
                    
                    return (
                      <option key={c.id} value={c.id} disabled={isDifferentGrain}>
                        {c.id} {c.commodity ? `— ${c.commodity}` : '(Pusta)'} {isDifferentGrain ? '❌ (Inne zboże)' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 block">Ilość do przerzutu (t)</label>
                <div className="relative">
                  <input 
                    type="number" step="0.01"
                    className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-mono"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  />
                  <span className="absolute right-4 top-3.5 text-zinc-500 text-sm">ton</span>
                </div>
              </div>

              <button 
                disabled={isProcessing}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${
                  isProcessing ? "bg-zinc-700 cursor-not-allowed" : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 active:scale-95"
                }`}
              >
                {isProcessing ? "Przetwarzanie..." : "Zatwierdź Operację"}
              </button>
            </form>
          </section>
        </div>

        {/* HISTORIA I WIZUALIZACJA (PRAWO) */}
        <div className="xl:col-span-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-zinc-100">Ostatnie Ruchy Magazynowe</h2>
            <div className="text-xs text-zinc-500 px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800">
              Tryb: Blokada mieszania aktywna
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transfers.length === 0 && (
              <div className="col-span-full py-10 text-center text-zinc-600 italic border-2 border-dashed border-zinc-800 rounded-2xl">
                Brak zarejestrowanych przerzutów w tej sesji.
              </div>
            )}

            {transfers.map((t) => {
              const fromFill = getFillPercent(t.fromCell);
              const toFill = getFillPercent(t.toCell);

              return (
                <div key={t.id} className="bg-zinc-900/50 p-5 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-black text-white">{t.fromCell}</span>
                        <span className="text-amber-500">→</span>
                        <span className="text-lg font-black text-white">{t.toCell}</span>
                      </div>
                      <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">
                        Towar: <span className="text-zinc-300">{t.commodity}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-mono font-black text-amber-500">{t.amount} t</div>
                      <div className="text-[9px] text-zinc-600 uppercase">{t.timestamp ? new Date(t.timestamp).toLocaleTimeString() : ''}</div>
                    </div>
                  </div>

                  {/* Paski postępu (Twoja oryginalna logika) */}
                  <div className="space-y-3">
                    <div className="relative pt-1">
                      <div className="flex mb-1 items-center justify-between">
                        <div className="text-[9px] font-semibold inline-block text-zinc-500 uppercase italic">Poziom Źródła</div>
                        <div className="text-[9px] font-semibold inline-block text-zinc-500">{fromFill}%</div>
                      </div>
                      <div className="overflow-hidden h-1.5 text-xs flex rounded bg-zinc-800">
                        <div style={{ width: `${fromFill}%`, backgroundColor: fillColor(fromFill) }} className="shadow-none flex flex-col text-center white-space-nowrap text-white justify-center transition-all duration-700"></div>
                      </div>
                    </div>

                    <div className="relative pt-1">
                      <div className="flex mb-1 items-center justify-between">
                        <div className="text-[9px] font-semibold inline-block text-zinc-500 uppercase italic">Poziom Celu</div>
                        <div className="text-[9px] font-semibold inline-block text-zinc-500">{toFill}%</div>
                      </div>
                      <div className="overflow-hidden h-1.5 text-xs flex rounded bg-zinc-800">
                        <div style={{ width: `${toFill}%`, backgroundColor: fillColor(toFill) }} className="shadow-none flex flex-col text-center white-space-nowrap text-white justify-center transition-all duration-700"></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800/50 flex justify-between items-center text-[9px] text-zinc-600">
                    <span>OPERATOR: {t.operator || 'SYSTEM'}</span>
                    <span>{t.timestamp ? new Date(t.timestamp).toLocaleDateString() : ''}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ReportLayout>
  );
}