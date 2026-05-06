import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SuperUserLogin() {
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function login(e) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !pin.trim()) {
      setError("Podaj imię i PIN");
      return;
    }

    // Zapis sesji superusera
    localStorage.setItem(
      "operatorSession",
      JSON.stringify({
        name,
        role: "superuser",
        loginTime: Date.now(),
      })
    );

    navigate("/superuser");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-white">
      <h2 className="text-3xl mb-6">Logowanie SuperUser</h2>

      <form onSubmit={login} className="flex flex-col gap-4 w-72">
        <input
          type="text"
          placeholder="Imię"
          className="p-3 rounded bg-zinc-800"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="password"
          placeholder="PIN"
          className="p-3 rounded bg-zinc-800"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />

        {error && <div className="text-red-400 text-sm">{error}</div>}

        <button className="p-3 bg-blue-500 text-black rounded font-bold">
          Zaloguj
        </button>
      </form>
    </div>
  );
}
