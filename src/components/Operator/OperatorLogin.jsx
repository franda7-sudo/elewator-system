// src/components/Operator/OperatorLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOperatorSession } from "../../useOperatorSession";
import "./OperatorLogin.css"; // jeśli masz, inaczej usuń ten import

export default function OperatorLogin() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const { loginWithPin, loading } = useOperatorSession();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await loginWithPin(pin);
      navigate("/operator"); // dostosuj, jeśli masz inną ścieżkę
    } catch (err) {
      setError(err.message || "Błąd logowania");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Logowanie operatora</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>PIN</label>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          style={styles.input}
          autoFocus
        />

        {error && <div style={styles.error}>{error}</div>}

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Logowanie..." : "Zaloguj"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 400,
    margin: "80px auto",
    padding: 20,
    background: "#1e1e1e",
    borderRadius: 10,
    color: "#fff",
    boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
    fontFamily: "sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    color: "#fbbf24",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  label: {
    fontSize: 14,
  },
  input: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #444",
    background: "#111",
    color: "#fff",
  },
  button: {
    marginTop: 10,
    padding: 10,
    borderRadius: 6,
    border: "none",
    background: "#22c55e",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  error: {
    marginTop: 8,
    padding: 8,
    borderRadius: 6,
    background: "#7f1d1d",
    color: "#fecaca",
    fontSize: 13,
  },
};
