import React from "react";
import { Paper } from "@mui/material";

export default function CellTooltip({ cell, x, y }) {
  if (!cell) return null;

  return (
    <foreignObject x={x + 150} y={y} width={240} height={260}>
      <Paper
        sx={{
          p: 1.5,
          bgcolor: "#222",
          color: "#fff",
          border: "1px solid #555",
          borderRadius: "6px",
          fontSize: "11px",
          pointerEvents: "none"
        }}
      >
        <div><b>Komora:</b> {cell.id}</div>
        <div><b>Zboże:</b> {cell.grain || "—"}</div>
        <div><b>Grupa:</b> {cell.groupId || "—"}</div>

        <div style={{ marginTop: "6px" }}>
          <b>Param kluczowy:</b> {cell.param || "—"}
        </div>
        <div><b>Zakres:</b> {cell.paramFrom ?? "—"} – {cell.paramTo ?? "—"}</div>

        <div style={{ marginTop: "6px" }}><b>Białko:</b> {cell.protein ?? "—"}</div>
        <div><b>Wilgotność:</b> {cell.humidity ?? "—"}</div>
        <div><b>Gluten:</b> {cell.gluten ?? "—"}</div>
        <div><b>Opadanie:</b> {cell.opadanie ?? "—"}</div>

        <div style={{ marginTop: "6px" }}>
          <b>Masa:</b> {cell.weight ? (cell.weight / 1000).toFixed(1) + " t" : "—"}
        </div>
        <div><b>Zasyp:</b> {cell.firstFill || "—"}</div>

        <div style={{ marginTop: "6px", color: cell.alarm ? "#ff4444" : "#fff" }}>
          <b>Alarm:</b> {cell.alarm ? "TAK" : "nie"}
        </div>
      </Paper>
    </foreignObject>
  );
}
