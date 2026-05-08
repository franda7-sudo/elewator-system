import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export default function OwnerLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const snap = await getDocs(collection(db, "ownerLogs"));
    setLogs(
      snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => b.timestamp - a.timestamp)
    );
  };

  return (
    <div style={{ padding: 20, color: "white", background: "#0f172a", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: 20 }}>Logi prób wejścia</h1>

      <button
        onClick={loadLogs}
        style={{
          marginBottom: 20,
          padding: "10px 20px",
          background: "#3b82f6",
          borderRadius: 8,
          border: "none",
          color: "white",
          cursor: "pointer"
        }}
      >
        Odśwież logi
      </button>

      {logs.length === 0 && (
        <div style={{ opacity: 0.6 }}>Brak logów</div>
      )}

      {logs.map((log) => (
        <div
          key={log.id}
          style={{
            marginBottom: 12,
            padding: 12,
            background: "#1e293b",
            borderRadius: 10
          }}
        >
          <div><b>Typ:</b> {log.type}</div>
          <div><b>IP:</b> {log.ip}</div>
          <div><b>Szczegóły:</b> {log.details}</div>
          <div><b>Czas:</b> {new Date(log.timestamp).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}
