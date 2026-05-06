import React from "react";
import { Box, Tooltip } from "@mui/material";

export default function Cell({ cell, onClick }) {
  const { x, y, width, height, temp, alarm } = cell;

  const color =
    alarm === "critical"
      ? "#ff1744"
      : alarm === "warning"
      ? "#ff9100"
      : temp > 40
      ? "#ff3d00"
      : temp > 30
      ? "#ff9100"
      : "#4caf50";

  return (
    <Tooltip title={`Komora ${cell.id} • ${temp}°C`} arrow>
      <Box
        onClick={onClick}
        sx={{
          position: "absolute",
          left: x,
          top: y,
          width,
          height,
          background: color,
          border: "1px solid #222",
          cursor: "pointer",
          transition: "0.2s",
          "&:hover": {
            opacity: 0.8,
          },
        }}
      />
    </Tooltip>
  );
}
