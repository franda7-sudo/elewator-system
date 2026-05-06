// src/components/Admin/UserLogs.jsx
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";

export default function UserLogs() {
  const [logs, setLogs] = useState([]);
  const [filterUser, setFilterUser] = useState("");
  const [filterAction, setFilterAction] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "userLogs"),
      orderBy("timestamp", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setLogs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, []);

  const filtered = logs.filter((l) => {
    if (filterUser && !l.userId.includes(filterUser)) return false;
    if (filterAction && l.action !== filterAction) return false;
    return true;
  });

  return (
    <div style={styles.wrapper}>
      <div style={styles.panel}>
        <h2 style={styles.title}>Logi systemowe</h2>

        {/* FILTRY */}
        <div style={styles.filters}>
          <input
            style={styles.input}
            placeholder="Filtruj po ID użytkownika"
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
          />

          <select
            style={styles.select}
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
          >
            <option value="">Wszystkie akcje</option>
            <option value="create">Utworzenie konta</option>
            <option value="change_role">Zmiana roli</option>
            <option value="reset_pin">Reset PIN</option>
            <option value="block">Blokada konta</option>
            <option value="unblock">Odblokowanie konta</option>
          </select>
        </div>

        {/* LISTA LOGÓW */}
        <div style={styles.list}>
          {filtered.map((log) => (
            <div key={log.id} style={styles.item}>
              <div>
                <strong>{log.action}</strong> — {log.userId}
              </div>
              <div style={styles.details}>
                {log.details && JSON.stringify(log.details)}
              </div>
              <div style={styles.time}>
                {new Date(log.timestamp).toLocaleString("pl-PL")}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={styles.empty}>Brak logów do wyświetlenia</div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "#0f0f0f",
    paddingTop: 40,
    color: "#fff",
  },
  panel: {
    maxWidth: 900,
    margin: "0 auto",
    padding: 30,
    background: "#1a1a1a",
    borderRadius: 12,
    border: "1px solid #333",
  },
  title: {
    textAlign: "center",
    fontSize: 28,
    marginBottom: 20,
  },
  filters: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: 10,
    background: "#111",
    color: "#fff",
    border: "1px solid #444",
    borderRadius: 6,
  },
  select: {
    padding: 10,
    background: "#111",
    color: "#fff",
    border: "1px solid #444",
    borderRadius: 6,
  },
  list: {
    background: "#111",
    padding: 15,
    borderRadius: 8,
    border: "1px solid #333",
  },
  item: {
    padding: 12,
    borderBottom: "1px solid #333",
  },
  details: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  time: {
    fontSize: 12,
    opacity: 0.5,
    marginTop: 4,
  },
  empty: {
    textAlign: "center",
    padding: 20,
    opacity: 0.6,
  },
};
