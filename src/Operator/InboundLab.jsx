import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, addDoc, onSnapshot, doc, getDocs } from "firebase/firestore";

export default function InboundLab() {
  const [formData, setFormData] = useState({ vehicleId: "", commodity: "Pszenica", keyParam: "" });
  const [approvalId, setApprovalId] = useState(null);
  const [status, setStatus] = useState("idle"); // idle, checking, waiting, approved, rejected
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    // Pobierz limity, by wiedzieć kiedy blokować
    getDocs(collection(db, "qualityGroups")).then(snap => {
      setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  // Nasłuchiwanie decyzji SuperUsera
  useEffect(() => {
    if (!approvalId) return;
    const unsub = onSnapshot(doc(db, "approvals", approvalId), (snap) => {
      if (snap.data().status === "approved") setStatus("approved");
      if (snap.data().status === "rejected") setStatus("rejected");
    });
    return () => unsub();
  }, [approvalId]);

  const handleProcess = async () => {
    const group = groups.find(g => g.name === formData.commodity);
    const val = Number(formData.keyParam);

    if (val < group.minLimit || val > group.maxLimit) {
      // POZA LIMITAMI - WYŚLIJ PROŚBĘ
      setStatus("waiting");
      const docRef = await addDoc(collection(db, "approvals"), {
        ...formData,
        limit: `${group.minLimit}-${group.maxLimit}`,
        status: "pending",
        timestamp: Date.now()
      });
      setApprovalId(docRef.id);
    } else {
      // W NORMIE - ZAPISZ OD RAZU
      saveToDatabase();
    }
  };

  const saveToDatabase = async () => {
    await addDoc(collection(db, "inbound"), { ...formData, timestamp: Date.now() });
    alert("Dostawa zapisana pomyślnie!");
    setFormData({ vehicleId: "", commodity: "Pszenica", keyParam: "" });
    setStatus("idle");
    setApprovalId(null);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center font-sans">
      <div className="max-w-md w-full bg-zinc-900 p-8 rounded-[40px] border border-zinc-800 shadow-2xl relative overflow-hidden">
        
        {/* EKRAN BLOKADY (OVERLAY) */}
        {status === "waiting" && (
          <div className="absolute inset-0 bg-amber-600 z-50 flex flex-col items-center justify-center p-10 text-center">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Czekam na SuperUsera</h2>
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Parametr {formData.keyParam} poza normą. System zablokowany.</p>
          </div>
        )}

        {status === "rejected" && (
          <div className="absolute inset-0 bg-red-600 z-50 flex flex-col items-center justify-center p-10 text-center">
            <span className="text-6xl mb-4">🚫</span>
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Dostawa Odrzucona</h2>
            <button onClick={() => setStatus("idle")} className="mt-6 bg-white text-black px-8 py-3 rounded-full font-black text-xs">POWRÓT</button>
          </div>
        )}

        {/* FORMULARZ */}
        <h1 className="text-xl font-black italic mb-8 uppercase text-zinc-500">Przyjęcie <span className="text-white">Laboratoryjne</span></h1>
        
        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black text-zinc-600 uppercase mb-2 block">Nr Rejestracyjny</label>
            <input 
              className="w-full bg-zinc-800 p-4 rounded-2xl text-xl font-bold uppercase outline-none focus:ring-2 focus:ring-amber-500 transition-all"
              value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})}
            />
          </div>

          <div>
            <label className="text-[10px] font-black text-zinc-600 uppercase mb-2 block">Towar</label>
            <select 
              className="w-full bg-zinc-800 p-4 rounded-2xl text-xl font-bold outline-none"
              value={formData.commodity} onChange={e => setFormData({...formData, commodity: e.target.value})}
            >
              <option>Pszenica</option><option>Żyto</option><option>Jęczmień</option><option>Owies</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black text-zinc-600 uppercase mb-2 block">Parametr Kluczowy</label>
            <input 
              type="number" className="w-full bg-zinc-800 p-4 rounded-2xl text-3xl font-black text-amber-500 outline-none"
              value={formData.keyParam} onChange={e => setFormData({...formData, keyParam: e.target.value})}
            />
          </div>

          {status === "approved" ? (
            <button onClick={saveToDatabase} className="w-full bg-green-500 text-white py-5 rounded-3xl font-black text-lg animate-pulse shadow-lg shadow-green-500/20">
              ZATWIERDZONO - ZAPISZ
            </button>
          ) : (
            <button onClick={handleProcess} className="w-full bg-white text-black py-5 rounded-3xl font-black text-lg hover:bg-amber-500 hover:text-white transition-all shadow-xl">
              SPRAWDŹ I KONTYNUUJ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}