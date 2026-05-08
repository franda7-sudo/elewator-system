import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase";
import PzzLogo from "../Common/PzzLogo"; // 🔥 DODANE LOGO

export default function StartPage() {
  const navigate = useNavigate();
  
  const [view, setView] = useState("choice"); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Pola formularza
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); 
  const [pin, setPin] = useState("");   

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const time = now.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' });

  const resetToChoice = () => {
    setView("choice");
    setError("");
    setEmail("");
    setPassword("");
    setName("");
    setPin("");
  };

  const handleEmailLogin = async (e, targetRole) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", cred.user.uid));

      if (!userDoc.exists()) throw new Error("Brak uprawnień.");

      const userData = userDoc.data();
      const userRole = userData.role?.toLowerCase();

      const isManagement = userRole === "admin" || userRole === "owner" || userRole === "superuser";

      if (isManagement) {
        localStorage.setItem("operatorSession", JSON.stringify({
          name: userData.name || email,
          role: userRole,
          logged: true,
          uid: cred.user.uid
        }));
        navigate(targetRole === "admin" ? "/admin" : "/superuser");
      } else {
        setError("Brak uprawnień administracyjnych.");
        await signOut(auth);
      }
    } catch (err) {
      setError("Błędny e-mail lub hasło.");
    } finally {
      setLoading(false);
    }
  };

  const handlePinLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const q = query(
        collection(db, "users"), 
        where("name", "==", name.trim()),
        where("pin", "==", pin.trim()),
        where("role", "==", "operator")
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        localStorage.setItem("operatorSession", JSON.stringify({
          name: userData.name,
          role: "operator",
          logged: true,
          uid: querySnapshot.docs[0].id
        }));
        navigate("/operator");
      } else {
        setError("Niepoprawne imię lub PIN.");
      }
    } catch (err) {
      setError("Błąd autoryzacji.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-amber-950 text-white flex flex-col font-sans">
      
      {/* 🔥 HEADER Z LOGO */}
      <header className="p-6 md:px-10 flex justify-between items-center">
        <div className="flex flex-col">
          <PzzLogo width={160} /> {/* 🔥 UKRYTE WEJŚCIE (klik 5×) */}
          <div className="text-zinc-400 uppercase tracking-widest text-sm mt-2">{date}</div>
        </div>

        <div className="text-green-400 text-[10px] font-bold uppercase">
          System Online
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        {view === "choice" && (
          <div className="w-full max-w-4xl text-center">
            <h1 className="text-5xl md:text-7xl font-black mb-12 italic uppercase">
              System <span className="text-amber-500">Elewator</span>
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button onClick={() => setView("superuser")} className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2rem] hover:border-amber-500 transition-all">
                <div className="text-3xl mb-2">👤</div>
                <h3 className="font-bold uppercase text-sm">SuperUser</h3>
              </button>
              <button onClick={() => setView("admin")} className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2rem] hover:border-amber-500 transition-all">
                <div className="text-3xl mb-2">⚙️</div>
                <h3 className="font-bold uppercase text-sm">Administracja</h3>
              </button>
              <button onClick={() => setView("operator")} className="bg-amber-500 p-8 rounded-[2rem] hover:bg-amber-400 transition-all text-zinc-950">
                <div className="text-3xl mb-2">🚛</div>
                <h3 className="font-bold uppercase text-sm">Operator</h3>
              </button>
            </div>
          </div>
        )}

        {(view === "admin" || view === "superuser") && (
          <div className="w-full max-w-md bg-zinc-900/80 p-10 rounded-[3rem] border border-zinc-800 backdrop-blur-md">
            <button onClick={resetToChoice} className="text-zinc-500 mb-6 uppercase text-[10px] hover:text-white transition-colors">← Powrót</button>
            <h2 className="text-2xl font-black mb-6 uppercase text-amber-500">Logowanie {view}</h2>
            <form onSubmit={(e) => handleEmailLogin(e, view)} className="space-y-4">
              <input type="email" placeholder="E-MAIL" className="w-full bg-black/50 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-amber-500 transition-all" value={email} onChange={e => setEmail(e.target.value)} required />
              <input type="password" placeholder="HASŁO" className="w-full bg-black/50 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-amber-500 transition-all" value={password} onChange={e => setPassword(e.target.value)} required />
              <button type="submit" disabled={loading} className="w-full bg-amber-500 text-zinc-950 p-4 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-400 transition-all shadow-lg active:scale-95">
                {loading ? "Autoryzacja..." : "Zaloguj e-mailem"}
              </button>
              {error && <p className="text-red-500 text-xs text-center font-bold mt-2 uppercase">{error}</p>}
            </form>
          </div>
        )}

        {view === "operator" && (
          <div className="w-full max-w-md bg-zinc-900/80 p-10 rounded-[3rem] border border-zinc-800 backdrop-blur-md">
            <button onClick={resetToChoice} className="text-zinc-500 mb-6 uppercase text-[10px] hover:text-white transition-colors">← Powrót</button>
            <h2 className="text-2xl font-black mb-6 uppercase text-amber-500">Logowanie Operatora</h2>
            <form onSubmit={handlePinLogin} className="space-y-4">
              <input 
                type="text" 
                placeholder="IMIĘ (np. Adam)" 
                className="w-full bg-black/50 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-amber-500 font-bold transition-all" 
                value={name} 
                onChange={e => setName(e.target.value)}
                required 
              />
              <input 
                type="password" 
                inputMode="numeric" 
                placeholder="PIN" 
                className="w-full bg-black/50 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-amber-500 text-center text-2xl tracking-[0.5em]" 
                value={pin} 
                onChange={e => setPin(e.target.value)} 
                required 
              />
              <button type="submit" disabled={loading} className="w-full bg-amber-500 text-zinc-950 p-4 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-400 transition-all shadow-lg active:scale-95">
                {loading ? "Sprawdzam PIN..." : "Zaloguj PINem"}
              </button>
              {error && <p className="text-red-500 text-xs text-center font-bold mt-2 uppercase">{error}</p>}
            </form>
            <p className="text-zinc-500 text-[10px] text-center mt-6 uppercase tracking-tighter">Wielkość liter w imieniu ma znaczenie (np. Adam)</p>
          </div>
        )}

        {view === "choice" && <div className="mt-12 text-6xl md:text-8xl font-mono font-black opacity-90">{time}</div>}
      </main>
    </div>
  );
}
