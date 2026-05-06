import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import ReportLayout from "./ReportLayout";

export default function AdminReports() {
  const [corrections, setCorrections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Pobieramy historię korekt - od najnowszych
    const q = query(collection(db, "corrections"), orderBy("timestamp", "desc"), limit(50));
    
    const unsub = onSnapshot(q, (snap) => {
      setCorrections(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <ReportLayout title="Raporty i Dziennik Zdarzeń">
      <div className="space-y-6">
        
        {/* NAGŁÓWEK / FILTRY */}
        <div className="flex justify-between items-end bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <div>
            <h2 className="text-xl font-bold text-white">Historia Korekt Wagowych</h2>
            <p className="text-zinc-500 text-xs uppercase tracking-widest mt-1">Ostatnie 50 operacji inwentaryzacyjnych</p>
          </div>
          <button 
            onClick={() => window.print()} 
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-xs font-bold transition-all border border-zinc-700"
          >
            🖨️ DRUKUJ RAPORT
          </button>
        </div>

        {/* TABELA RAPORTU */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-950 text-zinc-500 text-[10px] uppercase tracking-widest border-b border-zinc-800">
                <th className="p-4">Data / Czas</th>
                <th className="p-4">Komora</th>
                <th className="p-4">Operator</th>
                <th className="p-4 text-right">Stara Waga</th>
                <th className="p-4 text-right text-amber-500">Nowa Waga</th>
                <th className="p-4">Powód / Metoda</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan="6" className="p-10 text-center text-zinc-600 italic">Ładowanie danych...</td></tr>
              ) : corrections.length === 0 ? (
                <tr><td colSpan="6" className="p-10 text-center text-zinc-600 italic">Brak zarejestrowanych korekt.</td></tr>
              ) : (
                corrections.map((c) => (
                  <tr key={c.id} className="border-b border-zinc-800/50 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 text-zinc-400 font-mono text-xs">
                      {c.timestamp?.toDate ? c.timestamp.toDate().toLocaleString() : "---"}
                    </td>
                    <td className="p-4">
                      <span className="bg-zinc-800 px-2 py-1 rounded text-white font-bold">{c.cellId}</span>
                    </td>
                    <td className="p-4 text-zinc-300">{c.operator}</td>
                    <td className="p-4 text-right text-zinc-500">{c.oldWeight} t</td>
                    <td className="p-4 text-right font-bold text-white">{c.newWeight} t</td>
                    <td className="p-4">
                      <div className="text-zinc-300 text-xs">{c.reason}</div>
                      <div className="text-[9px] text-zinc-600 italic mt-1">
                        Metoda: {c.luzValue === "Korekta ręczna" ? "Manualna" : `Luz ${c.luzValue}m`}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PODSUMOWANIE STATYSTYCZNE (Opcjonalnie) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <div className="text-zinc-500 text-[10px] uppercase font-bold mb-1">Suma Korekt (Netto)</div>
            <div className="text-2xl font-black text-white">
              {corrections.reduce((acc, c) => acc + (c.newWeight - c.oldWeight), 0).toFixed(2)} t
            </div>
          </div>
        </div>

      </div>
    </ReportLayout>
  );
}