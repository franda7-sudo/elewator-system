import React, { useState } from "react";
import OwnerPanel from "./OwnerPanel";

export default function OwnerPinGate() {
  const [pin, setPin] = useState("");
  const [ok, setOk] = useState(false);

  const correctPin = "8421"; // 🔥 USTAW SWÓJ PIN

  const checkPin = () => {
    if (pin === correctPin) {
      setOk(true);
    } else {
      alert("Niepoprawny PIN");
    }
  };

  if (ok) return <OwnerPanel />;

  return (
    <div
      style={{
        height: "100vh",
        background: "#0f172a",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        fontSize: 24
      }}
    >
      <div style={{ marginBottom: 20 }}>Wprowadź PIN właściciela</div>

      <input
        type="password"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        style={{
          padding: 12,
          width: 200,
          fontSize: 20,
          textAlign: "center",
          borderRadius: 8,
          background: "#1e293b",
          color: "white",
          border: "1px solid #334155"
        }}
      />

      <button
        onClick={checkPin}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          background: "#3b82f6",
          borderRadius: 8,
          border: "none",
          color: "white",
          fontSize: 18,
          cursor: "pointer"
        }}
      >
        Wejdź
      </button>
    </div>
  );
}
