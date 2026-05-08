import React from "react";

export default function BlockedScreen({ message }) {
  return (
    <div
      style={{
        height: "100vh",
        background: "#0f172a",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        fontSize: 28,
        textAlign: "center",
        padding: 20
      }}
    >
      <div style={{ marginBottom: 20 }}>{message}</div>

      <div style={{ opacity: 0.5, fontSize: 16 }}>
        System Elewator — PZZ Białystok
      </div>
    </div>
  );
}
