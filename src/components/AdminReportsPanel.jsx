import React from "react";
import { useElevator } from "../context/ElevatorContext";

export default function AdminReportsPanel() {
  const { cells, updateCell } = useElevator();

  const styles = {
    wrapper: { padding: "20px", background: "#fff", minHeight: "100vh" },
    container: {
      width: "100%",
      overflowX: "auto",
      border: "2px solid #333",
      maxHeight: "80vh",
    },
    table: {
      width: "1200px",
      borderCollapse: "collapse",
      tableLayout: "fixed",
    },
    tr: { height: "30px" },
    td: {
      border: "1px solid #ccc",
      textAlign: "center",
      fontSize: "12px",
      padding: "0 5px",
      whiteSpace: "nowrap",
      lineHeight: "30px",
    },
    th: {
      background: "#444",
      color: "#fff",
      position: "sticky",
      top: 0,
      zIndex: 10,
      height: "40px",
    },
    danger: { background: "#ff4444", color: "#fff", fontWeight: "bold" },
    idCol: { width: "70px", background: "#eee", fontWeight: "bold" },
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (ev) => {
      const lines = ev.target.result.split("\n");
      const dataMap = {};

      lines.forEach((line) => {
        if (line.includes(".Komora:")) {
          const parts = line.replace(".", "").trim().split(/\s+/);
          const komora = parts[1];

          dataMap[komora] = parts.slice(2, 12).map((t) =>
            t === "----" || !t ? null : parseFloat(t.replace(",", "."))
          );
        }
      });

      Object.values(cells || {}).forEach((c) => {
        const komora = c.id;
        if (dataMap[komora]) {
          updateCell(komora, { temps: dataMap[komora] });
        }
      });

      alert("Zaimportowano dane.");
    };

    reader.readAsText(file);
  };

  return (
    <div style={styles.wrapper}>
      <div style={{ marginBottom: "20px" }}>
        <input type="file" id="f" onChange={handleImport} hidden />
        <label
          htmlFor="f"
          style={{
            background: "#007bff",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          WCZYTAJ PLIK .DAT
        </label>
      </div>

      <div style={styles.container}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.th, width: "70px" }}>ID</th>
              {[...Array(10)].map((_, i) => (
                <th key={i} style={{ ...styles.th, width: "100px" }}>
                  T{i + 1}
                </th>
              ))}
              <th style={{ ...styles.th, width: "100px" }}>ŚR.</th>
            </tr>
          </thead>

          <tbody>
            {Object.values(cells || {}).map((c) => {
              const tList = c.temps || Array(10).fill(null);
              const active = tList.filter((t) => t !== null);
              const avg = active.length
                ? (active.reduce((a, b) => a + b, 0) / active.length).toFixed(1)
                : "--";

              return (
                <tr key={c.id} style={styles.tr}>
                  <td style={styles.idCol}>{c.id}</td>

                  {tList.map((t, i) => (
                    <td
                      key={i}
                      style={
                        t > 25
                          ? { ...styles.td, ...styles.danger }
                          : styles.td
                      }
                    >
                      {t !== null ? t.toFixed(1) : "--"}
                    </td>
                  ))}

                  <td style={{ ...styles.td, fontWeight: "bold" }}>
                    {avg}°C
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
