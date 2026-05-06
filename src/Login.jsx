import React, { useState } from "react";

export default function Login() {
  const [pin, setPin] = useState("");

  const handleLogin = () => {
    if (pin === "1111") {
      localStorage.setItem("role", "admin");
      window.location.href = "/admin";
    } else if (pin === "2222") {
      localStorage.setItem("role", "operator");
      window.location.href = "/operator";
    } else {
      alert("Nieprawidłowy PIN");
    }
  };

  return (
    <div className="login-container">
      <h2>Logowanie do systemu</h2>

      <input
        type="password"
        placeholder="PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
      />

      <button onClick={handleLogin}>Zaloguj</button>
    </div>
  );
}
