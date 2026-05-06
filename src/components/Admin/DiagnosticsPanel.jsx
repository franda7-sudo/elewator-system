import React from "react";

export default function DiagnosticsPanel() {
  return (
    <div style={{ padding: 20 }}>
      <h2>🧰 Diagnostyka systemu</h2>

      <div
        style={{
          marginTop: 10,
          padding: 12,
          borderRadius: 8,
          border: "1px solid #333",
          background: "#1f1f1f",
          color: "#eee",
        }}
      >
        <p>Panel diagnostyczny jest aktywny.</p>
        <p>Możesz tu dodać:</p>
        <ul>
          <li>logi systemowe</li>
          <li>status połączenia z Firestore</li>
          <li>status operatorów</li>
          <li>ostatnie błędy</li>
          <li>monitoring SCADA</li>
        </ul>
      </div>
    </div>
  );
}
