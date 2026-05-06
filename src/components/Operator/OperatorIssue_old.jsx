import React, { useState } from "react";
import "./OperatorView.css";

export default function OperatorIssue() {
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  // MOCK — później podmienimy na Firestore
  const issues = [
    { id: "W-101", client: "AgroTrans", weight: 12.5, grain: "Pszenica" },
    { id: "W-102", client: "ZbożaPol", weight: 8.2, grain: "Żyto" },
    { id: "W-103", client: "Farmex", weight: 15.0, grain: "Kukurydza" },
  ];

  const handleIssue = () => {
    if (!selected) {
      setError("Musisz wybrać wydanie.");
      return;
    }

    setError("");
    alert("✔ Wydanie wykonane (tu będzie Firestore)");
  };

  return (
    <div className="operator-view">
      <h2>📤 Wydania</h2>

      {issues.length === 0 && (
        <div className="operator-item">Brak oczekujących wydań.</div>
      )}

      <div className="operator-list">
        {issues.map((i) => (
          <div
            key={i.id}
            className={`operator-item issue-item ${
              selected === i.id ? "selected" : ""
            }`}
            onClick={() => setSelected(i.id)}
          >
            <div className="issue-row">
              <span className="issue-id">📦 {i.id}</span>
              <span className="issue-weight">{i.weight} t</span>
            </div>

            <div className="issue-client">👤 {i.client}</div>
            <div className="issue-grain">🌾 {i.grain}</div>
          </div>
        ))}
      </div>

      {error && <div className="error-msg">{error}</div>}

      <button className="op-action-btn" onClick={handleIssue}>
        ✔ Zrealizuj wydanie
      </button>
    </div>
  );
}
