import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";

import { auth, db } from "../../firebase";
import PzzLogo from "../Common/PzzLogo";

import "./StartPage.css";

export default function StartPage() {

  const navigate = useNavigate();

  const [view, setView] = useState("choice");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [name, setName] = useState("");
  const [pin, setPin] = useState("");

  const [now, setNow] = useState(new Date());

  // 🔥 SECRET OWNER ACCESS
  const [logoClicks, setLogoClicks] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (logoClicks === 0) return;
    const timeout = setTimeout(() => setLogoClicks(0), 1800);
    return () => clearTimeout(timeout);
  }, [logoClicks]);

  const handleSecretOwnerAccess = () => {
    const next = logoClicks + 1;
    setLogoClicks(next);
    if (next >= 5) {
      setLogoClicks(0);
      navigate("/owner");
    }
  };

  const time = now.toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  const date = now.toLocaleDateString("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const resetToChoice = () => {
    setView("choice");
    setError("");
    setEmail("");
    setPassword("");
    setName("");
    setPin("");
  };

  // 🔥 ADMIN / SUPERUSER LOGIN
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

      const isManagement =
        userRole === "admin" ||
        userRole === "owner" ||
        userRole === "superuser";

      if (isManagement) {
        localStorage.setItem(
          "operatorSession",
          JSON.stringify({
            name: userData.name || email,
            role: userRole,
            logged: true,
            uid: cred.user.uid
          })
        );

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

  // 🔥 OPERATOR LOGIN
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

        localStorage.setItem(
          "operatorSession",
          JSON.stringify({
            name: userData.name,
            role: "operator",
            logged: true,
            uid: querySnapshot.docs[0].id
          })
        );

        navigate("/operator");

      } else {
        setError("Niepoprawny login lub PIN.");
      }

    } catch (err) {
      setError("Błąd autoryzacji.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="start-page-wrapper fade-in">

      {/* 🔥 BACKGROUND */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#064e3b33,transparent_35%),radial-gradient(circle_at_bottom_right,#f59e0b22,transparent_30%),linear-gradient(to_bottom_right,#020617,#000000,#111827)]" />
        <div className="absolute top-[-200px] left-[-200px] w-[700px] h-[700px] rounded-full bg-emerald-500/10 blur-[180px]" />
        <div className="absolute bottom-[-200px] right-[-200px] w-[700px] h-[700px] rounded-full bg-amber-500/10 blur-[180px]" />
      </div>

      {/* 🔥 HEADER */}
      <header className="start-header relative z-10 border-b border-white/10 backdrop-blur-xl industrial-frame">

        <div
          onClick={handleSecretOwnerAccess}
          className="cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
        >
          <PzzLogo width={180} />
        </div>

        <div className="flex items-center gap-4">

          <div className="hidden md:block text-right">
            <div className="text-zinc-500 uppercase tracking-[0.3em] text-[10px]">
              Grain Management System
            </div>
            <div className="text-zinc-300 text-sm">{date}</div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 backdrop-blur-xl">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-emerald-300 uppercase tracking-[0.2em] text-[10px] font-bold">
              Online
            </span>
          </div>

        </div>

      </header>

      {/* 🔥 MAIN */}
      <main className="relative z-10 flex-1 flex items-center justify-center">

        <div className="start-page-hero">

          {/* 🔥 HERO CONTENT */}
          <div className="start-page-left">

            {/* 🔥 COMPANY */}
            <div className="company-label uppercase tracking-[0.5em] text-xs mb-10">
              PZZ S.A. Białystok
            </div>

            {/* 🔥 HUGE TITLE */}
            <h1
              className="
                text-[5rem]
                sm:text-[7rem]
                md:text-[10rem]
                xl:text-[14rem]
                2xl:text-[16rem]
                font-black
                uppercase
                leading-[1.12]
                tracking-[-0.03em]
                mb-6
                scada-title
              "
            >
              ELEWATOR
            </h1>

            {/* 🔥 SUBTITLE */}
            <div className="subtitle mt-6 text-xl md:text-3xl xl:text-4xl font-black uppercase tracking-[0.22em]">
              Grain Management System
            </div>

            {/* 🔥 DESCRIPTION */}
            <p className="mt-10 max-w-3xl text-zinc-400 leading-relaxed text-base md:text-lg">
              Inteligentne zarządzanie elewatorem zbożowym,
              monitoring silosów, przyjęcia, wydania,
              kontrola jakości oraz mobilna obsługa operatorów.
            </p>

            {/* 🔥 CLOCK */}
            <div className="mt-16">
              <div className="text-6xl md:text-8xl font-black font-mono tracking-widest text-white">
                {time}
              </div>
            </div>

          </div>

          {/* 🔥 LOGIN PANEL */}
          <div className="start-page-right">

            <div className="login-panel industrial-frame">

              <div className="w-full rounded-[2.5rem] border border-white/10 bg-white/[0.04] backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden">

                {/* 🔥 PANEL WYBORU */}
                {view === "choice" && (
                  <div className="p-8 md:p-10 fade-in">
                    <div className="text-center mb-10">
                      <div className="text-zinc-500 uppercase tracking-[0.35em] text-xs">
                        Access Panel
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black mt-4">
                        Wybierz panel
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-5">
                      <button
                        onClick={() => setView("operator")}
                        className="h-24 rounded-3xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black uppercase tracking-[0.2em] text-lg hover:scale-[1.02] transition-all duration-300"
                      >
                        Operator
                      </button>

                      <button
                        onClick={() => setView("admin")}
                        className="h-24 rounded-3xl bg-white/[0.04] border border-white/10 font-black uppercase tracking-[0.2em] text-lg hover:border-amber-400 transition-all duration-300"
                      >
                        Administracja
                      </button>

                      <button
                        onClick={() => setView("superuser")}
                        className="h-24 rounded-3xl bg-white/[0.04] border border-white/10 font-black uppercase tracking-[0.2em] text-lg hover:border-amber-400 transition-all duration-300"
                      >
                        SuperUser
                      </button>
                    </div>
                  </div>
                )}

                {/* 🔥 ADMIN / SUPERUSER */}
                {(view === "admin" || view === "superuser") && (
                  <div className="p-8 md:p-10 fade-in">

                    <button
                      onClick={resetToChoice}
                      className="text-zinc-500 hover:text-white transition-colors uppercase tracking-[0.2em] text-xs mb-8"
                    >
                      ← Powrót
                    </button>

                    <div className="mb-10">
                      <div className="text-zinc-500 uppercase tracking-[0.35em] text-xs">
                        Secure Login
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black mt-3 uppercase">
                        {view}
                      </h2>
                    </div>

                    <form
                      onSubmit={(e) => handleEmailLogin(e, view)}
                      className="space-y-5"
                    >
                      <input
                        type="email"
                        placeholder="E-mail"
                        className="w-full h-16 rounded-2xl bg-black/40 border border-white/10 px-6 outline-none focus:border-amber-400 transition-all text-lg"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />

                      <input
                        type="password"
                        placeholder="Hasło"
                        className="w-full h-16 rounded-2xl bg-black/40 border border-white/10 px-6 outline-none focus:border-amber-400 transition-all text-lg"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-16 rounded-2xl bg-amber-500 text-black font-black uppercase tracking-[0.2em] text-lg hover:scale-[1.02] transition-all duration-300"
                      >
                        {loading ? "Logowanie..." : "Zaloguj"}
                      </button>
                    </form>

                  </div>
                )}

                {/* 🔥 OPERATOR */}
                {view === "operator" && (
                  <div className="p-8 md:p-10 fade-in">

                    <button
                      onClick={resetToChoice}
                      className="text-zinc-500 hover:text-white transition-colors uppercase tracking-[0.2em] text-xs mb-8"
                    >
                      ← Powrót
                    </button>

                    <div className="mb-10">
                      <div className="text-zinc-500 uppercase tracking-[0.35em] text-xs">
                        Operator Login
                      </div>
                      <h2 className="text-3xl md:text-4xl font-black mt-3 uppercase">
                        Operator
                      </h2>
                    </div>

                    <form
                      onSubmit={handlePinLogin}
                      className="space-y-5"
                    >
                      <input
                        type="text"
                        placeholder="Imię"
                        className="w-full h-16 rounded-2xl bg-black/40 border border-white/10 px-6 outline-none focus:border-amber-400 transition-all text-lg"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />

                      <input
                        type="password"
                        placeholder="PIN"
                        className="w-full h-16 rounded-2xl bg-black/40 border border-white/10 px-6 outline-none focus:border-amber-400 transition-all text-lg"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        required
                      />

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-16 rounded-2xl bg-amber-500 text-black font-black uppercase tracking-[0.2em] text-lg hover:scale-[1.02] transition-all duration-300"
                      >
                        {loading ? "Logowanie..." : "Wejdź"}
                      </button>
                    </form>

                  </div>
                )}

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
