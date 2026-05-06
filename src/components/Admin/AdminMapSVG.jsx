// src/components/Admin/AdminMapSVG.jsx

import React from "react";
import { useElevator } from "../../context/ElevatorContext";

export default function AdminMapSVG() {
  const { cells, selectedCell, setSelectedCell } = useElevator();

  console.log("CELLS:", cells); // ← TO JEST OK, JEST WEWNĄTRZ FUNKCJI

  if (!cells || cells.length === 0) {
    return (
      <div style={{ padding: 20, color: "white" }}>
        Brak danych mapy — cells jest puste lub undefined
      </div>
    );
  }

  function handleSelect(id) {
    setSelectedCell(id);
  }

  return (
    <div style={{ padding: 20 }}>
      <svg
        viewBox="0 0 1000 1000"
        width="100%"
        height="auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {cells.map((cell) => (
          <CellRect
            key={cell.id}
            cell={cell}
            isSelected={selectedCell === cell.id}
            onSelect={handleSelect}
          />
        ))}
      </svg>
    </div>
  );
}

function CellRect({ cell, isSelected, onSelect }) {
  const fillColor = getFillColor(cell);

  return (
    <rect
      x={cell.x}
      y={cell.y}
      width={cell.w}
      height={cell.h}
      fill={fillColor}
      stroke={
        cell.specialFlag
          ? "#00BFFF"
          : cell.alarm
          ? "#ff0000"
          : isSelected
          ? "#000000"
          : "#424242"
      }
      strokeWidth={cell.specialFlag ? 4 : cell.alarm ? 3 : isSelected ? 3 : 1}
      onClick={() => onSelect(cell.id)}
      style={{ cursor: "pointer" }}
    />
  );
}

function getFillColor(cell) {
  if (!cell.grain) return "#E0E0E0";

  const g = cell.grain.toLowerCase();

  switch (g) {
    case "pszenica":
      return "#f4d03f";
    case "zyto":
      return "#a569bd";
    case "jeczmien":
      return "#52be80";
    case "owies":
      return "#5dade2";
    case "kukurydza":
      return "#f5b041";
    default:
      return "#D5D8DC";
  }
}
