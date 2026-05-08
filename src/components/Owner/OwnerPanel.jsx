import React, { useEffect, useState } from "react";
import { doc, updateDoc, onSnapshot, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

export default function OwnerPanel() {
  const [locked, setLocked] = useState(false);
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState([]);

  // Pobieranie statusu blokady systemu
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "system"), (snap) => {
      if (snap.exists()) {
        setLocked(snap.data().locked);
        setMessage(snap.data().message);
      }
    });
    return () => unsub();
  }, []);

  // Przełączanie blokady systemu
  const toggleLock = async () => {
    await updateDoc(doc(db, "settings", "system"), {
      locked: !locked,
      message
    });
  };

  // Pobieranie logów prób wejścia
  const loadLogs = async () => {
    const snap = await getDocs(collection(db, "ownerLogs"));
    setLogs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  return (
    <div style={{ padding: 20, color: "white", background: "#0f172a", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: 20 }}>Panel Ownera</h1>

      {/* BLOKADA SYSTEMU */}
      <div style={{ marginTop: 20, padding: 20, background: "#1e293b", borderRadius: 12 }}>
        <h2>Blokada systemu</h2>

        <label>Komunikat blokady:</label>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginTop: 10,
            background: "#0f172a",
            color: "white",
            borderRadius: 8,
            border: "1px solid #334155"
          }}
        />

        <button
          onClick={toggleLock}
          style={{
            marginTop: 20,
            width: "100%",
            padding: 14,
            background: locked ? "#ef4444" : "#10b981",
            borderRadius: 10,
            color: "white",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer"
          }}
        >
          {locked ? "ODBLOCKUJ SYSTEM" : "ZABLOKUJ SYSTEM"}
        </button>
      </div>

      {/* LOGI */}
      <div style={{ marginTop: 40, padding: 20, background: "#1e293b", borderRadius: 12 }}>
        <h2>Logi prób wejścia</h2>

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
              marginBottom: 10,
              padding: 10,
              background: "#0f172a",
              borderRadius: 8
            }}
          >
            <div><b>Typ:</b> {log.type}</div>
            <div><b>IP:</b> {log.ip}</div>
            <div><b>Szczegóły:</b> {log.details}</div>
            <div><b>Czas:</b> {new Date(log.timestamp).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
