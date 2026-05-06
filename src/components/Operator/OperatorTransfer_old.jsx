import React from "react";
import "./OperatorView.css";

export default function OperatorTransfer() {
  return (
    <div className="operator-view">
      <h2>Przerzuty</h2>

      <form className="operator-form">
        <input placeholder="Komora źródłowa" />
        <input placeholder="Komora docelowa" />
        <input placeholder="Ilość (t)" />

        <button type="submit">Wykonaj przerzut</button>
      </form>
    </div>
  );
}
