import React, { useState } from "react";
import { syncAllGrainGroups } from "../../utils/syncGrainGroupsToCells";

export default function SyncButton() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSync = async () => {
    setLoading(true);
    setMsg("");

    try {
      await syncAllGrainGroups();
      setMsg("✔ Synchronizacja zakończona pomyślnie.");
    } catch (err) {
      console.error(err);
      setMsg("❌ Błąd synchronizacji.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <button
        onClick={handleSync}
        disabled={loading}
        style={{
          padding: "8px 16px",
          background: "#2d7dff",
          border: "none",
          color: "#fff",
          cursor: "pointer",
          borderRadius: "6px",
          fontSize: "14px",
          fontWeight: "bold",
        }}
      >
        {loading ? "Synchronizuję…" : "🔄 Synchronizuj komórki"}
      </button>

      {msg && (
        <span style={{ marginTop: 6, color: "#fff", fontSize: 13 }}>
          {msg}
        </span>
      )}
    </div>
  );
}
