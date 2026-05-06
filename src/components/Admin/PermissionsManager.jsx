import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, doc, updateDoc, deleteDoc, addDoc } from "firebase/firestore";

export default function PermissionsManager() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "operator", pin: "" });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null); // ID edytowanego użytkownika

  // 1. Pobieranie listy użytkowników w czasie rzeczywistym
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // 2. Funkcja przygotowująca do edycji
  const startEdit = (user) => {
    setEditingId(user.id);
    setNewUser({
      name: user.name,
      email: user.email || "",
      role: user.role,
      pin: user.pin || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 3. Anulowanie edycji
  const cancelEdit = () => {
    setEditingId(null);
    setNewUser({ name: "", email: "", role: "operator", pin: "" });
  };

  // 4. Dodawanie lub Aktualizacja użytkownika
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newUser.name) return alert("Podaj imię lub identyfikator pracownika");

    if (newUser.role === "operator" && (!newUser.pin || newUser.pin.length < 4)) {
      return alert("PIN dla operatora musi mieć min. 4 cyfry");
    }

    setLoading(true);
    try {
      if (editingId) {
        // AKTUALIZACJA
        await updateDoc(doc(db, "users", editingId), {
          ...newUser,
          name: newUser.name.trim(),
          email: newUser.email.trim().toLowerCase(),
        });
        setEditingId(null);
        alert("Dane pracownika zaktualizowane!");
      } else {
        // DODAWANIE
        await addDoc(collection(db, "users"), {
          ...newUser,
          name: newUser.name.trim(),
          email: newUser.email.trim().toLowerCase(),
          createdAt: Date.now(),
          active: true
        });
        alert("Pracownik dodany do systemu!");
      }
      setNewUser({ name: "", email: "", role: "operator", pin: "" });
    } catch (err) {
      alert("Błąd: " + err.message);
    }
    setLoading(false);
  };

  // 5. Szybka zmiana w tabeli (np. roli lub PINu bezpośrednio)
  const handleQuickUpdate = async (id, data) => {
    try {
      await updateDoc(doc(db, "users", id), data);
    } catch (err) {
      alert("Błąd aktualizacji: " + err.message);
    }
  };

  // 6. Usuwanie użytkownika
  const handleDelete = async (id) => {
    if (window.confirm("UWAGA! Usunięcie użytkownika zablokuje mu dostęp do systemu. Kontynuować?")) {
      await deleteDoc(doc(db, "users", id));
    }
  };

  return (
    <div className="p-8 bg-[#020617] min-h-screen text-slate-200">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-amber-500">
            Kadry <span className="text-white">& Uprawnienia</span>
          </h1>
          <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest mt-2">Zarządzanie dostępem do Elewatora</p>
        </header>

        {/* FORMULARZ (DODAWANIE / EDYCJA) */}
        <div className={`transition-all duration-500 p-8 rounded-[32px] border mb-12 shadow-2xl ${editingId ? 'bg-amber-500/10 border-amber-500/50' : 'bg-zinc-900/50 border-zinc-800'}`}>
          <h2 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-6 ${editingId ? 'text-amber-500' : 'text-zinc-400'}`}>
            {editingId ? "📝 Edycja danych pracownika" : "Rejestracja nowego pracownika"}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-wrap gap-6 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-3 ml-1">Imię i Nazwisko</label>
              <input 
                className="w-full bg-black border border-zinc-800 p-3 rounded-xl outline-none focus:border-amber-500 transition-all text-sm"
                value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})}
                placeholder="Jan Kowalski"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-3 ml-1">Rola</label>
              <select 
                className="bg-black border border-zinc-800 p-3 rounded-xl outline-none focus:border-amber-500 text-sm font-bold min-w-[150px]"
                value={newUser.role} 
                onChange={e => setNewUser({...newUser, role: e.target.value, email: "", pin: ""})}
              >
                <option value="operator">Operator (Waga)</option>
                <option value="superuser">SuperUser (Kierownik)</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {newUser.role === "operator" ? (
              <div className="w-[120px]">
                <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-3 ml-1">KOD PIN</label>
                <input 
                  type="text"
                  maxLength={6}
                  className="w-full bg-black border border-zinc-800 p-3 rounded-xl outline-none focus:border-amber-500 text-center font-mono text-amber-500 font-bold"
                  value={newUser.pin} onChange={e => setNewUser({...newUser, pin: e.target.value.replace(/\D/g,'')})}
                  placeholder="0000"
                />
              </div>
            ) : (
              <div className="flex-1 min-w-[200px]">
                <label className="block text-[10px] font-bold text-zinc-600 uppercase mb-3 ml-1">E-mail Logowania</label>
                <input 
                  type="email"
                  className="w-full bg-black border border-zinc-800 p-3 rounded-xl outline-none focus:border-amber-500 text-sm"
                  value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})}
                  placeholder="nazwa@pzz.pl"
                />
              </div>
            )}

            <div className="flex gap-2">
              <button 
                type="submit" 
                disabled={loading} 
                className={`${editingId ? 'bg-blue-600 hover:bg-blue-500' : 'bg-amber-500 hover:bg-amber-400'} text-black px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all active:scale-95 disabled:opacity-50 h-[46px]`}
              >
                {loading ? "..." : (editingId ? "Zapisz zmiany" : "Dodaj do bazy")}
              </button>
              
              {editingId && (
                <button 
                  type="button"
                  onClick={cancelEdit}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-3 rounded-xl font-black uppercase text-[10px] transition-all"
                >
                  Anuluj
                </button>
              )}
            </div>
          </form>
        </div>

        {/* LISTA UŻYTKOWNIKÓW */}
        <div className="bg-zinc-900/30 rounded-[32px] border border-zinc-800 overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/80 text-zinc-500 text-[10px] uppercase font-black tracking-[0.1em]">
                <th className="p-6">Pracownik</th>
                <th className="p-6 text-center">Rola Systemowa</th>
                <th className="p-6 text-center">Dostępy (PIN/Mail)</th>
                <th className="p-6 text-right">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className={`border-b border-zinc-800/50 hover:bg-white/[0.02] transition-all group ${editingId === u.id ? 'bg-amber-500/5' : ''}`}>
                  <td className="p-6">
                    <div className="font-bold text-white group-hover:text-amber-500 transition-colors uppercase italic tracking-tight text-sm">
                      {u.name || "Użytkownik bez nazwy"}
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <select 
                      className="bg-black/40 border border-zinc-800 text-[10px] font-black uppercase p-2 rounded-lg outline-none focus:border-amber-500 cursor-pointer"
                      value={u.role} 
                      onChange={(e) => handleQuickUpdate(u.id, { role: e.target.value })}
                    >
                      <option value="operator">operator</option>
                      <option value="admin">admin</option>
                      <option value="superuser">superuser</option>
                    </select>
                  </td>
                  <td className="p-6 text-center">
                    {u.role === "operator" ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-[9px] text-zinc-600 font-bold uppercase">PIN:</span>
                        <input 
                          type="text"
                          className="bg-black border border-zinc-800 text-xs p-1 rounded w-20 text-center font-mono font-bold text-amber-500 focus:border-amber-500 outline-none"
                          defaultValue={u.pin}
                          onBlur={(e) => handleQuickUpdate(u.id, { pin: e.target.value })}
                        />
                      </div>
                    ) : (
                      <span className="text-zinc-500 text-xs font-mono lowercase">{u.email || "brak adresu email"}</span>
                    )}
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-4">
                      <button 
                        onClick={() => startEdit(u)}
                        className="text-zinc-500 hover:text-amber-500 transition-colors"
                        title="Edytuj dane"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(u.id)}
                        className="text-zinc-700 hover:text-red-500 transition-colors"
                        title="Usuń pracownika"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="p-20 text-center text-zinc-700 font-black uppercase italic tracking-widest">
              Baza użytkowników jest pusta
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Ikony
function Trash2({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
    </svg>
  );
}

function Edit2({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}