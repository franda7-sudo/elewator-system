import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, doc, updateDoc, query, where } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

export default function SuperUserPanel() {
  const [groups, setGroups] = useState([]); // Dynamiczne limity dla: Pszenica, Żyto itd.
  const [approvals, setApprovals] = useState([]); // Kolejka aut do zatwierdzenia
  const [cells, setCells] = useState([]);
  const [session, setSession] = useState(JSON.parse(localStorage.getItem("operatorSession")));
  const navigate = useNavigate();

  useEffect(() => {
    if (!session || session.role !== "superuser") navigate("/login");

    // 1. Nasłuchiwanie limitów jakościowych
    const unsubGroups = onSnapshot(collection(db, "qualityGroups"), (snap) => {
      setGroups(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // 2. Nasłuchiwanie aut czekających na decyzję
    const q = query(collection(db, "approvals"), where("status", "==", "pending"));
    const unsubApprovals = onSnapshot(q, (snap) => {
      setApprovals(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // 3. Podgląd komór (Mapa)
    const unsubCells = onSnapshot(collection(db, "cells"), (snap) => {
      setCells(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubGroups(); unsubApprovals(); unsubCells(); };
  }, []);

  const handleLimitUpdate = async (id, min, max) => {
    await updateDoc(doc(db, "qualityGroups", id), { 
      minLimit: Number(min), 
      maxLimit: Number(max),
      updatedAt: Date.now() 
    });
  };

  const handleDecision = async (id, decision) => {
    await updateDoc(doc(db, "approvals", id), { 
      status: decision, 
      decidedBy: session.name,
      decidedAt: Date.now()
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
        <div>
          <h1 className="text-2xl font-black italic tracking-tighter uppercase">SuperUser <span className="text-amber-500">Command Center</span></h1>
          <p className="text-zinc-500 text-[10px] font-bold tracking-[0.3em]">ZALOGOWANY: {session?.name}</p>
        </div>
        <button onClick={() => navigate("/login")} className="text-xs font-bold text-zinc-500 hover:text-white transition-colors">WYLOGUJ</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEWA KOLUMNA: DECYZJE I LIMITY */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* SEKCJA ZATWIERDZANIA */}
          <section>
            <h2 className="text-amber-500 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></span> Oczekujące na decyzję ({approvals.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {approvals.map(req => (
                <div key={req.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl shadow-xl">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xl font-black italic">{req.commodity}</span>
                    <span className="text-zinc-500 font-mono text-xs">{req.vehicleId}</span>
                  </div>
                  <div className="bg-black p-3 rounded-xl mb-4 border border-zinc-800">
                    <div className="text-[10px] text-zinc-500 uppercase">Parametr poza normą:</div>
                    <div className="text-red-500 font-black text-xl">{req.keyParam} <span className="text-xs text-zinc-600 italic">(Norma: {req.limit})</span></div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleDecision(req.id, "approved")} className="flex-1 bg-white text-black font-black py-3 rounded-xl text-xs hover:bg-green-500 hover:text-white transition-all">PRZYJMIJ</button>
                    <button onClick={() => handleDecision(req.id, "rejected")} className="flex-1 bg-zinc-800 text-red-500 font-black py-3 rounded-xl text-xs hover:bg-red-600 hover:text-white transition-all">ODRZUĆ</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ZARZĄDZANIE LIMITAMI */}
          <section>
            <h2 className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-4">Konfiguracja Limitów (Dynamiczna)</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {groups.map(g => (
                <div key={g.id} className="bg-zinc-900/30 border border-zinc-800 p-4 rounded-2xl">
                  <div className="text-white font-bold mb-2">{g.name}</div>
                  <div className="flex gap-2">
                    <input 
                      type="number" className="w-full bg-black border border-zinc-700 p-2 rounded text-xs text-amber-500 font-mono font-bold"
                      defaultValue={g.minLimit} onBlur={(e) => handleLimitUpdate(g.id, e.target.value, g.maxLimit)}
                    />
                    <input 
                      type="number" className="w-full bg-black border border-zinc-700 p-2 rounded text-xs text-amber-500 font-mono font-bold"
                      defaultValue={g.maxLimit} onBlur={(e) => handleLimitUpdate(g.id, g.minLimit, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* PRAWA KOLUMNA: MAPA I RAPORTY */}
        <div className="lg:col-span-4 space-y-8">
          <section>
            <h2 className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-4 text-center">Stan Elewatora</h2>
            <div className="grid grid-cols-4 gap-2">
              {cells.map(c => (
                <div key={c.id} className={`aspect-square rounded-lg border flex flex-col items-center justify-center ${c.commodity ? 'bg-zinc-800 border-zinc-600' : 'border-zinc-900 text-zinc-800'}`}>
                  <span className="text-[10px] font-black">{c.id}</span>
                  <span className="text-[8px] text-amber-600">{c.waga}t</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
            <h2 className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-4">Raporty</h2>
            <div className="grid grid-cols-1 gap-2">
              {['FIFO', 'Snapshot', 'Jakościowy', 'Ruchy'].map(r => (
                <Link key={r} to={`/admin/reports/${r.toLowerCase()}`} className="p-3 bg-black/40 rounded-xl text-xs font-bold hover:text-amber-500 transition-colors border border-zinc-800">
                  {r}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}