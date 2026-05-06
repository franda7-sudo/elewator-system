import React, { useState } from "react";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

export default function CreateUser() {
  const [role, setRole] = useState("operator");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [login, setLogin] = useState("");
  const [pin, setPin] = useState("");
  const [msg, setMsg] = useState("");

  const handleCreate = async () => {
    setMsg("");

    try {
      let userCredential = null;

      // 🔹 operator / superuser — nie tworzymy konta w Auth
      if (role === "operator" || role === "superuser") {
        await addDoc(collection(db, "users"), {
          role,
          login,
          pin: Number(pin),
          blocked: false,
          createdAt: Date.now(),
        });

        setMsg("Operator / Superuser utworzony!");
        return;
      }

      // 🔹 admin / owner — tworzymy konto w Firebase Auth
      userCredential = await createUserWithEmailAndPassword(auth, email, pass);

      await addDoc(collection(db, "users"), {
        role,
        email,
        blocked: false,
        createdAt: Date.now(),
      });

      setMsg("Admin / Owner utworzony! Rola zostanie nadana automatycznie.");
    } catch (err) {
      console.error(err);
      setMsg("Błąd podczas tworzenia użytkownika");
    }
  };

  return (
    <div className="p-6 bg-zinc-900 text-white rounded-xl border border-zinc-700">
      <h2 className="text-2xl font-bold mb-4">Utwórz użytkownika</h2>

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

          <label className="block mb-2">Hasło:</label>
          <input
            className="p-2 bg-zinc-800 rounded mb-4 w-full"
            type="password"
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

      {msg && <p className="mt-4 text-amber-400">{msg}</p>}
    </div>
  );
}
