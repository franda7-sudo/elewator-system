import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import ReportLayout from "./ReportLayout";
import { parseFullDatFile, saveFullReportToFirebase } from "../utils/DallasParser";

export default function TemperatureReport() {
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Subskrypcja danych Live z Firebase
  useEffect(() => {
    const q = query(
      collection(db, "temperatures"),
      orderBy("timestamp", "desc"),
      limit(65) // Pobieramy ostatnie odczyty dla wszystkich komór
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sortujemy po numerze komory (wyciągamy cyfry z C1, C2...)
      data.sort((a, b) => parseInt(a.cellId.substring(1)) - parseInt(b.cellId.substring(1)));
      setMeasurements(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Obsługa importu pliku .dat
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const text = await file.text();
    const parsedData = parseFullDatFile(text);
    
    const success = await saveFullReportToFirebase(parsedData);
    if (success) {
      alert(`Pomyślnie zaimportowano temperatury dla ${parsedData.length} komór.`);
    }
  };

  // Grupowanie dla przejrzystości widoku
  const segments = {
    N: measurements.filter(m => m.segment === "N"),
    G: measurements.filter(m => m.segment === "G"),
    S: measurements.filter(m => m.segment === "S"),
  };

  return (
    <ReportLayout title="System Monitoringu Dallas - Raport Zbiorczy">
      {/* Panel Sterowania Importem */}
      <div className="mb-8 p-6 bg-zinc-900 border border-zinc-700 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 print:hidden">
        <div>
          <h3 className="text-amber-400 font-bold text-lg">Aktualizacja danych (WinXP .dat)</h3>
          <p className="text-zinc-400 text-sm">Wybierz plik z VM, aby przesłać odczyty do chmury</p>
        </div>
        <input 
          type="file" 
          onChange={handleFileUpload}
          className="block w-full md:w-auto text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-600 file:text-white hover:file:bg-amber-700 cursor-pointer"
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-zinc-500 animate-pulse text-xl">Pobieranie danych z Firebase...</div>
      ) : (
        <div className="space-y-10">
          {Object.entries(segments).map(([name, data]) => data.length > 0 && (
            <section key={name}>
              <h2 className="text-2xl font-bold mb-4 border-l-4 border-amber-500 pl-4 text-zinc-100">
                Segment {name} <span className="text-zinc-500 text-sm font-normal">({data.length} komór)</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {data.map((m) => (
                  <TempCard key={m.id} data={m} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </ReportLayout>
  );
}

// Sub-komponent karty komory dla czystości kodu
function TempCard({ data }) {
  const isAlarm = data.maxDiff > 3;
  
  return (
    <div className={`p-4 rounded-lg border transition-all ${
      isAlarm ? "bg-red-950/20 border-red-500 shadow-lg shadow-red-900/10" : "bg-zinc-800 border-zinc-700"
    }`}>
      <div className="flex justify-between items-center mb-3">
        <span className="text-xl font-black text-white">{data.cellId}</span>
        <div className="text-right">
          <p className="text-[10px] text-zinc-500 uppercase">Różnica (Δ)</p>
          <p className={`font-bold ${isAlarm ? "text-red-400" : "text-green-400"}`}>{data.maxDiff.toFixed(1)}°C</p>
        </div>
      </div>

      {/* Wizualizacja sensorów w pionie/siatce */}
      <div className="grid grid-cols-5 gap-1.5 mb-3">
        {data.sensors.map((temp, i) => (
          <div key={i} className="group relative">
            <div className={`h-8 flex items-center justify-center rounded text-[10px] font-medium ${
              temp > 25 ? "bg-orange-500/20 text-orange-400" : "bg-zinc-900 text-zinc-400"
            }`}>
              {temp.toFixed(0)}°
            </div>
            {/* Tooltip przy hoverze */}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-white text-[10px] px-1.5 py-0.5 rounded z-10">
              S{i+1}: {temp}°C
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-end">
        <span className="text-[9px] text-zinc-600 truncate mr-2 italic">{data.reportDate}</span>
        <div className="text-[10px] bg-zinc-900 px-2 py-0.5 rounded text-zinc-400">
          Śr: {data.average}°C
        </div>
      </div>
    </div>
  );
}