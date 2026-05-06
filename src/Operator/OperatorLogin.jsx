import React, { useState } from "react";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useOperatorSession } from "../../hooks/useOperatorSession";
import "./OperatorPanel.css";

export default function OperatorLogin() {
  const { loginOperator } = useOperatorSession();
  const [pin, setPin] = useState("");

  const handleLogin = async () => {
    if (!pin.trim()) {
      alert("Wpisz PIN");
      return;
    }

    const q = query(
      collection(db, "users"),
      where("role", "==", "operator"),
      where("pin", "==", pin)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      alert("Nieprawidłowy PIN");
      return;
    }

    const op = snap.docs[0].data();

    if (!op.active) {
      alert("Operator jest zablokowany");
      return;
    }

    loginOperator(op);
  };

  return (
    <div className="operator-login">
      <h2>Logowanie operatora</h2>

      <input
        type="password"
        className="login-input"
        placeholder="PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
      />

      <button className="login-btn" onClick={handleLogin}>
        Zaloguj
      </button>
    </div>
  );
}
