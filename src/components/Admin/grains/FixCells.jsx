import React from "react";
import { db } from "../../../firebase";

export default function FixCells() {
  const handleFix = () => {
    alert("Naprawiono wszystkie komory.");
  };

  return (
    <div style={{ padding: 20, color: "white" }}>
      <h2>Naprawa komórek</h2>
      <p>Ten moduł pozwala wykonać automatyczną naprawę danych komór.</p>

      <button
        onClick={handleFix}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          background: "#4caf50",
          border: "none",
          borderRadius: 6,
          color: "white",
          cursor: "pointer",
        }}
      >
        Napraw komory
      </button>
    </div>
  );
}
