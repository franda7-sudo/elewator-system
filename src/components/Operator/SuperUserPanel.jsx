import React from "react";
import { useElevator } from "../../context/ElevatorContext";

export default function SuperuserPanel() {
  const { dallas, alarms, cells, updateCell } = useElevator();

  return (
    <div style={styles.wrapper}>
      <div style={styles.panel}>
        <h2 style={styles.title}>Panel SUPERUSER</h2>

        {/* DALLAS */}
        <h3 style={styles.section}>Czujniki Dallas</h3>
        <div style={styles.list}>
          {dallas.map((d) => (
            <div key={d.id} style={styles.item}>
              <strong>{d.name}</strong>
              <div>Temp: {d.temp}°C</div>
              <div>Cell: {d.cell || "—"}</div>
            </div>
          ))}
        </div>

        {/* ALARMY */}
        <h3 style={styles.section}>Aktywne alarmy</h3>
        <div style={styles.list}>
          {alarms.length === 0 && <div style={styles.ok}>Brak alarmów</div>}
          {alarms.map((a) => (
            <div key={a.id} style={styles.alarm}>
              <strong>{a.type}</strong> — {a.message}
            </div>
          ))}
        </div>

        {/* KOMORY */}
        <h3 style={styles.section}>Komory — sterowanie</h3>
        <div style={styles.list}>
          {cells.map((c) => (
            <div key={c.id} style={styles.cellBox}>
              <strong>Komora {c.id}</strong>
              <div>Waga: {c.waga} t</div>
              <div>Status: {c.full ? "Pełna" : "Wolna"}</div>

              <button
                style={styles.btn}
                onClick={() => updateCell(c.id, { blocked: !c.blocked })}
              >
                {c.blocked ? "Odblokuj" : "Zablokuj"}
              </button>

              <button
                style={styles.btn2}
                onClick={() => updateCell(c.id, { override: !c.override })}
              >
                {c.override ? "Wyłącz override" : "Override koloru"}
              </button>
            </div>
          ))}
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
    fontSize: 30,
    marginBottom: 20,
  },
  section: {
    fontSize: 22,
    marginTop: 20,
    marginBottom: 10,
  },
  list: {
    background: "#111",
    padding: 15,
    borderRadius: 8,
    border: "1px solid #333",
    marginBottom: 20,
  },
  item: {
    padding: 10,
    borderBottom: "1px solid #333",
  },
  alarm: {
    padding: 10,
    color: "#f87171",
    borderBottom: "1px solid #333",
  },
  ok: {
    color: "#4ade80",
  },
  cellBox: {
    padding: 12,
    borderBottom: "1px solid #333",
  },
  btn: {
    marginTop: 10,
    padding: 8,
    background: "#dc2626",
    border: "none",
    borderRadius: 6,
    color: "#fff",
    cursor: "pointer",
    marginRight: 10,
  },
  btn2: {
    padding: 8,
    background: "#2563eb",
    border: "none",
    borderRadius: 6,
    color: "#fff",
    cursor: "pointer",
  },
};
