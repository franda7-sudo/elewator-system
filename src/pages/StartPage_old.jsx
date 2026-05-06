import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import "./StartPage.css";

export default function StartPage() {
  const navigate = useNavigate();

  const [view, setView] = useState("choice"); // choice | admin | operator
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [opName, setOpName] = useState("");
  const [pin, setPin] = useState("");

  const [time, setTime] = useState("");

  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date().toLocaleTimeString("pl-PL"));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const loginAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", cred.user.uid));

      if (!userDoc.exists()) {
        setError("Brak danych użytkownika.");
        return;
      }

      const role = userDoc.data().role;

      if (role === "admin" || role === "owner") {
        navigate("/admin/map");
      } else {
        setError("Brak uprawnień administracyjnych.");
      }
    } catch (err) {
      setError("Nieprawidłowy e-mail lub hasło.");
    } finally {
      setLoading(false);
    }
  };

  const loginOperator = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const fullEmail = `${opName.trim().toLowerCase()}@elewator.pl`;
      const fullPassword = `11${pin.trim()}`;

      await signInWithEmailAndPassword(auth, fullEmail, fullPassword);
      navigate("/operator");
    } catch (err) {
      setError("Nieprawidłowe imię lub PIN.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="start-wrapper">
      <div className="start-header">
        <div className="start-title">
          <h1>System Elewator</h1>
          <span className="start-sub">Panel Kontroli Dostępu</span>
        </div>
        <div className="start-clock">{time}</div>
      </div>

      <div className="start-center">
        {view === "choice" && (
          <div className="choice-box">
            <h2 className="choice-title">Wybierz tryb</h2>

            <button className="btn-admin" onClick={() => setView("admin")}>
              PANEL ADMINISTRATORA
            </button>

            <button className="btn-operator" onClick={() => setView("operator")}>
              PANEL OPERATORA
            </button>
          </div>
        )}

        {view === "admin" && (
          <form className="login-box" onSubmit={loginAdmin}>
            <div className="back-btn" onClick={() => setView("choice")}>
              ← Powrót
            </div>

            <h2>Logowanie Administratora</h2>

            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Logowanie..." : "Zaloguj"}
            </button>

            {error && <div className="error">{error}</div>}
          </form>
        )}

        {view === "operator" && (
          <form className="login-box" onSubmit={loginOperator}>
            <div className="back-btn" onClick={() => setView("choice")}>
              ← Powrót
            </div>

            <h2>Logowanie Operatora</h2>

            <input
              type="text"
              placeholder="Imię / Identyfikator"
              value={opName}
              onChange={(e) => setOpName(e.target.value)}
            />

            <input
              type="password"
              placeholder="PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Logowanie..." : "Wejdź"}
            </button>

            {error && <div className="error">{error}</div>}
          </form>
        )}
      </div>

      <div className="start-footer">BY F.D. © 2026</div>
    </div>
  );
}
