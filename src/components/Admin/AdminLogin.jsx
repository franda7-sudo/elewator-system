import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import "./AdminLogin.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem(
          "operatorSession",
          JSON.stringify({
            email: user.email,
            role: "admin",
            loginTime: Date.now(),
          })
        );
        navigate("/admin");
      }
    });
    return () => unsub();
  }, [navigate]);

  async function login(e) {
    e.preventDefault();
    setError("");

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, pass);

      localStorage.setItem(
        "operatorSession",
        JSON.stringify({
          email: userCred.user.email,
          role: "admin",
          loginTime: Date.now(),
        })
      );

      navigate("/admin");
    } catch (err) {
      setError("Błędny email lub hasło");
    }
  }

  return (
    <div className="admin-login">
      <h2>Logowanie administratora</h2>

      <form onSubmit={login} className="admin-login-form">
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Hasło:</label>
        <input
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />

        {error && <div className="error">{error}</div>}

        <button type="submit">Zaloguj</button>
      </form>
    </div>
  );
}
