import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useElevator } from "../../context/ElevatorContext";

/**
 * KONFIGURACJA GRUP JAKOŚCIOWYCH
 * Tutaj możesz edytować przedziały dla każdego zboża.
 */
const QUALITY_CONFIG = {
  "Pszenica": {
    unit: "% Białko",
    ranges: [
      { label: "Paszowa", min: 0, max: 11.49 },
      { label: "Konsumpcyjna B2", min: 11.5, max: 12.49 },
      { label: "Konsumpcyjna B1", min: 12.5, max: 13.49 },
      { label: "Premium / Elite", min: 13.5, max: 99.0 }
    ]
  },
  "Żyto": {
    unit: "s (Opadanie)",
    ranges: [
      { label: "Paszowe", min: 0, max: 99 },
      { label: "Konsumpcyjne", min: 100, max: 999 }
    ]
  },
  "Jęczmień": {
    unit: "kg/hl (Gęstość)",
    ranges: [
      { label: "Lekki (Paszowy)", min: 0, max: 61.99 },
      { label: "Gęsty (Browarny)", min: 62.0, max: 99.0 }
    ]
  },
  "Owies": {
    unit: "kg/hl (Gęstość)",
    ranges: [
      { label: "Lekki", min: 0, max: 49.99 },
      { label: "Standard", min: 50.0, max: 99.0 }
    ]
  },
  "Pellet": {
    unit: "% Wilgotność",
    ranges: [
      { label: "Suchy (Klasa A1)", min: 0, max: 10.0 },
      { label: "Wilgotny", min: 10.1, max: 99.0 }
    ]
  }
};

export default function PeriodicQualityReport() {
  const { operator } = useElevator();
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    commodity: "Pszenica",
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // GŁÓWNA FUNKCJA GENERUJĄCA
  const generateReport = async () => {
    if (!filters.startDate || !filters.endDate) return alert("Wybierz zakres dat!");
    setLoading(true);

    try {
      const start = new Date(filters.startDate).getTime();
      const end = new Date(filters.endDate).setHours(23, 59, 59, 999);

      // Zapytanie do kolekcji inbound (przyjęcia)
      const q = query(
        collection(db, "inbound"),
        where("commodity", "==", filters.commodity),
        where("timestamp", ">=", start),
        where("timestamp", "<=", end)
      );

      const snap = await getDocs(q);
      const deliveries = snap.docs.map(d => d.data());

      // Grupowanie na podstawie QUALITY_CONFIG
      const currentConfig = QUALITY_CONFIG[filters.commodity];
      const results = currentConfig.ranges.map(range => {
        const matching = deliveries.filter(d => {
          // Kluczowe: pobieramy parametr jakościowy z pola keyParam
          const val = Number(d.keyParam);
          return val >= range.min && val <= range.max;
        });

        const totalWeight = matching.reduce((sum, d) => sum + Number(d.netto || 0), 0);
        return {
          ...range,
          totalWeight: Number(totalWeight.toFixed(2)),
          count: matching.length
        };
      });

      setReportData(results);
    } catch (err) {
      console.error("Błąd raportu:", err);
      alert("Nie udało się pobrać danych. Sprawdź konsolę.");
    } finally {
      setLoading(false);
    }
  };

  // FUNKCJA EKSPORTU DO CSV (EXCEL)
  const exportToCSV = () => {
    if (reportData.length === 0) return;

    const headers = ["Grupa Jakosciowa", "Zakres", "Ilosc Ton", "Ilosc Aut"];
    const rows = reportData.map(r => [
      r.label,
      `${r.min}-${r.max}`,
      r.totalWeight.toString().replace(".", ","), // Przecinek dla PL Excela
      r.count
    ]);

    const csvContent = [
      headers.join(";"),
      ...rows.map(row => row.join(";"))
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Raport_${filters.commodity}_${filters.startDate}.csv`;
    link.click();
  };

  return (
    <div className="p-4 sm:p-6 bg-[#0a0a0a] min-h-screen text-zinc-200">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tighter text-white italic">
            RAPORT JAKOŚCIOWY <span className="text-amber-500">PRZYJĘĆ</span>
          </h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">
            Analiza tonażu na podstawie parametru: {QUALITY_CONFIG[filters.commodity].unit}
          </p>
        </div>

        {/* FILTRY */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl flex flex-wrap gap-4 items-end mb-8">
          <div className="flex-1 min-w-[200px]">
            <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block tracking-widest">Surowiec</label>
            <select 
              className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-xl text-white outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              value={filters.commodity}
              onChange={(e) => { setFilters({...filters, commodity: e.target.value}); setReportData([]); }}
            >
              {Object.keys(QUALITY_CONFIG).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block tracking-widest">Od</label>
            <input 
              type="date" className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-xl text-white outline-none"
              value={filters.startDate} onChange={(e) => setFilters({...filters, startDate: e.target.value})}
            />
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="text-[10px] font-bold text-zinc-500 uppercase mb-2 block tracking-widest">Do</label>
            <input 
              type="date" className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-xl text-white outline-none"
              value={filters.endDate} onChange={(e) => setFilters({...filters, endDate: e.target.value})}
            />
          </div>

          <div className="flex gap-2 w-full lg:w-auto">
            <button 
              onClick={generateReport}
              className="flex-1 lg:flex-none bg-white text-black font-black px-10 py-3 rounded-xl hover:bg-amber-500 hover:text-white transition-all active:scale-95"
            >
              {loading ? "..." : "GENERUJ"}
            </button>
            {reportData.length > 0 && (
              <button 
                onClick={exportToCSV}
                className="bg-zinc-800 text-zinc-400 border border-zinc-700 px-4 py-3 rounded-xl hover:bg-zinc-700 transition-all"
                title="Eksportuj do Excela"
              >
                📥
              </button>
            )}
          </div>
        </div>

        {/* WYNIKI - KARTY */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {reportData.map((res, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl relative overflow-hidden group hover:border-amber-500/50 transition-all">
              <div className="text-[10px] font-black text-zinc-500 uppercase mb-1">{res.label}</div>
              <div className="text-3xl font-black text-white">{res.totalWeight.toFixed(2)} <span className="text-sm font-normal text-zinc-600">t</span></div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter">Aut: {res.count}</span>
                <span className="text-[10px] text-zinc-700 italic">{res.min}-{res.max} {QUALITY_CONFIG[filters.commodity].unit.split(' ')[0]}</span>
              </div>
              <div className="absolute bottom-0 left-0 h-1 bg-amber-600 w-full opacity-20 group-hover:opacity-100 transition-all"></div>
            </div>
          ))}
        </div>

        {/* PODSUMOWANIE TOTAL */}
        {reportData.length > 0 && (
          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8 text-center shadow-2xl">
             <h3 className="text-xs font-black uppercase text-zinc-500 mb-2 tracking-[0.3em]">Łączny tonaż netto w okresie</h3>
             <div className="text-6xl font-black text-white tracking-tighter">
               {reportData.reduce((acc, curr) => acc + curr.totalWeight, 0).toFixed(2)}
               <span className="text-2xl text-amber-500 ml-2 italic text-zinc-500">ton</span>
             </div>
             <div className="mt-4 text-zinc-600 text-[10px] uppercase font-bold">
               Wygenerowano przez: {operator?.name || "Administrator"}
             </div>
          </div>
        )}

        {reportData.length === 0 && !loading && (
          <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border-2 border-dashed border-zinc-800">
            <p className="text-zinc-600 italic">Brak danych dla wybranych filtrów. Kliknij "Generuj", aby pobrać dane.</p>
          </div>
        )}
      </div>
    </div>
  );
}