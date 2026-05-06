import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AddUserPanel() {
  const [role, setRole] = useState("operator");
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [pass, setPass] = useState("");
  const [message, setMessage] = useState("");

  const handleCreate = async () => {
    try {
      const data = {
        role: role.toLowerCase(),
        blocked: false,
        createdAt: Date.now(),
      };

      // OPERATOR / SUPERUSER → login + PIN
      if (role === "operator" || role === "superuser") {
        if (!login || !pin) {
          setMessage("Podaj login i PIN");
          return;
        }
        data.login = login;
        data.pin = Number(pin);
      }

      // ADMIN → email + pass
      if (role === "admin") {
        if (!email || !pass) {
          setMessage("Podaj email i hasło admina");
          return;
        }
        data.email = email;
        data.pass = pass;
      }

      // OWNER → email (hasło w kodzie)
      if (role === "owner") {
        if (!email) {
          setMessage("Podaj email ownera");
          return;
        }
        data.email = email;
      }

      await addDoc(collection(db, "users"), data);

      setMessage("Użytkownik utworzony poprawnie!");
      setLogin("");
      setEmail("");
      setPin("");
      setPass("");
    } catch (err) {
      console.error(err);
      setMessage("Błąd podczas tworzenia użytkownika");
    }
  };

  return (
    <div className="p-6 bg-zinc-900 text-white rounded-xl border border-zinc-700">
      <h2 className="text-2xl font-bold mb-4">Dodaj użytkownika</h2>

      <label className="block mb-2">Rola:</label>
      <select
        className="p-2 bg-zinc-800 rounded mb-4"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="operator">Operator</option>
        <option value="superuser">Superuser</option>
        <option value="admin">Admin</option>
        <option value="owner">Owner</option>
      </select>

      {(role === "operator" || role === "superuser") && (
        <>
          <label className="block mb-2">Login:</label>
          <input
            className="p-2 bg-zinc-800 rounded mb-4 w-full"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />

          <label className="block mb-2">PIN:</label>
          <input
            className="p-2 bg-zinc-800 rounded mb-4 w-full"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
        </>
      )}

      {(role === "admin" || role === "owner") && (
        <>
          <label className="block mb-2">Email:</label>
          <input
            className="p-2 bg-zinc-800 rounded mb-4 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </>
      )}

      {role === "admin" && (
        <>
          <label className="block mb-2">Hasło admina:</label>
          <input
            className="p-2 bg-zinc-800 rounded mb-4 w-full"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
        </>
      )}

      <button
        onClick={handleCreate}
        className="px-6 py-3 bg-amber-500 text-black font-bold rounded-lg hover:scale-105 transition"
      >
        Utwórz użytkownika
      </button>

      {message && <p className="mt-4 text-amber-400">{message}</p>}
    </div>
  );
}
