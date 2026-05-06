import React from "react";
import { useElevator } from "../context/ElevatorContext";

export default function OperatorCellsMobile() {
  const { cells } = useElevator();

  return (
    <div style={{ padding: 16 }}>
      <h2>Komory</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {cells.map((c) => {
          const fill = ((c.waga || 0) / c.capacity) * 100;

          return (
            <div
              key={c.id}
              style={{
                padding: 16,
                borderRadius: 12,
                background: "#222",
                color: "#fff",
                fontSize: 20,
              }}
            >
              <div style={{ fontSize: 26, fontWeight: "bold" }}>
                Komora {c.id}
              </div>

              <div style={{ marginTop: 6 }}>
                Waga: <b>{c.waga || 0} t</b>
              </div>

              <div style={{ marginTop: 6 }}>
                Zapełnienie: <b>{fill.toFixed(0)}%</b>
              </div>

              <div
                style={{
                  marginTop: 8,
                  height: 12,
                  background: "#444",
                  borderRadius: 6,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${fill}%`,
                    height: "100%",
                    background: fill >= 95 ? "#dc2626" : fill >= 90 ? "#eab308" : "#16a34a",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
