import React from "react";
import { Box } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

const GRAIN_COLORS = {
  pszenica: "#d98e04",
  zyto: "#7fbf3f",
  owies: "#e6d54a",
  jeczmien: "#4fa3d1",
  kukurydza: "#ffb300",
  pellet: "#999",
  puste: "#777"
};

export default function CellScada({ id, grain, avg, warn, alarm }) {
  // Normalizacja nazwy zboża
  const normalizedGrain = (grain || "puste").toLowerCase();

  // Kolor tła komórki
  const bg = GRAIN_COLORS[normalizedGrain] ?? "#777";

  // Bezpieczne wartości progów
  const warnLimit = typeof warn === "number" ? warn : 30;
  const alarmLimit = typeof alarm === "number" ? alarm : 40;

  // Bezpieczna obsługa avg
  const safeAvg = typeof avg === "number" ? avg : null;

  let statusIcon = null;

  if (safeAvg !== null && safeAvg >= alarmLimit) {
    statusIcon = <WarningIcon sx={{ color: "#d32f2f", fontSize: 22 }} />;
  } else if (safeAvg !== null && safeAvg >= warnLimit) {
    statusIcon = (
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: "#f9a825"
        }}
      />
    );
  } else {
    statusIcon = (
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: "#4caf50"
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: 120,
        background: bg,
        border: "2px solid #333",
        borderRadius: 1,
        cursor: "pointer",
        "&:hover": { borderColor: "#4fc3f7" }
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 4,
          right: 4
        }}
      >
        {statusIcon}
      </Box>

      <Box
        sx={{
          position: "absolute",
          bottom: 4,
          left: 4,
          color: "#fff",
          fontWeight: "bold"
        }}
      >
        {id}
      </Box>
    </Box>
  );
}
