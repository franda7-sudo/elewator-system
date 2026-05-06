// scripts/parseDallasDat.js
import fs from "fs";
import { mapPhysicalChamberToCellId } from "../src/utils/dallasMap.js";

export function parseDallasDat(path) {
  const raw = fs.readFileSync(path, "utf8");
  const lines = raw.split("\n");

  const result = {};

  for (const line of lines) {
    if (!line.startsWith(".Komora:")) continue;

    const parts = line.replace(".Komora:", "").trim().split(/\s+/);

    const chamberNumber = Number(parts[0]);
    const cellId = mapPhysicalChamberToCellId(chamberNumber);
    if (!cellId) continue;

    const sensors = parts.slice(1).map((v, idx) => {
      if (v === "----") {
        return {
          id: `sensor_${idx + 1}`,
          temp: null,
          fault: true,
        };
      }
      return {
        id: `sensor_${idx + 1}`,
        temp: Number(v.replace(",", ".")),
        fault: false,
      };
    });

    result[cellId] = sensors;
  }

  return result;
}
