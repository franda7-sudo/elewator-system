import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import "./login.css";

export default function LoginFirebase() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      localStorage.setItem("role", "admin");
      window.location.href = "/admin/map";
    } catch (err) {
      alert("Błędne dane logowania");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2>Logowanie</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Hasło"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />

        <button onClick={handleLogin}>Zaloguj</button>
      </div>
    </div>
  );
}
