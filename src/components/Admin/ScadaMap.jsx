// src/components/Admin/ScadaMap.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import CellBase from "./CellBase";

export default function ScadaMap() {
  const [cellsData, setCellsData] = useState({});

  useEffect(() => {
    const loadCells = async () => {
      try {
        const snap = await getDocs(collection(db, "cells"));
        const data = {};
        snap.forEach((doc) => {
          data[doc.id] = doc.data();
        });
        setCellsData(data);
      } catch (err) {
        console.error("Błąd ładowania komór:", err);
      }
    };

    loadCells();
  }, []);

  const getCell = (id) => {
    return cellsData[id] || {
      id,
      grain: "puste",
      weight: null,
      params: {},
      avgTemp: null,
      firstFill: null,
    };
  };

  const GRAIN_COLORS = {
    pszenica: {
      high: "#f4a742",
      low: "#f7c97a",
    },
    zyto: "#8BC34A",
    owies: "#FFEB3B",
    jeczmien: "#4FC3F7",
    pellet: "#BCAAA4",
    "pellet-otreby": "#D7CCC8",
    puste: "#666",
  };

  const getCellColor = (cell) => {
    const grain = cell.grain;

    if (!grain || grain === "puste") return "#666";

    if (grain === "pszenica") {
      const protein = cell.params?.bialko;
      if (protein !== undefined && protein < 11) {
        return GRAIN_COLORS.pszenica.low;
      }
      return GRAIN_COLORS.pszenica.high;
    }

    return GRAIN_COLORS[grain] || "#999";
  };

  const getCellBorder = (cell) => {
    const temp = cell.avgTemp;
    const moist = cell.params?.wilgotnosc;

    const TEMP_LIMIT = 35;
    const MOIST_LIMIT = 15;

    if (
      (temp !== null && temp > TEMP_LIMIT) ||
      (moist !== undefined && moist > MOIST_LIMIT)
    ) {
      return "3px solid #ff0000";
    }

    return "1px solid #333";
  };

  const sRows = [
    Array.from({ length: 10 }, (_, i) => `${i + 1}S`),
    Array.from({ length: 10 }, (_, i) => `${i + 11}S`),
    Array.from({ length: 10 }, (_, i) => `${i + 21}S`),
    Array.from({ length: 10 }, (_, i) => `${i + 31}S`),
  ];

  const nTop = Array.from({ length: 10 }, (_, i) => `${(i + 1) * 2}N`);
  const nBottom = Array.from({ length: 10 }, (_, i) => `${i * 2 + 1}N`);

  const gMain = Array.from({ length: 5 }, (_, i) => `${i + 21}G`);

  const wydawcze = Array.from({ length: 10 }, (_, i) => `${i + 43}`);

  return (
    <Box
      sx={{
        p: 2,
        color: "#fff",
        width: "100%",
        height: "calc(100vh - 80px)",
        overflow: "auto",
        bgcolor: "#020617",
      }}
    >
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        Mapa elewatora — dane z Firestore
      </Typography>

      {/* Segment S */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Segment S (1S–40S)
        </Typography>

        {sRows.map((row, idx) => (
          <Box
            key={`s-row-${idx}`}
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(10, 1fr)",
              gap: 0.5,
              gridAutoRows: "48px",
              width: "100%",
            }}
          >
            {row.map((id) => {
              const cell = getCell(id);
              return (
                <CellBase
                  key={id}
                  {...cell}
                  color={getCellColor(cell)}
                  border={getCellBorder(cell)}
                />
              );
            })}
          </Box>
        ))}
      </Box>

      {/* Segment N */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Segment N (1N–20N)
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(10, 1fr)",
            gap: 0.5,
            gridAutoRows: "48px",
            width: "100%",
          }}
        >
          {nTop.map((id) => {
            const cell = getCell(id);
            return (
              <CellBase
                key={id}
                {...cell}
                color={getCellColor(cell)}
                border={getCellBorder(cell)}
              />
            );
          })}
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(10, 1fr)",
            gap: 0.5,
            gridAutoRows: "48px",
            width: "100%",
          }}
        >
          {nBottom.map((id) => {
            const cell = getCell(id);
            return (
              <CellBase
                key={id}
                {...cell}
                color={getCellColor(cell)}
                border={getCellBorder(cell)}
              />
            );
          })}
        </Box>
      </Box>

      {/* Segment G */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Segment G (21G–25G)
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 0.5,
            gridAutoRows: "48px",
            width: "100%",
          }}
        >
          {gMain.map((id) => {
            const cell = getCell(id);
            return (
              <CellBase
                key={id}
                {...cell}
                color={getCellColor(cell)}
                border={getCellBorder(cell)}
              />
            );
          })}
        </Box>
      </Box>

      {/* Wydawcze */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Komory wydawcze (43–52)
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(10, 1fr)",
            gap: 0.5,
            gridAutoRows: "48px",
            width: "100%",
          }}
        >
          {wydawcze.map((id) => {
            const cell = getCell(id);
            return (
              <CellBase
                key={id}
                {...cell}
                color={getCellColor(cell)}
                border={getCellBorder(cell)}
              />
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
